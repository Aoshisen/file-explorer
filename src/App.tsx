import { useState, useEffect } from 'react'
import { invoke as invoke_cmd } from '@tauri-apps/api/core'
import { Sunburst } from './components/Sunburst'
import { Breadcrumb } from './components/Breadcrumb'
import { Layout } from './components/Layout'
import { Flex } from './components/Flex'
import { ListItem } from './components/ListItem'
import { FileNode } from './types/FileNode'
import { getColorForIndex, formatSize } from './utils/format'
import "./index.css";

function App() {
  const [currentPath, setCurrentPath] = useState<string>('/')
  const [data, setData] = useState<FileNode | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<FileNode | null>(null)

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
    <Layout>
      <Breadcrumb path={currentPath} onNavigate={handleNavigate} />

      <Flex className="flex-1 overflow-hidden gap-0 bg-[var(--bg-primary)]">
        <Flex direction="col" className="flex-1 overflow-hidden min-w-0">
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
        </Flex>

        {data && !loading && (
          <Flex direction="col" className="bg-[var(--bg-secondary)] border-l border-[var(--border-color)] flex-shrink-0 relative min-w-[400px]">
            <div className="flex-1 overflow-auto p-1">
              {data.children && data.children.map((child, index) => (
                <ListItem
                  key={index}
                  item={child}
                  index={index}
                  isHovered={hoveredNode?.path === child.path}
                  onHover={setHoveredNode}
                  onClick={handleNodeClick}
                  getColorForIndex={getColorForIndex}
                  formatSize={formatSize}
                />
              ))}
            </div>
          </Flex>
        )}
      </Flex>
    </Layout>
  )
}

export default App

