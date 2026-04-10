export function Alert({ message, type = 'error' }: { message: string; type?: 'error' | 'info' }) {
  const bg = type === 'error' ? '#fef2f2' : '#eff6ff'
  const border = type === 'error' ? '#fecaca' : '#bfdbfe'
  const color = type === 'error' ? '#991b1b' : '#1e40af'
  return (
    <div
      role="alert"
      style={{
        padding: '0.75rem 1rem',
        borderRadius: 8,
        background: bg,
        border: `1px solid ${border}`,
        color,
        marginBottom: 16,
        fontSize: 14,
      }}
    >
      {message}
    </div>
  )
}
