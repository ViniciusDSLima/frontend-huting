import { extractAccessToken } from './extract-token'
import { setStoredRole } from '@/shared/api/role-session'

const STORAGE_KEY = 'rs_access_token'

let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null): void {
  accessToken = token
  if (token) {
    sessionStorage.setItem(STORAGE_KEY, token)
  } else {
    sessionStorage.removeItem(STORAGE_KEY)
    setStoredRole(null)
  }
}

export function hydrateAccessTokenFromSession(): void {
  try {
    const s = sessionStorage.getItem(STORAGE_KEY)
    if (s) accessToken = s
  } catch {}
}

export function applyTokenFromAuthPayload(data: unknown): string | null {
  const t = extractAccessToken(data)
  if (t) setAccessToken(t)
  return t
}
