import { Navigate, Outlet } from 'react-router-dom'
import type { UserRole } from '@/features/auth/user-role'
import { useAuth } from '@/features/auth/use-auth'
import { Spinner } from '@/shared/components/Spinner'

type Props = {
  allowedRoles: UserRole[]
}

export function RoleRoute({ allowedRoles }: Props) {
  const { status, role } = useAuth()

  if (status === 'loading') {
    return <Spinner />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/painel" replace />
  }

  return <Outlet />
}
