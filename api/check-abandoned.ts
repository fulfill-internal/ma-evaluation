import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { sendTemplateEmail } from './_lib/sendgrid';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const APP_URL = process.env.APP_URL || 'https://evaluate.fulfill.com';
const CRON_SECRET = process.env.CRON_SECRET || '';

interface AbandonedEval {
  id: string;
  email: string;
  current_section: number;
  abandoned_email_count: number;
  last_abandoned_email_at: string | null;
  created_at: string;
}

const EMAIL_THRESHOLDS_HOURS = [1 / 60, 1 / 60, 1 / 60]; // TODO: restore to [1, 24, 72] after testing
const ABANDONED_TEMPLATE_ID = 'd-e95b79a28c7744078d3025b7d3e544d4';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret (Vercel Cron Jobs send this automatically)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const now = new Date();

    // Query all incomplete evaluations that haven't maxed out recovery emails
    const { data: evaluations, error } = await supabase
      .from('evaluations')
      .select('id, email, current_section, abandoned_email_count, last_abandoned_email_at, created_at')
      .eq('status', 'started')
      .lt('abandoned_email_count', 3);

    if (error) throw error;

    let sentCount = 0;

    for (const eval_ of (evaluations as AbandonedEval[]) || []) {
      const emailIndex = eval_.abandoned_email_count;
      const thresholdHours = EMAIL_THRESHOLDS_HOURS[emailIndex];
      if (!thresholdHours) continue;

      // Calculate time since the relevant anchor
      const anchorTime = eval_.last_abandoned_email_at
        ? new Date(eval_.last_abandoned_email_at)
        : new Date(eval_.created_at);

      const hoursSinceAnchor = (now.getTime() - anchorTime.getTime()) / (1000 * 60 * 60);
      const hoursSinceCreation = (now.getTime() - new Date(eval_.created_at).getTime()) / (1000 * 60 * 60);

      // For the first email: check hours since creation >= 1hr
      // For subsequent: check hours since last email meets the gap
      let shouldSend = false;
      if (emailIndex === 0) {
        shouldSend = hoursSinceCreation >= thresholdHours;
      } else {
        shouldSend = hoursSinceAnchor >= (EMAIL_THRESHOLDS_HOURS[emailIndex] - EMAIL_THRESHOLDS_HOURS[emailIndex - 1]);
        // Also ensure overall time from creation meets the cumulative threshold
        shouldSend = shouldSend && hoursSinceCreation >= thresholdHours;
      }

      if (!shouldSend) continue;

      const resumeUrl = `${APP_URL}?resume=${eval_.id}`;

      await sendTemplateEmail(eval_.email, ABANDONED_TEMPLATE_ID, {
        resume_url: resumeUrl,
      });

      // Update the evaluation record
      await supabase
        .from('evaluations')
        .update({
          abandoned_email_count: emailIndex + 1,
          last_abandoned_email_at: now.toISOString(),
        })
        .eq('id', eval_.id);

      sentCount++;
    }

    return res.status(200).json({ success: true, emailsSent: sentCount });
  } catch (error) {
    console.error('check-abandoned error:', error);
    return res.status(500).json({ error: String(error) });
  }
}
