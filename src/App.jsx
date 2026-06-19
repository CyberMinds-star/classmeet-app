import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CreateMeetingPage from './pages/CreateMeetingPage'
import MeetingCreatedPage from './pages/MeetingCreatedPage'
import JoinMeetingPage from './pages/JoinMeetingPage'
import MeetingRoomPage from './pages/MeetingRoomPage'
import MyMeetingsPage from './pages/MyMeetingsPage'
import WhiteboardPage from './pages/WhiteboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateMeetingPage />} />
            <Route path="/created/:roomId" element={<MeetingCreatedPage />} />
            <Route path="/join" element={<JoinMeetingPage />} />
            <Route path="/room/:roomId" element={<MeetingRoomPage />} />
            <Route path="/my-meetings" element={<MyMeetingsPage />} />
            <Route path="/whiteboard" element={<WhiteboardPage />} />
          </Routes>
        </main>
        <footer className="text-center py-4 text-sm text-gray-400 border-t border-gray-200">
          ClassMeet — Free online class video platform
        </footer>
      </div>
    </BrowserRouter>
  )
}
