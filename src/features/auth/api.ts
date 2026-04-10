import type { AxiosResponse } from 'axios'
import { api } from '@/shared/api/client'
import { unwrapEnvelope } from '@/shared/api/unwrap'
import type { Envelope } from '@/shared/api/types'

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  email: string
  password: string
  role?: string
}

export const authApi = {
  async login(body: LoginRequest): Promise<unknown> {
    const res = await api.post<Envelope<unknown>>('/auth/login', body)
    return unwrapEnvelope(res)
  },

  async register(body: RegisterRequest): Promise<unknown> {
    const res = await api.post<Envelope<unknown>>('/auth/register', body)
    return unwrapEnvelope(res)
  },

  async refresh(): Promise<unknown> {
    const res = await api.post<Envelope<unknown>>('/auth/refresh', undefined, {
      skipAuthRefresh: true,
    })
    return unwrapEnvelope(res as AxiosResponse<Envelope<unknown>>)
  },

  async logout(): Promise<unknown> {
    const res = await api.post<Envelope<unknown>>('/auth/logout')
    return unwrapEnvelope(res)
  },

  async me(): Promise<unknown> {
    const res = await api.get<Envelope<unknown>>('/me')
    return unwrapEnvelope(res)
  },
}
