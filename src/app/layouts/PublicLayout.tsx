import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/use-auth'
import { Button } from '@/shared/components/Button'

export function PublicLayout() {
  const navigate = useNavigate()
  const { status, logout, role } = useAuth()
  const authed = status === 'authenticated'
  const isRecruiter = role === 'recruiter'

  const handleLogout = async () => {
    await logout()
    navigate('/vagas', { replace: true })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Link to="/vagas" style={{ fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>
          R&S Hunting
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/vagas">Vagas</Link>
          {authed ? (
            <>
              <Link to="/painel">Painel</Link>
              {isRecruiter ? <Link to="/vagas/nova">Nova vaga</Link> : null}
              <Button variant="secondary" onClick={() => void handleLogout()}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link
                to="/register"
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: 8,
                  background: '#1d4ed8',
                  color: '#fff',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </header>
      <main
        style={{
          flex: 1,
          padding: '1.5rem 1.25rem 2rem',
          maxWidth: 1120,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
