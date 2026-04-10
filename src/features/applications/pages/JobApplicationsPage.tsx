import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '@/features/applications/api'
import { jobsApi } from '@/features/jobs/api'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Spinner } from '@/shared/components/Spinner'
import { EmptyState } from '@/shared/components/EmptyState'
import { Alert } from '@/shared/components/Alert'
import { ApiError } from '@/shared/api/types'

export function JobApplicationsPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const queryClient = useQueryClient()
  const [notesById, setNotesById] = useState<Record<string, string>>({})

  const jobQuery = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getById(jobId!),
    enabled: Boolean(jobId),
  })

  const appsQuery = useQuery({
    queryKey: ['job', jobId, 'applications'],
    queryFn: () => jobsApi.listApplications(jobId!),
    enabled: Boolean(jobId),
  })

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['job', jobId, 'applications'] })
    void queryClient.invalidateQueries({ queryKey: ['jobs', 'mine'] })
  }

  const advanceMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      applicationsApi.advance(id, notes),
    onSuccess: () => invalidate(),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      applicationsApi.reject(id, notes),
    onSuccess: () => invalidate(),
  })

  if (!jobId) {
    return <Alert message="Vaga inválida." />
  }

  if (jobQuery.isLoading) {
    return <Spinner />
  }

  if (jobQuery.error || !jobQuery.data) {
    return (
      <Alert
        message={
          jobQuery.error instanceof ApiError
            ? jobQuery.error.message
            : 'Vaga não encontrada.'
        }
      />
    )
  }

  const job = jobQuery.data

  return (
    <div>
      <PageHeader
        title={`Candidatos — ${job.title}`}
        subtitle="Avance etapas ou reprove; notas são opcionais."
        action={
          <Link to="/painel/vagas" style={{ fontWeight: 600 }}>
            Voltar às vagas
          </Link>
        }
      />

      {appsQuery.isLoading ? <Spinner /> : null}
      {appsQuery.error ? (
        <Alert
          message={
            appsQuery.error instanceof ApiError
              ? appsQuery.error.message
              : 'Não foi possível listar candidatos. Confirme se a API expõe GET /jobs/:id/applications.'
          }
        />
      ) : null}

      {appsQuery.isSuccess && appsQuery.data.length === 0 ? (
        <EmptyState title="Nenhuma candidatura" description="Ainda não há inscrições nesta vaga." />
      ) : null}

      {appsQuery.isSuccess && appsQuery.data.length > 0 ? (
        <div style={{ display: 'grid', gap: 16 }}>
          {appsQuery.data.map((app) => (
            <Card key={app.id}>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ fontWeight: 600 }}>
                  {app.candidate?.name ?? app.candidate?.email ?? `Candidatura ${app.id.slice(0, 8)}…`}
                </div>
                {app.candidate?.email ? (
                  <div style={{ fontSize: 14, color: '#64748b' }}>{app.candidate.email}</div>
                ) : null}
                <div style={{ fontSize: 14, color: '#475569' }}>
                  {app.status ? `Status: ${app.status}` : null}
                  {app.stage ? ` · Etapa: ${app.stage}` : null}
                </div>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Notas (opcional)</span>
                  <textarea
                    value={notesById[app.id] ?? ''}
                    onChange={(e) =>
                      setNotesById((m) => ({ ...m, [app.id]: e.target.value }))
                    }
                    rows={2}
                    style={{
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      padding: '0.5rem 0.65rem',
                    }}
                  />
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Button
                    type="button"
                    variant="primary"
                    disabled={advanceMutation.isPending || rejectMutation.isPending}
                    onClick={() =>
                      advanceMutation.mutate({
                        id: app.id,
                        notes: notesById[app.id]?.trim() || undefined,
                      })
                    }
                  >
                    Avançar etapa
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={advanceMutation.isPending || rejectMutation.isPending}
                    onClick={() =>
                      rejectMutation.mutate({
                        id: app.id,
                        notes: notesById[app.id]?.trim() || undefined,
                      })
                    }
                  >
                    Reprovar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
