import type { CSSProperties } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/use-auth'
import { Button } from '@/shared/components/Button'

const navLinkStyle = (active?: boolean): CSSProperties => ({
  padding: '0.35rem 0.65rem',
  borderRadius: 8,
  fontWeight: 600,
  color: active ? '#1d4ed8' : '#334155',
  textDecoration: 'none',
  background: active ? '#e0e7ff' : 'transparent',
})

export function AppLayout() {
  const { logout, role } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const isRecruiter = role === 'recruiter'
  const isCandidate = role === 'candidate'

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
        <Link to="/painel" style={{ fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>
          R&S Hunting
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/vagas" style={navLinkStyle(false)}>
            Buscar vagas
          </Link>
          <Link to="/painel" style={navLinkStyle(false)}>
            Painel
          </Link>
          {isRecruiter ? (
            <>
              <Link to="/painel/vagas" style={navLinkStyle(false)}>
                Minhas vagas
              </Link>
              <Link to="/vagas/nova" style={navLinkStyle(false)}>
                Nova vaga
              </Link>
            </>
          ) : null}
          {isCandidate ? (
            <Link to="/painel/candidaturas" style={navLinkStyle(false)}>
              Minhas candidaturas
            </Link>
          ) : null}
          {!role ? (
            <span style={{ fontSize: 13, color: '#94a3b8' }} title="Faça login novamente se o papel não aparecer">
              Papel não carregado
            </span>
          ) : null}
          <Button variant="secondary" onClick={() => void handleLogout()} style={{ marginLeft: 8 }}>
            Sair
          </Button>
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
