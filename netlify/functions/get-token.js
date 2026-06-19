exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { roomName, isOwner, userName } = JSON.parse(event.body || '{}')
  if (!roomName) {
    return { statusCode: 400, body: JSON.stringify({ error: 'roomName is required' }) }
  }

  const apiKey = process.env.DAILY_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'DAILY_API_KEY is not configured on the server' }) }
  }

  const res = await fetch('https://api.daily.co/v1/meeting-tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        is_owner: Boolean(isOwner),
        user_name: userName || 'Guest',
        enable_screenshare: Boolean(isOwner),
        start_video_off: false,
        start_audio_off: false,
        exp: Math.floor(Date.now() / 1000) + 7200,
      },
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: data.error || 'Failed to get meeting token' }),
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: data.token }),
  }
}
