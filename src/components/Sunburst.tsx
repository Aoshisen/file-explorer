import React, { useRef } from 'react'
import * as d3 from 'd3'
import { FileNode } from '../types/FileNode'
import { useMount } from 'ahooks'

interface SunburstProps {
  data: FileNode
  onNodeClick?: (node: FileNode) => void
  onHover?: (node: FileNode | null) => void
  className?: string
}

type Node = d3.HierarchyRectangularNode<FileNode>
export const Sunburst: React.FC<SunburstProps> = ({ data, className }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const VIEW_BOX_SIZE = 400;
  const RADIUS = VIEW_BOX_SIZE / 2;

  const NORMAL_OPACITY = 0.3;

  useMount(() => {
    if (!svgRef.current || !data) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.attr('viewBox', `0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`)

    const g = svg.append('g').attr('transform', `translate(${RADIUS},${RADIUS})`)

    const hierarchy = d3.hierarchy(data).sum((d) => d.size).sort((a, b) => b.data.size - a.data.size)

    const partition = d3.partition<FileNode>().size([2 * Math.PI, RADIUS * 0.95])

    const root = partition(hierarchy) as Node;

    const arc = d3.arc<any>()
      .startAngle((d) => d.x0 || 0)
      .endAngle((d) => d.x1 || 0)
      .innerRadius((d) => d.y0 || 0)
      .outerRadius((d) => d.y1 || 0)

    g
      .selectAll('path')
      .data(root.descendants().filter((d: any) => d.depth > 0))
      .join('path')
      .attr('class', 'sunburst-arc cursor-pointer')
      .attr('d', arc)
      .attr('fill', (d: Node) => d.data.color)
      .attr('stroke', '#0f0f1e')
      .attr('stroke-width', 1)
      .attr("opacity", NORMAL_OPACITY)
      .on('click', clicked)
    function clicked(event: any, d: Node) {
      if (!d.data.is_dir) {
        return;
      }
      svg.selectAll("*").remove()
      const newHierarchy = d3.hierarchy(d.data).sum((d) => d.size).sort((a, b) => b.data.size - a.data.size)
      const newRoot = partition(newHierarchy) as Node

      const g = svg.append('g').attr('transform', `translate(${RADIUS},${RADIUS})`)
      g
        .selectAll('path')
        .data(newRoot.descendants().filter((d: any) => d.depth > 0))
        .join('path')
        .attr('class', 'sunburst-arc cursor-pointer')
        .attr('d', arc)
        .attr('fill', (d: Node) => d.data.color)
        .attr('stroke', '#0f0f1e')
        .attr('stroke-width', 1)
        .attr("opacity", NORMAL_OPACITY)
        .on("click", clicked)
    }
  })

  return (
    <svg
      ref={svgRef}
      className={`w-full h-full block ${className || ''}`}
    />
  )
}