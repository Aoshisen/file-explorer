import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { FileNode } from '../types/FileNode'

// ... 接口定义保持不变 ...

interface SunburstProps {
  data: FileNode
  onNodeClick: (node: FileNode) => void
  onHover?: (node: FileNode | null) => void
  className?: string
}

export const Sunburst: React.FC<SunburstProps> = ({ data, onNodeClick, onHover, className }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const VIEW_BOX_SIZE = 400;
  const radius = VIEW_BOX_SIZE / 2;

  const NORMAL_OPACITY = 0.3;
  const SELECTED_OPACITY = 0.8;

  useEffect(() => {
    if (!svgRef.current || !data) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg
      .attr('viewBox', `0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`)
      .attr('preserveAspectRatio', 'xMidYMid meet') // 保持比例居中，如果想填满可改为 'none' 或 'xMidYMid slice'

    const g = svg
      .append('g')
      .attr('transform', `translate(${VIEW_BOX_SIZE / 2},${VIEW_BOX_SIZE / 2})`)

    const hierarchy = d3.hierarchy(data)
      .sum((d) => d.size)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    const partition = d3.partition<FileNode>()
      .size([2 * Math.PI, radius * 0.95])

    const root = partition(hierarchy) as any // 简化类型断言

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
      .attr('fill', (d: any) => d.data.color)
      .attr('stroke', '#0f0f1e')
      .attr('stroke-width', 1)
      .attr("opacity", NORMAL_OPACITY)
      .on('click', (event: any, d: any) => {
        event.stopPropagation()
        onNodeClick(d.data)
      })
      .on("mouseover", function (_, d: any) {
        onHover?.(d.data)
        d3.select(this)
          .transition().duration(200)
          .attr('opacity', SELECTED_OPACITY)
      })
      .on("mouseout", function () {
        onHover?.(null)
        d3.select(this)
          .transition().duration(200)
          .attr('opacity', NORMAL_OPACITY)
      })

  }, [data, onNodeClick, onHover])

  return (
    <svg
      ref={svgRef}
      className={`w-full h-full block ${className || ''}`}
    />
  )
}