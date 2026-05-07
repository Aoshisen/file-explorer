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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem 1.5rem',
      backgroundColor: '#1a1a2e',
      borderBottom: '1px solid rgba(0, 217, 255, 0.2)',
    }}>
      <span style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>📁</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
        {parts.length === 0 ? (
          <span style={{ color: '#00d9ff', fontFamily: 'monospace', fontSize: '0.875rem' }}>/</span>
        ) : (
          <>
            <button
              onClick={() => onNavigate('/')}
              className="breadcrumb-item"
              style={{
                color: '#00d9ff',
                backgroundColor: '#0f0f1e',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              /
            </button>
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                <span style={{ color: '#a0a0a0' }}>/</span>
                <button
                  onClick={() => handleClick(index)}
                  className="breadcrumb-item"
                  style={{
                    color: '#00d9ff',
                    backgroundColor: '#0f0f1e',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    maxWidth: '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={part}
                >
                  {part}
                </button>
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

