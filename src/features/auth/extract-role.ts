import { normalizeRole, type UserRole } from '@/features/auth/user-role'

export function extractRoleFromPayload(data: unknown): UserRole | null {
  if (data == null || typeof data !== 'object') return null
  const o = data as Record<string, unknown>

  const direct = normalizeRole(o.role)
  if (direct) return direct

  const user = o.user
  if (user && typeof user === 'object') {
    const ur = normalizeRole((user as Record<string, unknown>).role)
    if (ur) return ur
  }

  const profile = o.profile
  if (profile && typeof profile === 'object') {
    const pr = normalizeRole((profile as Record<string, unknown>).role)
    if (pr) return pr
  }

  return null
}
