import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/use-auth'
import { Card } from '@/shared/components/Card'
import { PageHeader } from '@/shared/components/PageHeader'

const tileStyle: CSSProperties = {
  padding: '1rem 1.25rem',
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  textDecoration: 'none',
  color: '#0f172a',
  fontWeight: 600,
  display: 'block',
}

export function DashboardPage() {
  const { role, refreshSession } = useAuth()
  const isRecruiter = role === 'recruiter'
  const isCandidate = role === 'candidate'

  return (
    <div>
      <PageHeader
        title="Painel"
        subtitle={
          role
            ? isRecruiter
              ? 'Gerencie vagas e candidatos como recrutador.'
              : 'Acompanhe suas candidaturas e busque novas vagas.'
            : 'Carregando seu perfil… Se o papel não aparecer, sincronize abaixo.'
        }
        action={
          !role ? (
            <button
              type="button"
              onClick={() => void refreshSession()}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Sincronizar sessão
            </button>
          ) : null
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        <Link to="/vagas" style={tileStyle}>
          Buscar vagas
        </Link>
        {isRecruiter ? (
          <>
            <Link to="/painel/vagas" style={tileStyle}>
              Minhas vagas
            </Link>
            <Link to="/vagas/nova" style={tileStyle}>
              Nova vaga
            </Link>
          </>
        ) : null}
        {isCandidate ? (
          <Link to="/painel/candidaturas" style={tileStyle}>
            Minhas candidaturas
          </Link>
        ) : null}
      </div>

      <Card style={{ marginTop: 24 }}>
        <p style={{ margin: 0, color: '#475569' }}>
          {isRecruiter ? (
            <>
              Publique vagas em <strong>Nova vaga</strong> e acompanhe candidatos em{' '}
              <strong>Minhas vagas</strong> → Candidatos.
            </>
          ) : isCandidate ? (
            <>
              Candidatos veem <strong>Minhas candidaturas</strong> e podem se inscrever na busca
              pública.
            </>
          ) : (
            <>
              Se o papel não for detectado, use <strong>Sincronizar sessão</strong> ou faça logout
              e login novamente.
            </>
          )}
        </p>
      </Card>
    </div>
  )
}
