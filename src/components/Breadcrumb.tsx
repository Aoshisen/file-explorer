import React from 'react'

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
      className="breadcrumb-item text-[#00d9ff] bg-[#0f0f1e] border border-[rgba(0,217,255,0.3)] px-2 py-1 rounded-sm cursor-pointer font-mono text-sm hover:bg-[#1a1a2e] transition-colors max-w-[150px] overflow-hidden text-ellipsis"
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
    <div className="flex items-center gap-2 px-6 py-4 bg-[#1a1a2e] border-b border-[rgba(0,217,255,0.2)]">
      <div className="flex items-center gap-1 flex-wrap">
        {pathItemWithRoot.map((item) => (
          <React.Fragment key={item.key}>
            <BreadcrumbItem
              label={item.label}
              onClick={() => onNavigate(item.path)}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}