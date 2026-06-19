export default function DailyEmbed({ roomUrl, token }) {
  const src = `${roomUrl}?t=${encodeURIComponent(token)}`

  return (
    <iframe
      key={src}
      src={src}
      allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      title="ClassMeet Video"
    />
  )
}
