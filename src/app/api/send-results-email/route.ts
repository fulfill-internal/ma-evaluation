import { sendEmail, formatCurrency } from '@/lib/sendgrid';
import { surveySections } from '@/data/questions';

const INTERNAL_RECIPIENTS = ['greg@fulfill.com', 'taylor@fulfill.com'];

interface RequestBody {
  evaluationId: string;
  email: string;
  valuationLow: number;
  valuationHigh: number;
  ebitdaMultipleLow: number;
  ebitdaMultipleHigh: number;
  estimatedEbitda: number;
  answers?: Record<string, string | string[]>;
}

function getAnswerLabel(questionId: string, value: string | string[]): string {
  for (const section of surveySections) {
    const question = section.questions.find(q => q.id === questionId);
    if (!question?.options) continue;
    if (Array.isArray(value)) {
      return value
        .map(v => question.options!.find(o => o.value === v)?.label ?? v)
        .join(', ');
    }
    return question.options.find(o => o.value === value)?.label ?? String(value);
  }
  return Array.isArray(value) ? value.join(', ') : String(value);
}


export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { evaluationId, email, valuationLow, valuationHigh, ebitdaMultipleLow, ebitdaMultipleHigh, estimatedEbitda } = body;

    // Validate required fields
    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Invalid or missing email address' }, { status: 400 });
    }
    if (!evaluationId || typeof evaluationId !== 'string') {
      return Response.json({ error: 'Invalid or missing evaluationId' }, { status: 400 });
    }
    const numericFields = { valuationLow, valuationHigh, ebitdaMultipleLow, ebitdaMultipleHigh, estimatedEbitda };
    for (const [key, value] of Object.entries(numericFields)) {
      if (typeof value !== 'number' || isNaN(value)) {
        return Response.json({ error: `Invalid or missing numeric field: ${key}` }, { status: 400 });
      }
    }

    const valRange = `${formatCurrency(valuationLow)} – ${formatCurrency(valuationHigh)}`;
    const multRange = `${ebitdaMultipleLow.toFixed(1)}x – ${ebitdaMultipleHigh.toFixed(1)}x`;

    // Email to user
    const userHtml = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1A1A2E; font-size: 24px;">Your 3PL Valuation Results</h1>
        <p style="color: #6B7280; font-size: 16px; line-height: 1.6;">
          Thank you for completing the Fulfill M&A evaluation tool. Here's a summary of your estimated valuation:
        </p>
        <div style="background: linear-gradient(135deg, #1B76FF, #29359D); border-radius: 12px; padding: 32px; text-align: center; margin: 24px 0;">
          <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0 0 8px;">Estimated Enterprise Value</p>
          <p style="color: #fff; font-size: 36px; font-weight: 800; margin: 0;">${valRange}</p>
          <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 8px 0 0;">${multRange} EBITDA Multiple</p>
        </div>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
          Estimated EBITDA: ${formatCurrency(estimatedEbitda)}
        </p>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
          Want to discuss your options? Our M&A team will reach out within 1 business day, or you can
          <a href="https://fulfill.com/contact" style="color: #1B76FF;">schedule a call</a> directly.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
        <p style="color: #9CA3AF; font-size: 12px;">
          This valuation is an estimate based on industry benchmarks and self-reported data. It is not a formal appraisal.
        </p>
      </div>
    `;

    // Email to internal team — single email to both recipients (same thread)
    let answersHtml = '';
    if (body.answers && Object.keys(body.answers).length > 0) {
      const answerRows = surveySections.flatMap(section =>
        section.questions
          .filter(q => body.answers![q.id] !== undefined)
          .map(q => `
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top; width: 40%; border-bottom: 1px solid #E5E7EB;">${q.text}</td>
              <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${getAnswerLabel(q.id, body.answers![q.id])}</td>
            </tr>
          `)
      ).join('');
      answersHtml = `
        <h3 style="margin-top: 24px; color: #1A1A2E;">Form Responses</h3>
        <table style="width: 100%; border-collapse: collapse;">${answerRows}</table>
      `;
    }

    const internalHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
        <h2>New M&A Evaluation Completed</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Evaluation ID:</td><td style="padding: 8px;">${evaluationId}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Valuation Range:</td><td style="padding: 8px;">${valRange}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Multiple Range:</td><td style="padding: 8px;">${multRange}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Est. EBITDA:</td><td style="padding: 8px;">${formatCurrency(estimatedEbitda)}</td></tr>
        </table>
        ${answersHtml}
        <p style="margin-top: 16px;">View full details in the <a href="https://app.supabase.com">Supabase dashboard</a>.</p>
      </div>
    `;

    // Fire user email + single internal email concurrently
    const results = await Promise.allSettled([
      sendEmail(email, 'Your 3PL Valuation Results — Fulfill M&A', userHtml),
      sendEmail(INTERNAL_RECIPIENTS, `New 3PL Valuation: ${valRange} — ${email}`, internalHtml),
    ]);

    for (const result of results) {
      if (result.status === 'rejected') {
        console.warn('Partial email send failure:', result.reason);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('send-results-email error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
