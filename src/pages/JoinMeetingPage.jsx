import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function JoinMeetingPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const val = input.trim()
    if (!val) return

    // Try to extract roomId from a full URL
    try {
      const url = new URL(val)
      const parts = url.pathname.split('/')
      const idx = parts.indexOf('room')
      if (idx !== -1 && parts[idx + 1]) {
        navigate(`/room/${parts[idx + 1]}`)
        return
      }
    } catch {
      // not a URL — treat as room ID directly
    }

    if (val.startsWith('classmeet-')) {
      navigate(`/room/${val}`)
    } else {
      setError('Please paste a valid meeting link (e.g. https://…/room/classmeet-…)')
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Join a Meeting</h1>
      <p className="text-gray-500 mb-8">Paste the meeting link you received from your teacher.</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link or Room ID</label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="https://classmeet.netlify.app/room/classmeet-..."
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Continue
        </button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-6">
        You'll be asked for the passcode on the next screen.
      </p>
    </div>
  )
}
