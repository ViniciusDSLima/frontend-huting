import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/use-auth'
import { Spinner } from '@/shared/components/Spinner'

export function RecruiterGate({ children }: { children: ReactNode }) {
  const { status, role } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <Spinner />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (role !== 'recruiter') {
    return <Navigate to="/painel" replace />
  }

  return children
}
