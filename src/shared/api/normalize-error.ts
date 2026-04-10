import axios from 'axios'
import { ApiError, type Envelope } from './types'

export function normalizeAxiosError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    const body = err.response?.data as Envelope<unknown> | undefined
    const message = body?.error?.message ?? err.message ?? 'Erro na requisição'
    const code = body?.error?.code
    return new ApiError(message, code, status)
  }
  if (err instanceof Error) return new ApiError(err.message)
  return new ApiError('Erro desconhecido')
}
