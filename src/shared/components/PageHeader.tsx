import type { ReactNode } from 'react'

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <header
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24,
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.75rem', margin: 0 }}>{title}</h1>
        {subtitle ? (
          <p style={{ margin: '0.35rem 0 0', color: '#64748b', maxWidth: 560 }}>{subtitle}</p>
        ) : null}
      </div>
      {action}
    </header>
  )
}
