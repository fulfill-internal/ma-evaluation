import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './_lib/sendgrid';

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

const EMAIL_THRESHOLDS_HOURS = [1, 24, 72];

const EMAIL_TEMPLATES = [
  {
    subject: 'Your 3PL valuation is waiting',
    heading: "You're Almost There",
    body: "You started your confidential 3PL valuation but didn't finish. It only takes a few more minutes to see what your business could be worth.",
    cta: 'Continue My Valuation',
  },
  {
    subject: "You're just a few questions away from your valuation",
    heading: 'Pick Up Where You Left Off',
    body: "You're close to getting your personalized 3PL valuation. We saved your progress — just click below to continue right where you left off.",
    cta: 'Finish My Valuation',
  },
  {
    subject: 'Last chance: see what your 3PL is worth',
    heading: "Don't Miss Out",
    body: "This is our final reminder. Your partially completed valuation is still saved, but we'll remove it soon. Take 3 minutes to finish and discover what your 3PL could be worth.",
    cta: 'Get My Valuation Now',
  },
];

function buildRecoveryEmail(template: typeof EMAIL_TEMPLATES[number], resumeUrl: string): string {
  return `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #1A1A2E; font-size: 24px;">${template.heading}</h1>
      <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 16px 0 24px;">${template.body}</p>
      <a href="${resumeUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1B76FF, #29359D); color: #fff; font-size: 16px; font-weight: 700; border-radius: 100px; text-decoration: none;">${template.cta}</a>
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
      <p style="color: #9CA3AF; font-size: 12px;">
        You received this email because you started a valuation at Fulfill. If you didn't request this, you can safely ignore it.
      </p>
    </div>
  `;
}

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

      const template = EMAIL_TEMPLATES[emailIndex];
      const resumeUrl = `${APP_URL}?resume=${eval_.id}`;
      const html = buildRecoveryEmail(template, resumeUrl);

      await sendEmail(eval_.email, template.subject, html);

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
