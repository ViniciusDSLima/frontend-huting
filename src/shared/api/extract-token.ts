export function extractAccessToken(data: unknown): string | null {
  if (data == null || typeof data !== 'object') return null
  const o = data as Record<string, unknown>

  if (typeof o.access_token === 'string') return o.access_token
  if (typeof o.accessToken === 'string') return o.accessToken
  if (typeof o.token === 'string') return o.token

  const nested = o.tokens
  if (nested && typeof nested === 'object') {
    const t = nested as Record<string, unknown>
    if (typeof t.access_token === 'string') return t.access_token
    if (typeof t.accessToken === 'string') return t.accessToken
  }

  return null
}
