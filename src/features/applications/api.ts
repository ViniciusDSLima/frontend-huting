import { api } from '@/shared/api/client'
import { unwrapEnvelope } from '@/shared/api/unwrap'
import type { Envelope } from '@/shared/api/types'
import type { Application } from '@/features/applications/types'

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

export const applicationsApi = {
  async mine(): Promise<Application[]> {
    const res = await api.get<Envelope<unknown>>('/me/applications')
    const data = unwrapEnvelope(res)
    return asApplicationList(data)
  },

  async advance(id: string, notes?: string): Promise<unknown> {
    const res = await api.post<Envelope<unknown>>(`/applications/${id}/stages/advance`, {
      notes,
    })
    return unwrapEnvelope(res)
  },

  async reject(id: string, notes?: string): Promise<unknown> {
    const res = await api.post<Envelope<unknown>>(`/applications/${id}/stages/reject`, {
      notes,
    })
    return unwrapEnvelope(res)
  },
}
