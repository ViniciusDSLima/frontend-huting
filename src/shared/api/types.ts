export type ApiErrorBody = {
  code: string
  message: string
}

export type Envelope<T> = {
  data?: T
  error?: ApiErrorBody
}

export class ApiError extends Error {
  readonly code: string | undefined
  readonly status: number | undefined

  constructor(message: string, code?: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}
