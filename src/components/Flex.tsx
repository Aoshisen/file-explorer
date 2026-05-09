import React from 'react'

interface FlexProps {
  children: React.ReactNode
  direction?: 'row' | 'col'
  className?: string
}

export const Flex: React.FC<FlexProps> = ({ children, direction = 'row', className = '' }) => {
  const directionClass = direction === 'col' ? 'flex-col' : 'flex-row'
  return (
    <div className={`flex items-center justify-center ${directionClass} ${className}`}>
      {children}
    </div>
  )
}
