const raw = (import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(/\/$/, '')

export const env = {
  apiBaseUrl: raw === '' ? '/api/v1' : raw,
} as const
