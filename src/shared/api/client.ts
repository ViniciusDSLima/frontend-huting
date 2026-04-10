import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/shared/config/env'
import { applyTokenFromAuthPayload, getAccessToken, setAccessToken } from '@/shared/api/auth-token'
import { unwrapEnvelope } from '@/shared/api/unwrap'
import { normalizeAxiosError } from '@/shared/api/normalize-error'
import type { Envelope } from '@/shared/api/types'

const REFRESH_PATH = '/auth/refresh'

function createClient(): AxiosInstance {
  return axios.create({
    baseURL: env.apiBaseUrl,
    withCredentials: true,
    headers: { Accept: 'application/json' },
  })
}

export const api = createClient()

let refreshPromise: Promise<string | null> | null = null

function isAuthPath(url: string | undefined): boolean {
  if (!url) return false
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/logout')
  )
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await api.post<Envelope<unknown>>(REFRESH_PATH, undefined, {
      skipAuthRefresh: true,
    })
    const data = unwrapEnvelope(res as AxiosResponse<Envelope<unknown>>)
    return applyTokenFromAuthPayload(data)
  } catch {
    setAccessToken(null)
    return null
  }
}

function scheduleRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.url?.includes(REFRESH_PATH)) {
    delete config.headers.Authorization
  } else {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig | undefined
    if (!original || original.skipAuthRefresh) {
      return Promise.reject(normalizeAxiosError(error))
    }

    const status = error.response?.status
    const url = original.url ?? ''

    if (status !== 401 || original._retry || isAuthPath(url)) {
      return Promise.reject(normalizeAxiosError(error))
    }

    original._retry = true

    try {
      const newToken = await scheduleRefresh()
      if (!newToken) {
        return Promise.reject(normalizeAxiosError(error))
      }
      original.headers.Authorization = `Bearer ${newToken}`
      return api(original)
    } catch {
      return Promise.reject(normalizeAxiosError(error))
    }
  },
)
