exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { roomName } = JSON.parse(event.body || '{}')
  if (!roomName) {
    return { statusCode: 400, body: JSON.stringify({ error: 'roomName is required' }) }
  }

  const apiKey = process.env.DAILY_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'DAILY_API_KEY is not configured on the server' }) }
  }

  const res = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      name: roomName,
      privacy: 'private',
      properties: {
        enable_prejoin_ui: true,
        enable_chat: true,
        enable_screenshare: true,
        exp: Math.floor(Date.now() / 1000) + 86400 * 30,
      },
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: data.error || 'Failed to create Daily.co room' }),
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: data.url, name: data.name }),
  }
}
