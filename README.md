# Frontend — Recrutamento & Seleção

SPA em **React 19**, **TypeScript** e **Vite**, consumindo a API documentada em Swagger (`/api/v1/...`).

## Requisitos

- Node.js 20+
- Backend em `http://localhost:8080` (ou ajuste o proxy)

## Configuração

```bash
cp .env.example .env
npm install
```

Variáveis:

- `VITE_API_BASE_URL` — base da API (padrão `/api/v1`, relativa ao mesmo host do Vite em dev).
- `VITE_DEV_PROXY_TARGET` — onde o Vite encaminha `/api` e `/health` em desenvolvimento (padrão `http://localhost:8080`).

## Scripts

```bash
npm run dev      # Vite + HMR
npm run build    # Typecheck + bundle produção
npm run preview  # Servir pasta dist
npm run lint
npm run format   # Prettier
```

## Estrutura

- `src/app` — roteador, layouts, guards (`GuestRoute`, `ProtectedRoute`, `AuthGate`).
- `src/features` — domínios (`auth`, `jobs`, `applications`): telas, formulários e chamadas HTTP.
- `src/shared` — Axios (credenciais, refresh, `Authorization`), componentes de UI e config.

## Autenticação

- Access token: header `Authorization: Bearer …`, extraído do `data` da API com `extractAccessToken` (vários formatos comuns).
- Sessão: `sessionStorage` + tentativa de `POST /auth/refresh` no carregamento (cookies httpOnly com `withCredentials: true`).
- Interceptor: em `401`, uma tentativa de refresh e nova chamada; rotas públicas de login/register não disparam refresh em loop.

## Rotas principais

| Caminho | Descrição |
|--------|------------|
| `/login`, `/register` | Apenas visitante (usuário logado é redirecionado ao painel). |
| `/vagas` | Busca pública. |
| `/vagas/:id` | Detalhe; candidatura se autenticado. |
| `/vagas/nova`, `/vagas/:id/editar` | Exige login (`AuthGate`). |
| `/painel`, `/painel/vagas`, `/painel/candidaturas` | Área logada (layout com navegação). |
