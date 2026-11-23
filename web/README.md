# web — front-end da Ouvidoria

React + TypeScript + Vite. Consome a API em `../api` (proxy `/api` → `http://localhost:3001`, ver `vite.config.ts`).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # verificação de tipos + build
```

Rotas (HashRouter): `/` mapa de telas · `/welcome` app do morador · `/admin` painel do atendente.
Instruções completas (banco, API, testes) no [README da raiz](../README.md).
