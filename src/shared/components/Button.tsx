import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

const styles: Record<NonNullable<Props['variant']>, CSSProperties> = {
  primary: {
    background: '#1d4ed8',
    color: '#fff',
    border: 'none',
    padding: '0.55rem 1rem',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
  },
  secondary: {
    background: '#e2e8f0',
    color: '#0f172a',
    border: 'none',
    padding: '0.55rem 1rem',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
  },
  ghost: {
    background: 'transparent',
    color: '#1d4ed8',
    border: 'none',
    padding: '0.55rem 0.75rem',
    cursor: 'pointer',
    fontWeight: 500,
  },
}

export function Button({ variant = 'primary', style, disabled, ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled}
      style={{
        ...styles[variant],
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    />
  )
}
