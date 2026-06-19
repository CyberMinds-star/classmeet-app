import { useEffect, useRef, useState } from 'react'

const HOST_TOOLBAR = [
  'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
  'fodeviceselection', 'hangup', 'chat', 'raisehand', 'videoquality',
  'tileview', 'participants-pane', 'security', 'mute-everyone',
  'select-background', 'stats', 'shortcuts', 'help',
]

const GUEST_TOOLBAR = [
  'microphone', 'camera', 'fullscreen', 'hangup', 'chat',
  'raisehand', 'tileview', 'select-background',
]

export default function JitsiEmbed({ roomId, displayName, isHost, onApiReady }) {
  const containerRef = useRef(null)
  const apiRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [reconnectKey, setReconnectKey] = useState(0)

  useEffect(() => {
    let disposed = false

    function initJitsi() {
      if (disposed) return
      if (apiRef.current) {
        apiRef.current.dispose()
        apiRef.current = null
      }

      setStatus('loading')

      try {
        apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
          roomName: roomId,
          parentNode: containerRef.current,
          userInfo: { displayName: displayName || 'Guest' },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            prejoinPageEnabled: true,
            p2p: { enabled: true, preferH264: true },
            enableNoisyMicDetection: false,
            enableNoAudioDetection: false,
            disableRemoteMute: !isHost,
            disableKick: !isHost,
            // prevent idle disconnect
            callStatsID: '',
            analytics: { disabled: true },
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_BUTTONS: isHost ? HOST_TOOLBAR : GUEST_TOOLBAR,
          },
        })

        // Add required iframe permissions for camera/mic/screen-share
        const iframe = apiRef.current.getIFrame()
        if (iframe) {
          iframe.setAttribute(
            'allow',
            'camera; microphone; fullscreen; display-capture; autoplay; clipboard-write'
          )
        }

        apiRef.current.addEventListeners({
          videoConferenceJoined: () => { if (!disposed) setStatus('connected') },
          videoConferenceLeft: () => { if (!disposed) setStatus('ended') },
          connectionFailed: () => { if (!disposed) setStatus('disconnected') },
          kicked: () => { if (!disposed) setStatus('ended') },
          errorOccurred: ({ error }) => {
            console.error('Jitsi error:', error)
            if (!disposed) setStatus('disconnected')
          },
        })

        if (onApiReady) onApiReady(apiRef.current)
      } catch (err) {
        console.error('Jitsi init error:', err)
        if (!disposed) setStatus('disconnected')
      }
    }

    function loadJitsi() {
      if (window.JitsiMeetExternalAPI) {
        initJitsi()
        return
      }
      // Remove any previous failed script tag
      const existing = document.querySelector('script[src*="meet.jit.si/external_api"]')
      if (existing) existing.remove()

      const script = document.createElement('script')
      script.src = 'https://meet.jit.si/external_api.js'
      script.async = true
      script.onload = initJitsi
      script.onerror = () => { if (!disposed) setStatus('disconnected') }
      document.head.appendChild(script)
    }

    loadJitsi()

    return () => {
      disposed = true
      if (apiRef.current) {
        apiRef.current.dispose()
        apiRef.current = null
      }
    }
  }, [roomId, displayName, isHost, reconnectKey])

  function reconnect() {
    setStatus('loading')
    setReconnectKey(k => k + 1)
  }

  if (status === 'disconnected' || status === 'ended') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white px-4">
          <div className="text-5xl mb-4">{status === 'ended' ? '👋' : '📡'}</div>
          <h3 className="text-xl font-bold mb-2">
            {status === 'ended' ? 'You left the class' : 'Connection lost'}
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            {status === 'ended'
              ? 'The meeting has ended or you were removed.'
              : 'The connection was interrupted. Click below to rejoin.'}
          </p>
          {status === 'disconnected' && (
            <button
              onClick={reconnect}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Reconnect
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center text-white">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400">Connecting to class...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
