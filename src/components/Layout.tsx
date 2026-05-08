import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-screen h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden" style={{ colorScheme: 'light dark' }}>
      {children}
    </div>
  )
}
