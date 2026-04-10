import { api } from '@/shared/api/client'
import { unwrapEnvelope } from '@/shared/api/unwrap'
import type { Envelope } from '@/shared/api/types'
import type { Application } from '@/features/applications/types'
import type { Job, JobSearchParams, UpsertJobRequest } from '@/features/jobs/types'

function normalizeJob(raw: unknown): Job {
  if (!raw || typeof raw !== 'object') {
    return raw as Job
  }
  const o = raw as Record<string, unknown>
  const id = (o.id ?? o.ID) as string | undefined
  return { ...(raw as Job), id: id ?? '' }
}

function asApplicationList(data: unknown): Application[] {
  if (Array.isArray(data)) return data as Application[]
  if (data && typeof data === 'object' && 'items' in data) {
    const items = (data as { items: unknown }).items
    if (Array.isArray(items)) return items as Application[]
  }
  if (data && typeof data === 'object' && 'applications' in data) {
    const apps = (data as { applications: unknown }).applications
    if (Array.isArray(apps)) return apps as Application[]
  }
  return []
}

function asJobList(data: unknown): Job[] {
  let list: unknown[] = []
  if (Array.isArray(data)) list = data
  else if (data && typeof data === 'object' && 'items' in data) {
    const items = (data as { items: unknown }).items
    if (Array.isArray(items)) list = items
  } else if (data && typeof data === 'object' && 'jobs' in data) {
    const jobs = (data as { jobs: unknown }).jobs
    if (Array.isArray(jobs)) list = jobs
  }
  return list.map((j) => normalizeJob(j))
}

export const jobsApi = {
  async search(params: JobSearchParams): Promise<Job[]> {
    const res = await api.get<Envelope<unknown>>('/jobs', { params })
    const data = unwrapEnvelope(res)
    return asJobList(data)
  },

  async getById(id: string): Promise<Job> {
    const res = await api.get<Envelope<unknown>>(`/jobs/${id}`)
    const data = unwrapEnvelope(res)
    if (data && typeof data === 'object' && 'job' in data) {
      return normalizeJob((data as { job: unknown }).job)
    }
    return normalizeJob(data)
  },

  async create(body: UpsertJobRequest): Promise<unknown> {
    const res = await api.post<Envelope<unknown>>('/jobs', body)
    return unwrapEnvelope(res)
  },

  async update(id: string, body: UpsertJobRequest): Promise<unknown> {
    const res = await api.put<Envelope<unknown>>(`/jobs/${id}`, body)
    return unwrapEnvelope(res)
  },

  async remove(id: string): Promise<unknown> {
    const res = await api.delete<Envelope<unknown>>(`/jobs/${id}`)
    return unwrapEnvelope(res)
  },

  async apply(id: string): Promise<unknown> {
    const res = await api.post<Envelope<unknown>>(`/jobs/${id}/applications`)
    return unwrapEnvelope(res)
  },

  async myJobs(): Promise<Job[]> {
    const res = await api.get<Envelope<unknown>>('/me/jobs')
    const data = unwrapEnvelope(res)
    return asJobList(data)
  },

  async listApplications(jobId: string): Promise<Application[]> {
    const res = await api.get<Envelope<unknown>>(`/jobs/${jobId}/applications`)
    const data = unwrapEnvelope(res)
    return asApplicationList(data)
  },
}
