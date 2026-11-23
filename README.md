# Ouvidoria de Obras & Vizinhança

Trabalho final de **Processos de Software** (Prof. Rafael Bispo) — Módulo 19 do SGF.
Dupla: Isis Vasconcelos e Felipe Roque.

## Contexto

Moradores vizinhos de obras (ruído, poeira, entulho, caminhões...) não têm um canal simples
para reclamar, e a ouvidoria não tem uma fila organizada. Esta aplicação permite que o **morador**
registre uma reclamação em **5 passos**, receba um **protocolo único** (`AAAA-NNNN`) e acompanhe o
andamento, enquanto o **atendente** vê a fila num painel (`/admin`), filtra por status e responde.

O objetivo original era um app mobile; por limitação técnica da dupla, foi construída uma
**aplicação web responsiva** (mobile-first), que funciona no navegador do celular e no computador.

**Fora do escopo (limitações declaradas):** autenticação real (o "login" só identifica o morador
por nome + e-mail e o `/admin` é aberto), notificações, mapa/upload real de arquivos (só metadados),
deploy em nuvem.

## Arquitetura

```
Navegador (celular / PC) → Web SPA (React + Vite, :5173) → API (Node + Express, :3001) → PostgreSQL 16 (Docker, :5432)
```

| Pasta | Conteúdo |
|---|---|
| `web/` | Front-end React + TypeScript + Vite |
| `api/` | API Node.js + Express (validação, protocolo, histórico com hash encadeado) |
| `db/` | `init.sql` (schema = DER da U2) e `seed.sql` (categorias, status, usuários de exemplo) |
| `docker-compose.yml` | Sobe o PostgreSQL |
| `docs/` | Diagramas (DER, sequência), evidências de testes |
| `design/`, `prototipo.html` | Design das telas e protótipo da Unidade 1 |

## Requisitos

- **Node.js 20+** (testado com 24) e npm
- **Docker** com Docker Compose (Docker Desktop, ou Docker no WSL2)
- Git

## Como rodar

```bash
# 1. Banco de dados (PostgreSQL em Docker; cria o schema e os dados iniciais)
docker compose up -d

# 2. API (porta 3001)
cd api
cp .env.example .env
npm install
npm run dev

# 3. Web (porta 5173) — em outro terminal
cd web
npm install
npm run dev
```

> **Docker no WSL (Windows):** rode `wsl -d Ubuntu -- docker compose up -d` na pasta do projeto
> (o WSL desliga sozinho quando ocioso e derruba o container; mantenha um terminal com
> `wsl -d Ubuntu -- sleep infinity` aberto). Para recomeçar o banco do zero: `docker compose down -v`.

Acesse:

| URL | O que é |
|---|---|
| http://localhost:5173/#/welcome | App do morador (entrar → nova reclamação → protocolo) |
| http://localhost:5173/#/admin | Painel do atendente (fila, mudar status, verificar integridade) |
| http://localhost:5173/ | Mapa de telas do design |

**No celular:** com PC e celular na mesma rede Wi-Fi, abra `http://IP-DO-PC:5173/#/welcome`
(o Vite já escuta na rede com `host: true`; libere a porta 5173 no firewall se necessário).

**Fluxo de demonstração:** em `/welcome` → Entrar (nome + e-mail) → Nova reclamação (5 passos) →
anote o protocolo → abra `/admin`, altere o status e responda → volte aos Detalhes no app e veja a timeline.

## Testes

Testes de integração da API (T01 protocolos únicos, T02 validação sem gravar nada,
T03 integridade do histórico por hash). Exigem banco e API no ar:

```bash
cd api
npm test
```

Evidências em `docs/evidencias/`.

## Build de produção do front

```bash
cd web && npm run build
```
