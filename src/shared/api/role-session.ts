import type { UserRole } from '@/features/auth/user-role'

const STORAGE_KEY = 'rs_user_role'

let role: UserRole | null = null

export function getStoredRole(): UserRole | null {
  return role
}

export function setStoredRole(next: UserRole | null): void {
  role = next
  try {
    if (next) {
      sessionStorage.setItem(STORAGE_KEY, next)
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  } catch {}
}

export function hydrateRoleFromSession(): void {
  try {
    const s = sessionStorage.getItem(STORAGE_KEY)
    if (s === 'recruiter' || s === 'candidate') {
      role = s
    }
  } catch {}
}
