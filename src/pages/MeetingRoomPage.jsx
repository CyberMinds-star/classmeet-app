import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PasscodeGate from '../components/PasscodeGate'
import DailyEmbed from '../components/DailyEmbed'
import { getMyMeetings } from '../utils/localMeetings'

export default function MeetingRoomPage() {
  const { roomId } = useParams()
  const [meeting, setMeeting] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [token, setToken] = useState(null)
  const [tokenLoading, setTokenLoading] = useState(false)
  const [tokenError, setTokenError] = useState('')

  const isHost = getMyMeetings().some(m => m.room_id === roomId)

  async function handleJoin(e) {
    e.preventDefault()
    if (!displayName.trim()) return
    setTokenLoading(true)
    setTokenError('')
    try {
      const res = await fetch('/.netlify/functions/get-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: roomId, isOwner: isHost, userName: displayName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to get meeting token')
      setToken(data.token)
    } catch (err) {
      setTokenError(err.message)
    } finally {
      setTokenLoading(false)
    }
  }

  if (!meeting) {
    return <PasscodeGate roomId={roomId} onSuccess={setMeeting} />
  }

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
          <div className="mb-4 text-center">
            {isHost
              ? <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Host</span>
              : <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">Student</span>
            }
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
            {isHost ? 'Start Your Class' : 'Join Class'}
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            <strong>{meeting.title}</strong>
          </p>
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {tokenError && <p className="text-red-500 text-sm">{tokenError}</p>}
            <button
              type="submit"
              disabled={!displayName.trim() || tokenLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {tokenLoading ? 'Preparing room...' : isHost ? 'Start Class' : 'Join Class'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 top-14">
      {isHost && (
        <div className="absolute top-2 right-2 z-50">
          <button
            onClick={() => window.open('/whiteboard', '_blank', 'width=1200,height=700')}
            className="bg-white text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-sm font-semibold shadow hover:bg-blue-50 transition"
          >
            ✏️ Whiteboard
          </button>
        </div>
      )}
      <DailyEmbed roomUrl={meeting.room_url} token={token} />
    </div>
  )
}
