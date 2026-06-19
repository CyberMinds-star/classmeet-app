import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function PasscodeGate({ roomId, onSuccess }) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: dbError } = await supabase
        .from('meetings')
        .select('*')
        .eq('room_id', roomId)
        .single()

      if (dbError || !data) {
        setError('Meeting not found. Check the link and try again.')
        return
      }
      if (data.passcode !== passcode.trim()) {
        setError('Wrong passcode. Please try again.')
        return
      }
      onSuccess(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Join Meeting</h2>
        <p className="text-sm text-gray-500 mb-6">Enter the 6-digit passcode to join this class.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
            placeholder="000000"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || passcode.length !== 6}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Checking...' : 'Enter Class'}
          </button>
        </form>
      </div>
    </div>
  )
}
