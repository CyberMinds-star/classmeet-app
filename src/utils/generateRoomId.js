export function generateRoomId() {
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 12)
  return `classmeet-${id}`
}
