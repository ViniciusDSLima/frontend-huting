import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        color: '#64748b',
      }}
    >
      <h3 style={{ margin: '0 0 0.5rem', color: '#334155' }}>{title}</h3>
      {description ? <p style={{ margin: '0 0 1rem' }}>{description}</p> : null}
      {action}
    </div>
  )
}
