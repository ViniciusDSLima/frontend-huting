export type UserRole = 'recruiter' | 'candidate'

export function normalizeRole(value: unknown): UserRole | null {
  if (typeof value !== 'string') return null
  const r = value.trim().toLowerCase()
  if (r === 'recruiter') return 'recruiter'
  if (r === 'candidate') return 'candidate'
  return null
}
