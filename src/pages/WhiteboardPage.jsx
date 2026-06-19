import { useRef, useState, useEffect } from 'react'

const COLORS = ['#000000', '#ffffff', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6']
const WIDTHS = [2, 5, 10, 20]

export default function WhiteboardPage() {
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)
  const lastPos = useRef(null)
  const history = useRef([])
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(5)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth || window.innerWidth
    canvas.height = canvas.offsetHeight || window.innerHeight - 60
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveSnapshot()
  }, [])

  function saveSnapshot() {
    const canvas = canvasRef.current
    history.current = [...history.current, canvas.toDataURL()]
    setCanUndo(history.current.length > 1)
  }

  function getPos(e) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  function startDrawing(e) {
    e.preventDefault()
    isDrawing.current = true
    lastPos.current = getPos(e)
  }

  function draw(e) {
    e.preventDefault()
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 5 : lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastPos.current = pos
  }

  function stopDrawing() {
    if (!isDrawing.current) return
    isDrawing.current = false
    saveSnapshot()
  }

  function undo() {
    if (history.current.length <= 1) return
    const prev = history.current.slice(0, -1)
    history.current = prev
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = prev[prev.length - 1]
    img.onload = () => ctx.drawImage(img, 0, 0)
    setCanUndo(prev.length > 1)
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveSnapshot()
  }

  function downloadCanvas() {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = 'whiteboard.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="flex flex-col" style={{ height: '100vh' }}>
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 flex-wrap shrink-0">
        <span className="font-bold text-blue-600 text-sm mr-1">✏️ Whiteboard</span>

        {/* Tool buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => setTool('pen')}
            title="Pen"
            className={`px-3 py-1.5 rounded text-sm font-medium transition ${tool === 'pen' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            🖊️ Pen
          </button>
          <button
            onClick={() => setTool('eraser')}
            title="Eraser"
            className={`px-3 py-1.5 rounded text-sm font-medium transition ${tool === 'eraser' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            🧹 Eraser
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Colors */}
        <div className="flex gap-1 items-center flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool('pen') }}
              title={c}
              className={`w-6 h-6 rounded-full border-2 transition ${color === c && tool === 'pen' ? 'border-blue-500 scale-125' : 'border-gray-300 hover:scale-110'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Line widths */}
        <div className="flex gap-1 items-center">
          {WIDTHS.map(w => (
            <button
              key={w}
              onClick={() => setLineWidth(w)}
              title={`${w}px`}
              className={`w-8 h-8 rounded flex items-center justify-center transition ${lineWidth === w ? 'bg-blue-100 border border-blue-400' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <div
                className="rounded-full bg-gray-800"
                style={{ width: Math.min(w * 2, 24), height: Math.min(w * 2, 24) }}
              />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Actions */}
        <div className="flex gap-1 ml-auto">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition"
          >
            ↩ Undo
          </button>
          <button
            onClick={clearCanvas}
            className="px-3 py-1.5 rounded text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            🗑 Clear
          </button>
          <button
            onClick={downloadCanvas}
            className="px-3 py-1.5 rounded text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition"
          >
            ⬇ Save
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden bg-gray-100">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none bg-white"
          style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair', display: 'block' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Tip bar */}
      <div className="bg-blue-50 text-blue-700 text-xs text-center py-1.5 shrink-0">
        Tip: Share your screen in the video meeting to show this whiteboard to your students.
      </div>
    </div>
  )
}
