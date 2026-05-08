import React from 'react'
import { Flex } from './Flex'
interface BreadcrumbProps {
  path: string
  onNavigate: (path: string) => void
}

interface BreadcrumbItemProps {
  label: string
  onClick: () => void
}

// 抽象出的面包屑单项组件
const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-[#00d9ff] bg-[#0f0f1e] border border-[rgba(0,217,255,0.3)] px-2 py-1 rounded-sm cursor-pointer font-mono text-sm hover:bg-[#1a1a2e] transition-colors max-w-[150px] truncate"
      title={label}
    >
      {label}
    </button>
  )
}

interface BreadcrumbPathItem {
  key: string
  path: string
  label: string
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  // 1. 处理路径片段
  const parts = path.split('/').filter(Boolean)

  // 2. 转换为对象形式 { key, path, label }
  const pathItems: BreadcrumbPathItem[] = parts.map((part, index) => {
    // 构建当前层级的完整路径
    const currentPath = '/' + parts.slice(0, index + 1).join('/')

    return {
      key: `${index}-${part}`, // 确保 key 的唯一性，防止同名目录导致 key 冲突
      path: currentPath,
      label: part,
    }
  })

  const pathItemWithRoot = [{ key: 'root', path: '/', label: '/' }, ...pathItems]
  return (
    <div className="p-2 bg-[#1a1a2e] border-b border-[rgba(0,217,255,0.2)]">
      <Flex className='gap-1 justify-center'>
        {pathItemWithRoot.map((item) => (
          <BreadcrumbItem
            label={item.label}
            onClick={() => onNavigate(item.path)}
            key={item.key}
          />
        ))}
      </Flex>
    </div>
  )
}