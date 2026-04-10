import type { CSSProperties, ReactNode } from 'react'

export function Card({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '1.25rem 1.5rem',
        boxShadow: '0 1px 3px rgb(15 23 42 / 8%)',
        border: '1px solid #e2e8f0',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
