import React from 'react'

interface BreadcrumbProps {
  path: string
  onNavigate: (path: string) => void
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  const parts = path.split('/').filter(Boolean)

  const handleClick = (index: number) => {
    const newPath = '/' + parts.slice(0, index + 1).join('/')
    onNavigate(newPath)
  }

  return (
    <div className="flex items-center gap-2 px-6 py-4 bg-[#1a1a2e] border-b border-[rgba(0,217,255,0.2)]">
      <span className="text-[#a0a0a0] text-sm">📁</span>
      <div className="flex items-center gap-1 flex-wrap">
        {parts.length === 0 ? (
          <span className="text-[#00d9ff] font-mono text-sm">/</span>
        ) : (
          <>
            <button
              onClick={() => onNavigate('/')}
              className="breadcrumb-item text-[#00d9ff] bg-[#0f0f1e] border border-[rgba(0,217,255,0.3)] px-2 py-1 rounded-sm cursor-pointer font-mono text-sm hover:bg-[#1a1a2e] transition-colors"
            >
              /
            </button>
            {parts.map((part, index) => (
              <div key={index}>
                <span className="text-[#a0a0a0]">/</span>
                <button
                  onClick={() => handleClick(index)}
                  className="breadcrumb-item text-[#00d9ff] bg-[#0f0f1e] border border-[rgba(0,217,255,0.3)] px-2 py-1 rounded-sm cursor-pointer font-mono text-sm hover:bg-[#1a1a2e] transition-colors max-w-[150px] overflow-hidden text-ellipsis"
                  title={part}
                >
                  {part}
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

