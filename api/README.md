# API — Ouvidoria de Obras

Node.js + Express + PostgreSQL (`pg`). Porta `3001`.

```bash
cp .env.example .env     # ajuste DATABASE_URL se necessário
npm install
npm run dev              # ou: npm start
npm test                 # requer API e banco no ar
```

Endpoints: `/api/health`, `/api/categorias`, `/api/usuarios`, `/api/reclamacoes`,
`/api/reclamacoes/:protocolo`, `/api/admin/reclamacoes`, `/api/admin/indicadores`,
`/api/admin/reclamacoes/:protocolo/integridade`.
