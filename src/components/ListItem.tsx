import React from 'react'
import { FileNode } from '../types/FileNode'

interface ListItemProps {
  item: FileNode
  isHovered: boolean
  onHover: (node: FileNode | null) => void
  onClick: () => void
  background_color: string
  size: string
  isDir: boolean
}

export const ListItem: React.FC<ListItemProps> = ({
  item,
  isHovered,
  onHover,
  onClick,
  background_color,
  size,
  isDir
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between gap-3 px-4 py-3 mb-1 rounded transition-colors cursor-${isDir ? 'pointer' : 'default'} ${isHovered
        ? 'bg-[var(--hover-bg)] border-l-2 border-[var(--accent-color)]'
        : 'border-l-2 border-transparent'
        }`}
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Color indicator */}
        <div
          style={{ backgroundColor: background_color }}
          className="w-3 h-3 rounded-sm flex-shrink-0"
        />

        {/* Name */}
        <div className="text-sm text-[var(--text-primary)] font-mono overflow-hidden text-ellipsis whitespace-nowrap">
          {isDir ? `/${item.name}` : item.name}
        </div>
      </div>

      {/* Size */}
      <div className="text-xs text-[var(--text-secondary)] font-mono flex-shrink-0">
        {size}
      </div>
    </div>
  )
}
