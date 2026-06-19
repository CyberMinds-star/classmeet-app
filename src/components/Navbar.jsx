import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">
          ClassMeet
        </Link>
        <div className="flex gap-4 items-center text-sm font-medium">
          <Link to="/join" className="text-gray-600 hover:text-blue-600 transition">Join</Link>
          <Link to="/my-meetings" className="text-gray-600 hover:text-blue-600 transition">My Meetings</Link>
          <Link
            to="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Start Meeting
          </Link>
        </div>
      </div>
    </nav>
  )
}
