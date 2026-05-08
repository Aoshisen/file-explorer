import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface FileNode {
  name: string
  path: string
  size: number
  is_dir: boolean
  color: string
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
  onNodeClick: (node: FileNode) => void
  onHover?: (node: FileNode | null) => void
}

export const Sunburst: React.FC<SunburstProps> = ({ data, onNodeClick, onHover }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const NORMAL_OPACITY = 0.3;
  const SELECTED_OPACITY = 0.8;

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

    g
      .selectAll('path')
      .data(root.descendants().filter((d) => d.depth > 0))
      .join('path')
      .attr('class', 'sunburst-arc cursor-pointer')
      .attr('d', arc as any)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#0f0f1e')
      .attr('stroke-width', 1)
      .attr("opacity", NORMAL_OPACITY)
      .on('click', (event, d) => {
        event.stopPropagation()
        onNodeClick(d.data)
      })
      .on("mouseover", function (_, d) {
        onHover?.(d.data)
        d3.select(this)
          .attr('opacity', SELECTED_OPACITY)

      })
      .on("mouseout", function () {
        onHover?.(null)
        d3.select(this)
          .attr('opacity', NORMAL_OPACITY)
      })
  }, [data, onNodeClick])

  return (
    <svg
      ref={svgRef}
      className="w-full h-full block bg-transparent"
    />
  )
}
