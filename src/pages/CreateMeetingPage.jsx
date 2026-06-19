import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { generateRoomId } from '../utils/generateRoomId'
import { generatePasscode } from '../utils/generatePasscode'
import { saveMeeting } from '../utils/localMeetings'

export default function CreateMeetingPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const room_id = generateRoomId()
      const passcode = generatePasscode()

      // Create the Daily.co room via Netlify Function
      const roomRes = await fetch('/.netlify/functions/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: room_id }),
      })
      const roomData = await roomRes.json()
      if (!roomRes.ok) throw new Error(roomData.error || 'Failed to create video room')

      const meeting = {
        room_id,
        title: title.trim(),
        passcode,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        room_url: roomData.url,
      }

      // Insert into Supabase with retry
      let dbError = null
      for (let attempt = 0; attempt <= 2; attempt++) {
        const { error } = await supabase.from('meetings').insert([meeting])
        if (!error) { dbError = null; break }
        dbError = error
        if (attempt < 2) await new Promise(r => setTimeout(r, 800))
      }
      if (dbError) throw dbError

      saveMeeting(meeting)
      navigate(`/created/${room_id}`)
    } catch (err) {
      setError(err?.message || 'Failed to create meeting. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create a Meeting</h1>
      <p className="text-gray-500 mb-8">Fill in the details and get a shareable link + passcode.</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Math Class – Grade 10"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Schedule Date & Time <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={e => setScheduledAt(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Creating...' : 'Create Meeting'}
        </button>
      </form>
    </div>
  )
}
