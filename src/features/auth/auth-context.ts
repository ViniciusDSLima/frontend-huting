import { createContext } from 'react'
import type { UserRole } from '@/features/auth/user-role'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  status: AuthStatus
  role: UserRole | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, role?: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
