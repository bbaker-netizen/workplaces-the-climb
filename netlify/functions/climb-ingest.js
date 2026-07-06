// Same-site proxy for The Climb -> The Builder ingest.
//
// Why this exists: The Climb is a public, client-side-only static site (no build step,
// no backend). If the ingest secret lived in the browser JS, anyone using "View Source"
// could lift it and POST arbitrary files to The Builder's ingest endpoint. This function
// runs server-side on Netlify, holds the real secret as an environment variable, and is
// the only thing that ever talks to builder.4workplaces.com with the Bearer token attached.
//
// The browser POSTs its multipart/form-data body here (same origin, no CORS needed);
// this function forwards the raw bytes upstream, unchanged, plus the Authorization header.
//
// Required Netlify env var (Site configuration -> Environment variables):
//   THE_CLIMB_INGEST_SECRET = <the Bearer token The Builder expects>

const BUILDER_INGEST_URL = 'https://builder.4workplaces.com/api/the-climb/ingest';

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const secret = process.env.THE_CLIMB_INGEST_SECRET;
  if (!secret) {
    console.error('THE_CLIMB_INGEST_SECRET is not set in this Netlify site\'s environment variables.');
    return { statusCode: 500, body: 'Server is not configured to send to The Builder yet.' };
  }

  const contentType = event.headers['content-type'] || event.headers['Content-Type'];
  if (!contentType) {
    return { statusCode: 400, body: 'Missing Content-Type header.' };
  }

  const bodyBuffer = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64')
    : Buffer.from(event.body || '', 'utf8');

  try {
    const upstream = await fetch(BUILDER_INGEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Authorization: 'Bearer ' + secret,
      },
      body: bodyBuffer,
    });

    const text = await upstream.text();
    return {
      statusCode: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') || 'text/plain' },
      body: text,
    };
  } catch (err) {
    console.error('climb-ingest proxy failed to reach The Builder:', err);
    return { statusCode: 502, body: JSON.stringify({ error: 'Could not reach The Builder.' }) };
  }
};
