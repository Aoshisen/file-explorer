import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import { FileNode } from '../types/FileNode'
import { assignColorsToTree } from '../utils/colorAssigner'

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
    const result = await invoke<FileNode>('scan_dir', { path })
    set({ data: assignColorsToTree(result), currentPath: path, loading: false })
  },
}))
