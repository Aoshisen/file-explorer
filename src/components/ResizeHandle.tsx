import React, { useState, useEffect } from 'react'

interface ResizeHandleProps {
  width: number
  onWidthChange: (width: number) => void
  minWidth?: number
  maxWidth?: number
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  onWidthChange,
  minWidth = 200,
  maxWidth = 600,
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const newWidth = window.innerWidth - e.clientX
      if (newWidth > minWidth && newWidth < maxWidth) {
        onWidthChange(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, minWidth, maxWidth, onWidthChange])

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize transition-colors z-10 ${
        isDragging ? 'bg-[var(--accent-color)]' : 'bg-transparent'
      }`}
    />
  )
}
