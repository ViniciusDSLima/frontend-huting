export function Spinner({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 48,
        color: '#475569',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: '3px solid #e2e8f0',
          borderTopColor: '#1d4ed8',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span>{label}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
