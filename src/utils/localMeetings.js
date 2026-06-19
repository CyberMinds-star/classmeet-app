const KEY = 'classmeet_my_meetings'

export function getMyMeetings() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveMeeting(meeting) {
  const existing = getMyMeetings()
  const updated = [meeting, ...existing.filter(m => m.room_id !== meeting.room_id)]
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function deleteMeeting(roomId) {
  const updated = getMyMeetings().filter(m => m.room_id !== roomId)
  localStorage.setItem(KEY, JSON.stringify(updated))
}
