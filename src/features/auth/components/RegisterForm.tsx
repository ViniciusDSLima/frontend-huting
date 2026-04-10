import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/features/auth/use-auth'
import { getAccessToken } from '@/shared/api/auth-token'
import { ApiError } from '@/shared/api/types'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { Card } from '@/shared/components/Card'
import { Alert } from '@/shared/components/Alert'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function RegisterForm() {
  const navigate = useNavigate()
  const { register: registerUser, refreshSession } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'candidate' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      await registerUser(values.email, values.password, values.role?.trim() || undefined)
      if (getAccessToken()) {
        navigate('/painel', { replace: true })
      } else {
        navigate('/login', { replace: true, state: { registered: true } })
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        await refreshSession()
        navigate('/painel', { replace: true })
        return
      }
      const message =
        e instanceof ApiError ? e.message : 'Não foi possível concluir o cadastro.'
      setSubmitError(message)
    }
  })

  return (
    <Card style={{ maxWidth: 400, width: '100%' }}>
      <h2 style={{ marginTop: 0 }}>Criar conta</h2>
      <p style={{ color: '#64748b', marginTop: 0 }}>Informe e-mail, senha e seu papel no sistema.</p>
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <label
          htmlFor="role"
          style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Papel</span>
          <select
            id="role"
            {...register('role')}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#fff',
            }}
          >
            <option value="candidate">Candidato</option>
            <option value="recruiter">Recrutador</option>
          </select>
        </label>
        <Button type="submit" disabled={isSubmitting} style={{ width: '100%', marginTop: 8 }}>
          {isSubmitting ? 'Cadastrando…' : 'Cadastrar'}
        </Button>
      </form>
      <p style={{ marginTop: 20, marginBottom: 0, fontSize: 14 }}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </Card>
  )
}
