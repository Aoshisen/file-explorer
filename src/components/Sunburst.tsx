import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface FileNode {
  name: string
  path: string
  size: number
  is_dir: boolean
  children?: FileNode[]
}

interface D3Node extends d3.HierarchyRectangularNode<FileNode> {
  x0: number
  x1: number
  y0: number
  y1: number
}

interface SunburstProps {
  data: FileNode
  onNodeClick: (path: string) => void
  onHover: (node: FileNode | null) => void
  hoveredNode?: FileNode | null
}

// 颜色调色板，不带透明度
const colors = [
  'rgb(0, 217, 255)',      // 青色
  'rgb(255, 0, 110)',      // 粉红
  'rgb(57, 255, 20)',      // 绿色
  'rgb(255, 215, 0)',      // 金色
  'rgb(255, 69, 0)',       // 橙红
  'rgb(0, 206, 209)',      // 深青
  'rgb(138, 43, 226)',     // 蓝紫
  'rgb(255, 105, 180)',    // 热粉
]

const getColor = (depth: number, index: number) => {
  const baseColor = colors[(depth * 7 + index) % colors.length]
  // 基于 depth 和 index 生成伪随机透明度 (0.01 - 0.1)
  const seed = (depth * 7 + index) * 12345
  const random = ((seed * 9301 + 49297) % 233280) / 233280
  const alpha = (0.05 + random * 0.3).toFixed(2)

  // 从 rgb(r, g, b) 提取数字，转换为 rgba(r, g, b, alpha)
  const match = baseColor.match(/\d+/g)
  if (match && match.length === 3) {
    return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${alpha})`
  }
  return baseColor
}

export const Sunburst: React.FC<SunburstProps> = ({ data, onNodeClick, onHover, hoveredNode }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [_, setHoveredNode] = useState<FileNode | null>(null)

  useEffect(() => {
    if (!svgRef.current || !data) return

    const container = svgRef.current.parentElement
    if (!container) return


    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const radius = Math.min(width, height) / 2

    svg
      .attr('width', width)
      .attr('height', height)

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const hierarchy = d3.hierarchy(data)
      .sum((d) => d.size)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    const partition = d3.partition<FileNode>()
      .size([2 * Math.PI, radius * 0.95])

    const root = partition(hierarchy) as D3Node

    const arc = d3.arc<D3Node>()
      .startAngle((d) => d.x0 || 0)
      .endAngle((d) => d.x1 || 0)
      .innerRadius((d) => d.y0 || 0)
      .outerRadius((d) => d.y1 || 0)

    const paths = g
      .selectAll('path')
      .data(root.descendants().filter((d) => d.depth > 0))
      .join('path')
      .attr('class', 'sunburst-arc cursor-pointer')
      .attr('d', arc as any)
      .attr('fill', (d, i) => {
        return getColor(d.depth, i)
      })
      .attr('stroke', '#0f0f1e')
      .attr('stroke-width', 2)
      .attr('opacity', (d) => {
        if (!hoveredNode) return 1
        return d.data.path === hoveredNode.path ? 0.5 : 1
      })
      .on('click', (event, d) => {
        event.stopPropagation()
        if (d.data.is_dir) {
          onNodeClick(d.data.path)
        }
      })
      .on('mouseenter', (event, d) => {
        setHoveredNode(d.data)
        onHover(d.data)
        d3.select(event.currentTarget)
          .attr('filter', 'brightness(1.3)')
          .attr('stroke-width', 3)
      })
      .on('mouseleave', (event) => {
        setHoveredNode(null)
        onHover(null)
        d3.select(event.currentTarget)
          .attr('filter', 'none')
          .attr('stroke-width', 2)
      })

  }, [data, onNodeClick, onHover, hoveredNode])

  return (
    <svg
      ref={svgRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'transparent',
      }}
    />
  )
}
