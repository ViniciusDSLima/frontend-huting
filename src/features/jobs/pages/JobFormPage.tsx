import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { jobsApi } from '@/features/jobs/api'
import { PageHeader } from '@/shared/components/PageHeader'
import { Input } from '@/shared/components/Input'
import { TextArea } from '@/shared/components/TextArea'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { Alert } from '@/shared/components/Alert'
import { Spinner } from '@/shared/components/Spinner'
import { ApiError } from '@/shared/api/types'

const schema = z.object({
  title: z.string().min(2, 'Informe o título'),
  description: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  stagesText: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function parseStages(text: string | undefined): string[] | undefined {
  if (!text?.trim()) return undefined
  const lines = text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  return lines.length ? lines : undefined
}

export function JobFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const jobQuery = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getById(jobId!),
    enabled: mode === 'edit' && Boolean(jobId),
  })

  const defaultValues = useMemo<FormValues>(
    () => ({
      title: '',
      description: '',
      location: '',
      type: '',
      status: 'open',
      stagesText: '',
    }),
    [],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useEffect(() => {
    if (jobQuery.data) {
      const j = jobQuery.data
      reset({
        title: j.title,
        description: j.description ?? '',
        location: j.location ?? '',
        type: j.type ?? '',
        status: j.status ?? 'open',
        stagesText: j.stages?.length ? j.stages.join('\n') : '',
      })
    }
  }, [jobQuery.data, reset])

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        title: values.title,
        description: values.description || undefined,
        location: values.location || undefined,
        type: values.type || undefined,
        status: values.status || undefined,
        stages: parseStages(values.stagesText),
      }
      if (mode === 'create') {
        await jobsApi.create(payload)
        return 'create'
      }
      await jobsApi.update(jobId!, payload)
      return 'edit'
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['jobs'] })
      if (jobId) {
        await queryClient.invalidateQueries({ queryKey: ['job', jobId] })
      }
      navigate('/painel/vagas', { replace: true })
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    saveMutation.reset()
    await saveMutation.mutateAsync(values)
  })

  if (mode === 'edit' && jobQuery.isLoading) {
    return <Spinner />
  }

  if (mode === 'edit' && (jobQuery.error || !jobQuery.data)) {
    return (
      <Alert
        message={
          jobQuery.error instanceof ApiError
            ? jobQuery.error.message
            : 'Não foi possível carregar a vaga.'
        }
      />
    )
  }

  return (
    <div>
      <PageHeader
        title={mode === 'create' ? 'Nova vaga' : 'Editar vaga'}
        subtitle="Defina título, descrição, local e etapas do processo (uma por linha)."
        action={
          <Button variant="secondary" type="button" onClick={() => navigate('/painel/vagas')}>
            Cancelar
          </Button>
        }
      />

      {saveMutation.error ? (
        <Alert
          message={
            saveMutation.error instanceof ApiError
              ? saveMutation.error.message
              : 'Não foi possível salvar.'
          }
        />
      ) : null}

      <Card style={{ maxWidth: 640 }}>
        <form onSubmit={onSubmit} noValidate>
          <Input label="Título" error={errors.title?.message} {...register('title')} />
          <TextArea label="Descrição" {...register('description')} />
          <Input label="Local" {...register('location')} />
          <Input label="Tipo" {...register('type')} />
          <Input label="Status" {...register('status')} />
          <TextArea
            label="Etapas (uma por linha)"
            placeholder={'Triagem\nEntrevista técnica\nProposta'}
            error={errors.stagesText?.message}
            {...register('stagesText')}
          />
          <Button type="submit" disabled={isSubmitting || saveMutation.isPending}>
            {saveMutation.isPending ? 'Salvando…' : 'Salvar'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
