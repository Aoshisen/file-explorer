import React from 'react'

interface FileNode {
  name: string
  path: string
  size: number
  is_dir: boolean
}

interface TooltipProps {
  node: FileNode | null
  position: { x: number; y: number }
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export const Tooltip: React.FC<TooltipProps> = ({ node, position }) => {
  if (!node) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: '#1a1a2e',
        border: '1px solid rgba(0, 217, 255, 0.5)',
        borderRadius: '0.375rem',
        padding: '0.75rem',
        pointerEvents: 'none',
        zIndex: 1000,
        minWidth: '200px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div style={{
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        color: '#39ff14',
        marginBottom: '0.5rem',
      }}>
        {node.name}
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: '#a0a0a0',
        marginBottom: '0.25rem',
      }}>
        {node.is_dir ? '📁 Folder' : '📄 File'}
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: '#00d9ff',
        fontFamily: 'monospace',
      }}>
        {formatSize(node.size)}
      </div>
    </div>
  )
}
