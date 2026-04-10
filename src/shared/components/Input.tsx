import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export function Input({ label, id, error, style, ...rest }: Props) {
  const inputId = id ?? rest.name
  return (
    <label
      htmlFor={inputId}
      style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12, ...style }}
    >
      <span style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>{label}</span>
      <input
        id={inputId}
        {...rest}
        style={{
          padding: '0.55rem 0.75rem',
          borderRadius: 8,
          border: `1px solid ${error ? '#dc2626' : '#cbd5e1'}`,
          background: '#fff',
        }}
      />
      {error ? <span style={{ fontSize: 13, color: '#dc2626' }}>{error}</span> : null}
    </label>
  )
}
