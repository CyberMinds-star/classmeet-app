import { useEffect, useRef } from 'react'

export default function JitsiEmbed({ roomId, displayName }) {
  const containerRef = useRef(null)
  const apiRef = useRef(null)

  useEffect(() => {
    function loadJitsi() {
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement('script')
        script.src = 'https://meet.jit.si/external_api.js'
        script.onload = initJitsi
        document.head.appendChild(script)
      } else {
        initJitsi()
      }
    }

    function initJitsi() {
      if (apiRef.current) apiRef.current.dispose()
      apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName: roomId,
        parentNode: containerRef.current,
        userInfo: { displayName: displayName || 'Guest' },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          prejoinPageEnabled: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'raisehand',
            'videoquality', 'tileview', 'help',
          ],
        },
      })
    }

    loadJitsi()

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose()
        apiRef.current = null
      }
    }
  }, [roomId, displayName])

  return <div ref={containerRef} className="w-full h-full" />
}
