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

// 唯一标识 key
const data_key = (d: Node) => d.data.path;

export const Sunburst: React.FC<SunburstProps> = ({ data, className }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const VIEW_BOX_SIZE = 400;
  const RADIUS = VIEW_BOX_SIZE / 2;

  const NORMAL_OPACITY = 0.3;

  // 定义一个足够大的半径，作为“视图外部”的起始位置
  const OUTER_START_RADIUS = RADIUS * 2.5;

  useMount(() => {
    if (!svgRef.current || !data) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.attr('viewBox', `0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`)

    const g = svg.append('g').attr('transform', `translate(${RADIUS},${RADIUS})`)

    const partition = d3.partition<FileNode>().size([2 * Math.PI, RADIUS * 0.95])

    const arc = d3.arc<any>()
      .startAngle((d) => d.x0 || 0)
      .endAngle((d) => d.x1 || 0)
      .innerRadius((d) => d.y0 || 0)
      .outerRadius((d) => d.y1 || 0)

    // 初始渲染
    const hierarchy = d3.hierarchy(data).sum((d) => d.size).sort((a, b) => b.data.size - a.data.size)
    const root = partition(hierarchy) as Node;

    render(root);

    function render(root: Node) {
      const descendants = root.descendants().filter((d: any) => d.depth > 0);

      // 1. Data Join
      const selection = g
        .selectAll('path')
        .data(descendants, data_key);

      // 2. Exit: 处理移除的节点
      selection.exit().remove();

      // 3. Enter: 处理新增节点
      const enterSelection = selection.enter()
        .append('path')
        .attr('class', 'sunburst-arc cursor-pointer')
        .attr('fill', (d: Node) => d.data.color)
        .attr('stroke', '#0f0f1e')
        .attr('stroke-width', 1)
        // 【关键】初始状态：透明，且路径收缩
        .attr("opacity", 0)
        .attr('d', (d: any) => {
          const height = d.y1 - d.y0; // 保持扇区厚度一致
          return arc({
            ...d,
            y0: OUTER_START_RADIUS,
            y1: OUTER_START_RADIUS + height
          });
        })
        .on('click', clicked);

      // 4. Update + Enter Merge: 统一处理动画
      const updateSelection = selection.merge(enterSelection);

      updateSelection
        .transition().duration(300)
        .delay(d => d.depth * 100)
        .attr("opacity", NORMAL_OPACITY)
        .attr("d", arc); // D3 会自动对 path 的 d 属性进行插值过渡

      // 重新绑定点击事件
      updateSelection.on('click', clicked);
    }

    function clicked(event: any, d: Node) {
      event.stopPropagation();
      if (!d.data.is_dir) {
        return;
      }
      // 重新计算以当前节点为根的层级结构
      const newHierarchy = d3.hierarchy(d.data).sum((d) => d.size).sort((a, b) => b.data.size - a.data.size)
      const newRoot = partition(newHierarchy) as Node
      render(newRoot)
    }
  })

  return (
    <svg
      ref={svgRef}
      className={`w-full h-full block ${className || ''}`}
    />
  )
}