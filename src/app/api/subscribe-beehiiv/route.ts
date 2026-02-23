export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email: string };
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
    const automationId = process.env.BEEHIIV_MA_AUTOMATION_ID;
    if (!apiKey || !publicationId) {
      return Response.json({ error: 'beehiiv not configured' }, { status: 500 });
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

    return Response.json({ success: true });
  } catch (error) {
    console.error('subscribe-beehiiv error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
