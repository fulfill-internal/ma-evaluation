import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body as { email: string };
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
    const automationId = process.env.BEEHIIV_MA_AUTOMATION_ID;
    if (!apiKey || !publicationId) {
      return res.status(500).json({ error: 'beehiiv not configured' });
    }

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          utm_source: 'ma-evaluation',
          ...(automationId && { automation_ids: [automationId] }),
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`beehiiv API ${response.status}: ${text}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('subscribe-beehiiv error:', error);
    return res.status(500).json({ error: String(error) });
  }
}
