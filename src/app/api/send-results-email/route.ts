import { sendEmail, formatCurrency } from '@/lib/sendgrid';

const INTERNAL_RECIPIENTS = ['greg@fulfill.com', 'taylor@fulfill.com'];

interface RequestBody {
  evaluationId: string;
  email: string;
  valuationLow: number;
  valuationHigh: number;
  ebitdaMultipleLow: number;
  ebitdaMultipleHigh: number;
  estimatedEbitda: number;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { email, valuationLow, valuationHigh, ebitdaMultipleLow, ebitdaMultipleHigh, estimatedEbitda } = body;

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
    await sendEmail(email, 'Your 3PL Valuation Results — Fulfill M&A', userHtml);

    // Email to internal team
    const internalHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>New M&A Evaluation Completed</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Evaluation ID:</td><td style="padding: 8px;">${body.evaluationId}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Valuation Range:</td><td style="padding: 8px;">${valRange}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Multiple Range:</td><td style="padding: 8px;">${multRange}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Est. EBITDA:</td><td style="padding: 8px;">${formatCurrency(estimatedEbitda)}</td></tr>
        </table>
        <p style="margin-top: 16px;">View full details in the <a href="https://app.supabase.com">Supabase dashboard</a>.</p>
      </div>
    `;
    for (const recipient of INTERNAL_RECIPIENTS) {
      await sendEmail(recipient, `New 3PL Valuation: ${valRange} — ${email}`, internalHtml);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('send-results-email error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
