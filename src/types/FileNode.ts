export interface FileNode {
  name: string
  path: string
  size: number
  is_dir: boolean
  color: string
  children?: FileNode[]
}
