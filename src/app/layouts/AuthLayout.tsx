import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'linear-gradient(160deg, #e0e7ff 0%, #f1f5f9 45%, #f8fafc 100%)',
      }}
    >
      <Outlet />
    </div>
  )
}
