import type { FormEvent } from 'react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/features/jobs/api'
import type { JobSearchParams } from '@/features/jobs/types'
import { JobCard } from '@/features/jobs/components/JobCard'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { Spinner } from '@/shared/components/Spinner'
import { EmptyState } from '@/shared/components/EmptyState'
import { Alert } from '@/shared/components/Alert'
import { ApiError } from '@/shared/api/types'

export function JobSearchPage() {
  const [filters, setFilters] = useState<JobSearchParams>({})
  const [applied, setApplied] = useState<JobSearchParams>({})

  const query = useQuery({
    queryKey: ['jobs', applied],
    queryFn: () => jobsApi.search(applied),
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setApplied({ ...filters })
  }

  return (
    <div>
      <PageHeader
        title="Buscar vagas"
        subtitle="Filtre por termo, local, tipo ou status. Resultados atualizam ao aplicar os filtros."
      />

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
          alignItems: 'end',
          marginBottom: 24,
          background: '#fff',
          padding: '1rem 1.25rem',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
        }}
      >
        <Input
          label="Termo"
          placeholder="Título ou descrição"
          value={filters.q ?? ''}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value || undefined }))}
          style={{ marginBottom: 0 }}
        />
        <Input
          label="Local"
          value={filters.location ?? ''}
          onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value || undefined }))}
          style={{ marginBottom: 0 }}
        />
        <Input
          label="Tipo"
          value={filters.type ?? ''}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value || undefined }))}
          style={{ marginBottom: 0 }}
        />
        <Input
          label="Status"
          value={filters.status ?? ''}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}
          style={{ marginBottom: 0 }}
        />
        <Button type="submit" style={{ height: 42 }}>
          Aplicar
        </Button>
      </form>

      {query.isLoading ? <Spinner /> : null}
      {query.error ? (
        <Alert
          message={
            query.error instanceof ApiError
              ? query.error.message
              : 'Não foi possível carregar as vagas.'
          }
        />
      ) : null}

      {query.isSuccess && query.data.length === 0 ? (
        <EmptyState title="Nenhuma vaga encontrada" description="Ajuste os filtros e tente de novo." />
      ) : null}

      {query.isSuccess && query.data.length > 0 ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {query.data.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
