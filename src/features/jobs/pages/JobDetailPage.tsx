import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { jobsApi } from '@/features/jobs/api'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Spinner } from '@/shared/components/Spinner'
import { Alert } from '@/shared/components/Alert'
import { ApiError } from '@/shared/api/types'
import { useAuth } from '@/features/auth/use-auth'

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { status: authStatus, role } = useAuth()

  const jobQuery = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getById(jobId!),
    enabled: Boolean(jobId),
  })

  const applyMutation = useMutation({
    mutationFn: () => jobsApi.apply(jobId!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['applications', 'mine'] })
    },
  })

  if (!jobId) {
    return <Alert message="Vaga inválida." />
  }

  if (jobQuery.isLoading) {
    return <Spinner />
  }

  if (jobQuery.error || !jobQuery.data) {
    const msg =
      jobQuery.error instanceof ApiError
        ? jobQuery.error.message
        : 'Vaga não encontrada.'
    return <Alert message={msg} />
  }

  const job = jobQuery.data
  const isLoggedIn = authStatus === 'authenticated'
  const isRecruiter = role === 'recruiter'
  const canApply = isLoggedIn && !isRecruiter

  return (
    <div>
      <PageHeader
        title={job.title}
        action={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="secondary" type="button" onClick={() => navigate('/vagas')}>
              Voltar
            </Button>
            {isRecruiter ? (
              <Link
                to={`/painel/vagas/${jobId}/candidatos`}
                style={{ fontWeight: 600, padding: '0.45rem 0.75rem' }}
              >
                Ver candidatos
              </Link>
            ) : null}
            {canApply ? (
              <Button
                variant="primary"
                disabled={applyMutation.isPending}
                onClick={() => applyMutation.mutate()}
              >
                {applyMutation.isPending ? 'Enviando…' : 'Candidatar-se'}
              </Button>
            ) : null}
            {!isLoggedIn ? (
              <Button
                variant="primary"
                onClick={() =>
                  navigate('/login', { state: { from: { pathname: `/vagas/${jobId}` } } })
                }
              >
                Entrar para candidatar-se
              </Button>
            ) : null}
          </div>
        }
      />

      {applyMutation.error ? (
        <Alert
          message={
            applyMutation.error instanceof ApiError
              ? applyMutation.error.message
              : 'Não foi possível candidatar-se.'
          }
        />
      ) : null}
      {applyMutation.isSuccess ? (
        <Alert message="Candidatura registrada com sucesso." type="info" />
      ) : null}

      <Card style={{ marginTop: 8 }}>
        <dl style={{ margin: 0, display: 'grid', gap: 12 }}>
          {job.location ? (
            <div>
              <dt style={{ fontWeight: 600, color: '#64748b', fontSize: 13 }}>Local</dt>
              <dd style={{ margin: '4px 0 0' }}>{job.location}</dd>
            </div>
          ) : null}
          {job.type ? (
            <div>
              <dt style={{ fontWeight: 600, color: '#64748b', fontSize: 13 }}>Tipo</dt>
              <dd style={{ margin: '4px 0 0' }}>{job.type}</dd>
            </div>
          ) : null}
          {job.status ? (
            <div>
              <dt style={{ fontWeight: 600, color: '#64748b', fontSize: 13 }}>Status</dt>
              <dd style={{ margin: '4px 0 0' }}>{job.status}</dd>
            </div>
          ) : null}
          {job.description ? (
            <div>
              <dt style={{ fontWeight: 600, color: '#64748b', fontSize: 13 }}>Descrição</dt>
              <dd style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{job.description}</dd>
            </div>
          ) : null}
          {job.stages && job.stages.length > 0 ? (
            <div>
              <dt style={{ fontWeight: 600, color: '#64748b', fontSize: 13 }}>Etapas</dt>
              <dd style={{ margin: '4px 0 0' }}>
                <ol style={{ margin: 0, paddingLeft: 20 }}>
                  {job.stages.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </dd>
            </div>
          ) : null}
        </dl>
      </Card>
    </div>
  )
}
