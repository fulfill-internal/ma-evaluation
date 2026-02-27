const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = 'team@fulfill.com';

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export async function sendTemplateEmail(
  to: string,
  templateId: string,
  dynamicData: Record<string, string>,
): Promise<void> {
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }], dynamic_template_data: dynamicData }],
      from: { email: FROM_EMAIL, name: 'Fulfill M&A' },
      template_id: templateId,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SendGrid error: ${res.status} ${text}`);
  }
}

export async function sendEmail(to: string | string[], subject: string, htmlContent: string): Promise<void> {
  const recipients = Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }];
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: recipients }],
      from: { email: FROM_EMAIL, name: 'Fulfill M&A' },
      subject,
      content: [{ type: 'text/html', value: htmlContent }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SendGrid error: ${res.status} ${text}`);
  }
}
