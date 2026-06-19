import CopyButton from './CopyButton'

export default function MeetingCard({ meeting, onDelete }) {
  const meetingUrl = `${window.location.origin}/room/${meeting.room_id}`

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{meeting.title}</h3>
          {meeting.scheduled_at && (
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(meeting.scheduled_at).toLocaleString()}
            </p>
          )}
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(meeting.room_id)}
            className="text-xs text-red-400 hover:text-red-600 transition flex-shrink-0"
          >
            Remove
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Meeting Link</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-blue-600 truncate flex-1 font-mono">{meetingUrl}</p>
            <CopyButton text={meetingUrl} label="Copy Link" />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Passcode</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold tracking-widest text-gray-900">{meeting.passcode}</p>
            <CopyButton text={meeting.passcode} label="Copy" />
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
        Share the link + passcode with your students to let them join.
      </div>
    </div>
  )
}
