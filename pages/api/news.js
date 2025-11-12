export default async function handler(req, res) {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'News API key is not configured.' });
    return;
  }

  // Free tier doesn't support from_date/to_date, use latest news
  const params = new URLSearchParams({
    apikey: apiKey,
    language: 'en',
    category: 'top',
    country: 'us,gb,ca,au',
    size: '10'
  });

  try {
    const response = await fetch(`https://newsdata.io/api/1/news?${params.toString()}`);
    if (!response.ok) {
      const text = await response.text();
      res.status(response.status).json({ error: `News request failed: ${text}` });
      return;
    }

    const payload = await response.json();
    res.status(200).json({ articles: Array.isArray(payload?.results) ? payload.results : [] });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected error fetching news.' });
  }
}