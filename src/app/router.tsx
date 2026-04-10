import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute } from '@/app/routes/GuestRoute'
import { ProtectedRoute } from '@/app/routes/ProtectedRoute'
import { RecruiterGate } from '@/app/routes/RecruiterGate'
import { RoleRoute } from '@/app/routes/RoleRoute'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { AppLayout } from '@/app/layouts/AppLayout'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { JobSearchPage } from '@/features/jobs/pages/JobSearchPage'
import { JobDetailPage } from '@/features/jobs/pages/JobDetailPage'
import { JobFormPage } from '@/features/jobs/pages/JobFormPage'
import { MyJobsPage } from '@/features/jobs/pages/MyJobsPage'
import { MyApplicationsPage } from '@/features/applications/pages/MyApplicationsPage'
import { JobApplicationsPage } from '@/features/applications/pages/JobApplicationsPage'
import { DashboardPage } from '@/app/pages/DashboardPage'
import { NotFoundPage } from '@/app/pages/NotFoundPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>
        </Route>

        <Route path="vagas" element={<PublicLayout />}>
          <Route index element={<JobSearchPage />} />
          <Route
            path="nova"
            element={
              <RecruiterGate>
                <JobFormPage mode="create" />
              </RecruiterGate>
            }
          />
          <Route
            path=":jobId/editar"
            element={
              <RecruiterGate>
                <JobFormPage mode="edit" />
              </RecruiterGate>
            }
          />
          <Route path=":jobId" element={<JobDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="painel" element={<DashboardPage />} />
            <Route element={<RoleRoute allowedRoles={['recruiter']} />}>
              <Route path="painel/vagas" element={<MyJobsPage />} />
              <Route path="painel/vagas/:jobId/candidatos" element={<JobApplicationsPage />} />
            </Route>
            <Route element={<RoleRoute allowedRoles={['candidate']} />}>
              <Route path="painel/candidaturas" element={<MyApplicationsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/vagas" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
