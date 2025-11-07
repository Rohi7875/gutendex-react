// Vercel Serverless Function - API Proxy
// This proxies requests to the HTTP API from our HTTPS app

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get query parameters from the request
    const queryString = new URLSearchParams(req.query).toString();

    // Make request to the actual API
    const apiUrl = `http://13.126.242.247/api/v1/books${queryString ? `?${queryString}` : ''}`;

    console.log('Proxying request to:', apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Return the data
    res.status(200).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Failed to fetch from API',
      message: error.message
    });
  }
}

