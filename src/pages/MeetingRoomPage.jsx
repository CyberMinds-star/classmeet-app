import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PasscodeGate from '../components/PasscodeGate'
import JitsiEmbed from '../components/JitsiEmbed'

export default function MeetingRoomPage() {
  const { roomId } = useParams()
  const [meeting, setMeeting] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [nameEntered, setNameEntered] = useState(false)

  if (!meeting) {
    return <PasscodeGate roomId={roomId} onSuccess={setMeeting} />
  }

  if (!nameEntered) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">What's your name?</h2>
          <p className="text-sm text-gray-500 mb-6">This will be shown to others in the class: <strong>{meeting.title}</strong></p>
          <form onSubmit={e => { e.preventDefault(); setNameEntered(true) }} className="space-y-4">
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!displayName.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Join Class
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 top-14">
      <JitsiEmbed roomId={roomId} displayName={displayName} />
    </div>
  )
}
