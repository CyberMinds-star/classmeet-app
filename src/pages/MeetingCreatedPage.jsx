import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import MeetingCard from '../components/MeetingCard'

export default function MeetingCreatedPage() {
  const { roomId } = useParams()
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMeeting() {
      const { data } = await supabase
        .from('meetings')
        .select('*')
        .eq('room_id', roomId)
        .single()
      setMeeting(data)
      setLoading(false)
    }
    fetchMeeting()
  }, [roomId])

  if (loading) return <div className="text-center py-16 text-gray-400">Loading...</div>
  if (!meeting) return <div className="text-center py-16 text-gray-400">Meeting not found.</div>

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="mb-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h1 className="text-2xl font-bold text-gray-900">Meeting Created!</h1>
        <p className="text-gray-500 text-sm mt-1">Share the link and passcode with your students.</p>
      </div>
      <MeetingCard meeting={meeting} />
      <div className="mt-6 flex gap-3 flex-col sm:flex-row">
        <Link
          to={`/room/${roomId}`}
          className="flex-1 bg-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Start Class Now
        </Link>
        <Link
          to="/create"
          className="flex-1 border border-gray-300 text-gray-700 text-center py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
        >
          Create Another
        </Link>
      </div>
    </div>
  )
}
