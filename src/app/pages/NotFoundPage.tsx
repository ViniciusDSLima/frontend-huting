import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: 48 }}>
      <h1 style={{ fontSize: '2rem' }}>Página não encontrada</h1>
      <p style={{ color: '#64748b' }}>
        <Link to="/vagas">Voltar para vagas</Link>
      </p>
    </div>
  )
}
