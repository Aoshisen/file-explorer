import * as d3 from 'd3'
import { FileNode } from '../types/FileNode'

const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
let colorIndex = 0

export const assignColorsToTree = (node: FileNode): FileNode => {
  const coloredNode: FileNode = {
    ...node,
    color: colorScale(String(colorIndex++)),
  }

  if (node.children) {
    coloredNode.children = node.children.map((child) =>
      assignColorsToTree(child)
    )
  }

  return coloredNode
}
