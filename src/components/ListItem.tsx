import React from 'react'
import { FileNode } from '../types/FileNode'

interface ListItemProps {
  item: FileNode
  index: number
  isHovered: boolean
  onHover: (node: FileNode | null) => void
  onClick: (path: string) => void
  getColorForIndex: (index: number) => string
  formatSize: (bytes: number) => string
}

export const ListItem: React.FC<ListItemProps> = ({
  item,
  index,
  isHovered,
  onHover,
  onClick,
  getColorForIndex,
  formatSize,
}) => {
  return (
    <div
      onClick={() => item.is_dir && onClick(item.path)}
      className={`flex items-center justify-between gap-3 px-4 py-3 mb-1 rounded transition-colors cursor-${item.is_dir ? 'pointer' : 'default'} ${
        isHovered
          ? 'bg-[var(--hover-bg)] border-l-2 border-[var(--accent-color)]'
          : 'border-l-2 border-transparent'
      }`}
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Color indicator */}
        <div
          style={{ backgroundColor: getColorForIndex(index) }}
          className="w-3 h-3 rounded-sm flex-shrink-0"
        />

        {/* Name */}
        <div className="text-sm text-[var(--text-primary)] font-mono overflow-hidden text-ellipsis whitespace-nowrap">
          {item.is_dir ? `/${item.name}` : item.name}
        </div>
      </div>

      {/* Size */}
      <div className="text-xs text-[var(--text-secondary)] font-mono flex-shrink-0">
        {formatSize(item.size)}
      </div>
    </div>
  )
}
