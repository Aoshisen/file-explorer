import React, { useState, useEffect } from 'react'
import { invoke as invoke_cmd } from '@tauri-apps/api/core'
import { Sunburst } from './components/Sunburst'
import { Breadcrumb } from './components/Breadcrumb'
import { ResizeHandle } from './components/ResizeHandle'


interface FileNode {
  name: string
  path: string
  size: number
  is_dir: boolean
  children?: FileNode[]
}

const colors = [
  'rgba(0, 217, 255, 0.7)',      // 青色
  'rgba(255, 0, 110, 0.7)',      // 粉红
  'rgba(57, 255, 20, 0.7)',      // 绿色
  'rgba(255, 215, 0, 0.7)',      // 金色
  'rgba(255, 69, 0, 0.7)',       // 橙红
  'rgba(0, 206, 209, 0.7)',      // 深青
  'rgba(138, 43, 226, 0.7)',     // 蓝紫
  'rgba(255, 105, 180, 0.7)',    // 热粉
]

const getColorForIndex = (index: number) => {
  return colors[index % colors.length]
}

const formatSize = (bytes: number): string => {
  if (bytes > 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`
  } else if (bytes > 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
  } else if (bytes > 1024) {
    return `${(bytes / 1024).toFixed(2)}KB`
  } else {
    return `${bytes}B`
  }
}

function App() {
  const [currentPath, setCurrentPath] = useState<string>('/')
  const [data, setData] = useState<FileNode | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<FileNode | null>(null)
  const [panelWidth, setPanelWidth] = useState(320)

  useEffect(() => {
    const initPath = async () => {
      const home = "/Users/aoshisen/Documents/Code/file-explorer";
      console.log('Home directory:', home)
      setCurrentPath(home)
      loadDirectory(home)
    }
    initPath()
  }, [])

  const loadDirectory = async (path: string) => {
    setLoading(true)
    setError(null)
    const result = await invoke_cmd<FileNode>('scan_dir', { path })
    setData(result)
    setCurrentPath(path)
    setLoading(false)
  }

  const handleNodeClick = (path: string) => {
    loadDirectory(path)
  }

  const handleNavigate = (path: string) => {
    loadDirectory(path)
  }

  const handleHover = (node: FileNode | null) => {
    setHoveredNode(node)
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      overflow: 'hidden',
      colorScheme: 'light dark',
      boxSizing: 'border-box',
    }}>
      {/* Breadcrumb */}
      <Breadcrumb path={currentPath} onNavigate={handleNavigate} />

      {/* Main Content - Left/Right Layout */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        gap: 0,
        background: 'var(--bg-primary)',
      }}>
        {/* Left: Sunburst - takes all available space */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}>
          {loading && (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block',
                  width: '3rem',
                  height: '3rem',
                  border: '4px solid var(--spinner-bg)',
                  borderTop: '4px solid var(--accent-color)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}></div>
                <p style={{
                  color: 'var(--text-secondary)',
                  marginTop: '1rem',
                  fontFamily: 'monospace',
                }}>
                  Scanning directory...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--error-color)',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                maxWidth: '28rem',
              }}>
                <p style={{
                  color: 'var(--error-color)',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}>
                  {error}
                </p>
                <button
                  onClick={() => loadDirectory(currentPath)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--error-color)',
                    color: 'var(--bg-primary)',
                    borderRadius: '0.375rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 200ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--error-color-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--error-color)')}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {data && !loading && (
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <Sunburst
                data={data}
                onNodeClick={handleNodeClick}
                onHover={handleHover}
                hoveredNode={hoveredNode}
              />
            </div>
          )}
        </div>

        {/* Right: File List */}
        {data && !loading && (
          <div style={{
            width: `${panelWidth}px`,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-color)',
            flexShrink: 0,
            position: 'relative',
          }}>
            <ResizeHandle width={panelWidth} onWidthChange={setPanelWidth} />
            {/* List Items */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '0.25rem',
            }}>
              {data.children && data.children.map((child, index) => (
                <div
                  key={index}
                  onClick={() => child.is_dir && handleNodeClick(child.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.25rem',
                    backgroundColor: hoveredNode?.path === child.path ? 'var(--hover-bg)' : 'transparent',
                    borderRadius: '0.375rem',
                    cursor: child.is_dir ? 'pointer' : 'default',
                    transition: 'background-color 150ms',
                    borderLeft: hoveredNode?.path === child.path ? '2px solid var(--accent-color)' : '2px solid transparent',
                  }}
                  onMouseEnter={() => setHoveredNode(child)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flex: 1,
                    minWidth: 0,
                  }}>
                    {/* Color indicator */}
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: getColorForIndex(index),
                      borderRadius: '2px',
                      flexShrink: 0,
                    }} />

                    {/* Name */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)',
                      fontFamily: 'monospace',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {child.is_dir ? `/${child.name}` : child.name}
                    </div>
                  </div>

                  {/* Size */}
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'monospace',
                    flexShrink: 0,
                  }}>
                    {formatSize(child.size)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        :root {
          color-scheme: light dark;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg-primary: #0f0f1e;
            --bg-secondary: #1a1a2e;
            --text-primary: #e0e0e0;
            --text-secondary: #a0a0a0;
            --accent-color: #00d9ff;
            --accent-color-light: rgba(0, 217, 255, 0.2);
            --accent-color-lighter: rgba(0, 217, 255, 0.1);
            --border-color: rgba(0, 217, 255, 0.2);
            --error-color: #ff006e;
            --error-color-hover: rgba(255, 0, 110, 0.8);
            --spinner-bg: rgba(0, 217, 255, 0.3);
            --hover-bg: rgba(0, 217, 255, 0.1);
          }
        }

        @media (prefers-color-scheme: light) {
          :root {
            --bg-primary: #ffffff;
            --bg-secondary: #f5f5f5;
            --text-primary: #1a1a1a;
            --text-secondary: #666666;
            --accent-color: #0066cc;
            --accent-color-light: rgba(0, 102, 204, 0.2);
            --accent-color-lighter: rgba(0, 102, 204, 0.1);
            --border-color: rgba(0, 102, 204, 0.2);
            --error-color: #cc0033;
            --error-color-hover: rgba(204, 0, 51, 0.8);
            --spinner-bg: rgba(0, 102, 204, 0.3);
            --hover-bg: rgba(0, 102, 204, 0.1);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default App

