import { create } from 'zustand'
import { invoke as invoke_cmd } from '@tauri-apps/api/core'
import { FileNode } from '../types/FileNode'

interface FileExplorerStore {
  currentPath: string
  data: FileNode | null
  loading: boolean
  error: string | null
  hoveredNode: FileNode | null

  setCurrentPath: (path: string) => void
  setData: (data: FileNode | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setHoveredNode: (node: FileNode | null) => void

  loadDirectory: (path: string) => Promise<void>
}

export const useFileExplorerStore = create<FileExplorerStore>((set) => ({
  currentPath: '/',
  data: null,
  loading: false,
  error: null,
  hoveredNode: null,

  setCurrentPath: (path) => set({ currentPath: path }),
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setHoveredNode: (node) => set({ hoveredNode: node }),

  loadDirectory: async (path) => {
    set({ loading: true, error: null })
    try {
      const result = await invoke_cmd<FileNode>('scan_dir', { path })
      set({ data: result, currentPath: path, loading: false })
    } catch (err) {
      set({ error: String(err), loading: false })
    }
  },
}))
