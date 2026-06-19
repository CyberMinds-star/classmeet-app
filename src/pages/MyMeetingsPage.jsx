import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyMeetings, deleteMeeting } from '../utils/localMeetings'
import MeetingCard from '../components/MeetingCard'

export default function MyMeetingsPage() {
  const [meetings, setMeetings] = useState([])

  useEffect(() => {
    setMeetings(getMyMeetings())
  }, [])

  function handleDelete(roomId) {
    deleteMeeting(roomId)
    setMeetings(getMyMeetings())
  }

  if (meetings.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No meetings yet</h2>
        <p className="text-gray-500 mb-6">Meetings you create will appear here.</p>
        <Link
          to="/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition inline-block"
        >
          Create Your First Meeting
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Meetings</h1>
      <p className="text-gray-500 mb-8">All meetings you've created on this device.</p>
      <div className="space-y-4">
        {meetings.map(m => (
          <MeetingCard key={m.room_id} meeting={m} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}
