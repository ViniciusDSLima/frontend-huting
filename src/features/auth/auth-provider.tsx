import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '@/features/auth/api'
import {
  applyTokenFromAuthPayload,
  getAccessToken,
  hydrateAccessTokenFromSession,
  setAccessToken,
} from '@/shared/api/auth-token'
import { extractRoleFromPayload } from '@/features/auth/extract-role'
import {
  getStoredRole,
  hydrateRoleFromSession,
  setStoredRole,
} from '@/shared/api/role-session'
import { normalizeRole, type UserRole } from '@/features/auth/user-role'
import { AuthContext, type AuthContextValue, type AuthStatus } from '@/features/auth/auth-context'

function applyRoleFromAuthData(data: unknown): UserRole | null {
  const r = extractRoleFromPayload(data)
  if (r) setStoredRole(r)
  return r
}

async function tryLoadProfileRole(): Promise<UserRole | null> {
  try {
    const data = await authApi.me()
    return applyRoleFromAuthData(data)
  } catch {
    return getStoredRole()
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [role, setRole] = useState<UserRole | null>(null)

  const refreshSession = useCallback(async () => {
    hydrateAccessTokenFromSession()
    hydrateRoleFromSession()
    setRole(getStoredRole())
    try {
      const data = await authApi.refresh()
      applyTokenFromAuthPayload(data)
      let next = applyRoleFromAuthData(data)
      if (!next && getAccessToken()) {
        next = await tryLoadProfileRole()
      }
      setRole(next ?? getStoredRole())
      if (getAccessToken()) {
        setStatus('authenticated')
        return
      }
    } catch {
      setAccessToken(null)
      setStoredRole(null)
      setRole(null)
    }
    if (getAccessToken()) {
      setStatus('authenticated')
      setRole(getStoredRole())
    } else {
      setStatus('unauthenticated')
      setRole(null)
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password })
    applyTokenFromAuthPayload(data)
    let next = applyRoleFromAuthData(data)
    if (!next) {
      next = await tryLoadProfileRole()
    }
    setRole(next ?? getStoredRole())
    if (!getAccessToken()) {
      throw new Error('Login não retornou token de acesso.')
    }
    setStatus('authenticated')
  }, [])

  const register = useCallback(async (email: string, password: string, roleArg?: string) => {
    const data = await authApi.register({ email, password, role: roleArg })
    applyTokenFromAuthPayload(data)
    let next = applyRoleFromAuthData(data)
    if (!next && roleArg) {
      const parsed = normalizeRole(roleArg)
      if (parsed) {
        setStoredRole(parsed)
        next = parsed
      }
    }
    if (!next) {
      next = await tryLoadProfileRole()
    }
    setRole(next ?? getStoredRole())
    if (getAccessToken()) {
      setStatus('authenticated')
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {} finally {
      setAccessToken(null)
      setStoredRole(null)
      setRole(null)
      setStatus('unauthenticated')
    }
  }, [])

  const value = useMemo(
    (): AuthContextValue => ({
      status,
      role,
      login,
      register,
      logout,
      refreshSession,
    }),
    [status, role, login, register, logout, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
