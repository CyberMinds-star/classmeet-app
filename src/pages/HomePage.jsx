import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Teach & Learn from Anywhere
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          Start a free live video class in seconds. Share a link — your students join instantly. No downloads, no accounts needed.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/create"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-sm"
          >
            Start a Meeting
          </Link>
          <Link
            to="/join"
            className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition"
          >
            Join a Meeting
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { step: '1', title: 'Create a Meeting', desc: 'Enter your class title and optional schedule. Get a unique link and passcode instantly.' },
          { step: '2', title: 'Share with Students', desc: 'Copy the meeting link and 6-digit passcode. Send via WhatsApp, email, or any channel.' },
          { step: '3', title: 'Start Teaching', desc: 'Students enter the passcode and join your live video class — no app download needed.' },
        ].map(item => (
          <div key={item.step} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
              {item.step}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Everything you need to teach online</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: '📹', title: 'Live Video Classes', desc: 'HD video and audio powered by Jitsi Meet — completely free.' },
            { icon: '🔐', title: 'Passcode Protection', desc: 'Each meeting has a unique 6-digit passcode. Only your students get in.' },
            { icon: '📅', title: 'Schedule Classes', desc: 'Plan ahead — schedule your class with a date and time.' },
            { icon: '📋', title: 'Meeting History', desc: 'All your meetings saved. Share the same class link anytime.' },
            { icon: '💬', title: 'In-Class Chat', desc: 'Built-in text chat during the video session.' },
            { icon: '🖥️', title: 'Screen Sharing', desc: 'Share your screen or whiteboard to teach effectively.' },
          ].map(f => (
            <div key={f.title} className="flex gap-3 items-start">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
