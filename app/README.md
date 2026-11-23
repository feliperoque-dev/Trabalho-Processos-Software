# app — aplicação da Ouvidoria (versão integrada)

React + TypeScript + Vite, integrada à API em `../api` (proxy `/api` → `http://localhost:3001`).
Sem mapa de telas: só o app do morador e o painel do atendente.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # verificação de tipos + build
```

- App do morador: `http://localhost:5173/#/welcome`
- Painel do atendente: `http://localhost:5173/#/admin`

A pasta `../web` guarda o protótipo original (dados fictícios), sem alterações.
Instruções completas (banco, API, testes) no [README da raiz](../README.md).
