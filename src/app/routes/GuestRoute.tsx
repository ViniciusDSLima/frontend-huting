import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/use-auth'
import { Spinner } from '@/shared/components/Spinner'

export function GuestRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <Spinner />
  }

  if (status === 'authenticated') {
    return <Navigate to="/painel" replace state={{ from: location }} />
  }

  return <Outlet />
}
