import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { jobsApi } from '@/features/jobs/api'
import { JobCard } from '@/features/jobs/components/JobCard'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { Spinner } from '@/shared/components/Spinner'
import { EmptyState } from '@/shared/components/EmptyState'
import { Alert } from '@/shared/components/Alert'
import { ApiError } from '@/shared/api/types'

export function MyJobsPage() {
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: ['jobs', 'mine'],
    queryFn: () => jobsApi.myJobs(),
  })

  return (
    <div>
      <PageHeader
        title="Minhas vagas"
        subtitle="Vagas que você criou ou gerencia."
        action={
          <Button variant="primary" type="button" onClick={() => navigate('/vagas/nova')}>
            Nova vaga
          </Button>
        }
      />

      {query.isLoading ? <Spinner /> : null}
      {query.error ? (
        <Alert
          message={
            query.error instanceof ApiError
              ? query.error.message
              : 'Não foi possível carregar suas vagas.'
          }
        />
      ) : null}

      {query.isSuccess && query.data.length === 0 ? (
        <EmptyState
          title="Nenhuma vaga ainda"
          description="Publique uma vaga para começar a receber candidatos."
          action={
            <Button variant="primary" type="button" onClick={() => navigate('/vagas/nova')}>
              Nova vaga
            </Button>
          }
        />
      ) : null}

      {query.isSuccess && query.data.length > 0 ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {query.data.map((job) => (
            <div key={job.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <JobCard job={job} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginLeft: 4 }}>
                <Link to={`/painel/vagas/${job.id}/candidatos`} style={{ fontSize: 14, fontWeight: 600 }}>
                  Candidatos
                </Link>
                <Link to={`/vagas/${job.id}/editar`} style={{ fontSize: 14, fontWeight: 600 }}>
                  Editar vaga
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
