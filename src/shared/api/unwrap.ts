import type { AxiosResponse } from 'axios'
import { ApiError, type Envelope } from '@/shared/api/types'

export function unwrapEnvelope<T>(response: AxiosResponse<Envelope<T>>): T {
  const body = response.data
  if (body.error) {
    throw new ApiError(body.error.message, body.error.code, response.status)
  }
  return body.data as T
}
