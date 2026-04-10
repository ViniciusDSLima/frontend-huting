import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { applicationsApi } from '@/features/applications/api'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Spinner } from '@/shared/components/Spinner'
import { EmptyState } from '@/shared/components/EmptyState'
import { Alert } from '@/shared/components/Alert'
import { ApiError } from '@/shared/api/types'

export function MyApplicationsPage() {
  const query = useQuery({
    queryKey: ['applications', 'mine'],
    queryFn: () => applicationsApi.mine(),
  })

  return (
    <div>
      <PageHeader
        title="Minhas candidaturas"
        subtitle="Acompanhe o status das candidaturas enviadas."
      />

      {query.isLoading ? <Spinner /> : null}
      {query.error ? (
        <Alert
          message={
            query.error instanceof ApiError
              ? query.error.message
              : 'Não foi possível carregar suas candidaturas.'
          }
        />
      ) : null}

      {query.isSuccess && query.data.length === 0 ? (
        <EmptyState
          title="Nenhuma candidatura"
          description="Encontre vagas em aberto e candidate-se."
          action={
            <Link to="/vagas" style={{ fontWeight: 600 }}>
              Buscar vagas
            </Link>
          }
        />
      ) : null}

      {query.isSuccess && query.data.length > 0 ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {query.data.map((app) => {
            const jobId = app.job_id ?? app.job?.id
            const title = app.job?.title ?? 'Vaga'
            return (
              <Card key={app.id}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{title}</div>
                    <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                      {app.status ? `Status: ${app.status}` : null}
                      {app.stage ? ` · Etapa: ${app.stage}` : null}
                    </div>
                  </div>
                  {jobId ? (
                    <Link to={`/vagas/${jobId}`} style={{ fontWeight: 600 }}>
                      Ver vaga
                    </Link>
                  ) : null}
                </div>
              </Card>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
