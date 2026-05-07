import { useState, useEffect } from 'react'
import { invoke as invoke_cmd } from '@tauri-apps/api/core'
import { Sunburst } from './components/Sunburst'
import { Breadcrumb } from './components/Breadcrumb'
import { ResizeHandle } from './components/ResizeHandle'
import "./index.css";


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
    <div className="w-screen h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden" style={{ colorScheme: 'light dark' }}>
      {/* Breadcrumb */}
      <Breadcrumb path={currentPath} onNavigate={handleNavigate} />

      {/* Main Content - Left/Right Layout */}
      <div className="flex-1 flex overflow-hidden gap-0 bg-[var(--bg-primary)]">
        {/* Left: Sunburst - takes all available space */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-[var(--spinner-bg)] border-t-[var(--accent-color)] rounded-full animate-spin"></div>
                <p className="text-[var(--text-secondary)] mt-4 font-mono text-sm">
                  Scanning directory...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-[var(--bg-secondary)] border border-[var(--error-color)] rounded-lg p-6 max-w-sm">
                <p className="text-[var(--error-color)] font-mono text-sm">
                  {error}
                </p>
                <button
                  onClick={() => loadDirectory(currentPath)}
                  className="mt-4 px-4 py-2 bg-[var(--error-color)] text-[var(--bg-primary)] rounded transition-colors hover:bg-[var(--error-color-hover)] font-mono text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {data && !loading && (
            <div className="flex-1 overflow-hidden relative">
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
          <div style={{ width: `${panelWidth}px` }} className="flex flex-col bg-[var(--bg-secondary)] border-l border-[var(--border-color)] flex-shrink-0 relative">
            <ResizeHandle width={panelWidth} onWidthChange={setPanelWidth} />
            {/* List Items */}
            <div className="flex-1 overflow-auto p-1">
              {data.children && data.children.map((child, index) => (
                <div
                  key={index}
                  onClick={() => child.is_dir && handleNodeClick(child.path)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 mb-1 rounded transition-colors cursor-${child.is_dir ? 'pointer' : 'default'} ${
                    hoveredNode?.path === child.path
                      ? 'bg-[var(--hover-bg)] border-l-2 border-[var(--accent-color)]'
                      : 'border-l-2 border-transparent'
                  }`}
                  onMouseEnter={() => setHoveredNode(child)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Color indicator */}
                    <div
                      style={{ backgroundColor: getColorForIndex(index) }}
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                    />

                    {/* Name */}
                    <div className="text-sm text-[var(--text-primary)] font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                      {child.is_dir ? `/${child.name}` : child.name}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="text-xs text-[var(--text-secondary)] font-mono flex-shrink-0">
                    {formatSize(child.size)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

