// Quick local test script — run with: node --env-file=.env test-abandoned.mjs
import { createClient } from '@supabase/supabase-js';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = process.env.APP_URL || 'https://fulfill.com/evaluate';

const ABANDONED_TEMPLATE_ID = 'd-e95b79a28c7744078d3025b7d3e544d4';
const FROM_EMAIL = 'team@fulfill.com';
const EMAIL_THRESHOLDS_HOURS = [1 / 60, 1 / 60, 1 / 60];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const now = new Date();

const { data: evaluations, error } = await supabase
  .from('evaluations')
  .select('id, email, current_section, abandoned_email_count, last_abandoned_email_at, created_at')
  .eq('status', 'started')
  .lt('abandoned_email_count', 3);

if (error) { console.error('Supabase error:', error); process.exit(1); }

console.log(`Found ${evaluations.length} candidate evaluation(s)`);

let sentCount = 0;

for (const eval_ of evaluations) {
  const emailIndex = eval_.abandoned_email_count;
  const thresholdHours = EMAIL_THRESHOLDS_HOURS[emailIndex];
  if (!thresholdHours) continue;

  const anchorTime = eval_.last_abandoned_email_at
    ? new Date(eval_.last_abandoned_email_at)
    : new Date(eval_.created_at);

  const hoursSinceAnchor = (now.getTime() - anchorTime.getTime()) / (1000 * 60 * 60);
  const hoursSinceCreation = (now.getTime() - new Date(eval_.created_at).getTime()) / (1000 * 60 * 60);

  let shouldSend = false;
  if (emailIndex === 0) {
    shouldSend = hoursSinceCreation >= thresholdHours;
  } else {
    shouldSend = hoursSinceAnchor >= (EMAIL_THRESHOLDS_HOURS[emailIndex] - EMAIL_THRESHOLDS_HOURS[emailIndex - 1]);
    shouldSend = shouldSend && hoursSinceCreation >= thresholdHours;
  }

  if (!shouldSend) {
    console.log(`Skipping ${eval_.email} (id ${eval_.id}) — not time yet (${hoursSinceCreation.toFixed(2)}h since creation)`);
    continue;
  }

  const resumeUrl = `${APP_URL}?resume=${eval_.id}`;
  console.log(`Sending to ${eval_.email} (eval ${eval_.id}, email #${emailIndex + 1}), resume_url: ${resumeUrl}`);

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: eval_.email }], dynamic_template_data: { resume_url: resumeUrl } }],
      from: { email: FROM_EMAIL, name: 'Fulfill M&A' },
      template_id: ABANDONED_TEMPLATE_ID,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`SendGrid error for ${eval_.email}: ${res.status} ${text}`);
    continue;
  }

  console.log(`✓ Sent to ${eval_.email}`);

  await supabase
    .from('evaluations')
    .update({
      abandoned_email_count: emailIndex + 1,
      last_abandoned_email_at: now.toISOString(),
    })
    .eq('id', eval_.id);

  sentCount++;
}

console.log(`\nDone. Sent ${sentCount} email(s).`);
