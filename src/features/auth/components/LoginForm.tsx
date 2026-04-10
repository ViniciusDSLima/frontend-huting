import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/features/auth/use-auth'
import { ApiError } from '@/shared/api/types'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { Card } from '@/shared/components/Card'
import { Alert } from '@/shared/components/Alert'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, refreshSession } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/painel'
  const justRegistered = Boolean(
    (location.state as { registered?: boolean } | null)?.registered,
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      await login(values.email, values.password)
      navigate(from, { replace: true })
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        await refreshSession()
        navigate(from, { replace: true })
        return
      }
      const message = e instanceof ApiError ? e.message : 'Não foi possível entrar.'
      setSubmitError(message)
    }
  })

  return (
    <Card style={{ maxWidth: 400, width: '100%' }}>
      <h2 style={{ marginTop: 0 }}>Entrar</h2>
      <p style={{ color: '#64748b', marginTop: 0 }}>Use seu e-mail e senha cadastrados.</p>
      {justRegistered ? (
        <Alert message="Conta criada. Faça login para continuar." type="info" />
      ) : null}
      {submitError ? <Alert message={submitError} /> : null}
      <form onSubmit={onSubmit} noValidate>
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" disabled={isSubmitting} style={{ width: '100%', marginTop: 8 }}>
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
      <p style={{ marginTop: 20, marginBottom: 0, fontSize: 14 }}>
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </Card>
  )
}
