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
Navegador (celular / PC) → App web (React + Vite, :5173) → API (Node + Express, :3001) → PostgreSQL 16 (Docker, :5432)
```

| Pasta | Conteúdo |
|---|---|
| `app/` | Front-end React + TypeScript + Vite integrado à API (app do morador + painel) |
| `web/` | Protótipo original da Unidade 1 (dados fictícios, com mapa de telas) — não usado na aplicação |
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

São **3 peças** que precisam estar no ar ao mesmo tempo, cada uma no seu terminal:

| # | Peça | Onde roda | Porta |
|---|---|---|---|
| 1 | Banco PostgreSQL | Docker | 5432 |
| 2 | API | Node (`api/`) | 3001 |
| 3 | App web | Node (`app/`) | 5173 |

Suba **nessa ordem** (a API precisa do banco; o app precisa da API).

### 1. Banco de dados (Docker)

Na **raiz do repositório**:

```bash
docker compose up -d
```

O que isso faz: baixa a imagem `postgres:16-alpine` (só na primeira vez), cria o container
`ouvidoria-db` e, **na primeira criação**, executa `db/init.sql` (tabelas, view, sequence do protocolo)
e `db/seed.sql` (categorias, status, 1 atendente, 1 moradora e 1 obra de exemplo).
Nenhuma reclamação é criada: elas nascem pela aplicação. Usuário/senha/banco: `ouvidoria` (apenas para uso local).

Comandos úteis:

| Comando | Efeito |
|---|---|
| `docker compose ps` | ver se o container está de pé |
| `docker compose logs db` | ver o log do banco |
| `docker compose stop` | para o banco, **mantendo** os dados |
| `docker compose up -d` | sobe de novo (dados mantidos) |
| `docker compose down -v` | apaga o container **e os dados**; o próximo `up -d` recria tudo limpo |

> **Windows com Docker dentro do WSL** (caso da dupla): o `docker` não está no PowerShell. Use
> ```powershell
> wsl -d Ubuntu -- bash -lc "cd '/mnt/c/CAMINHO/DO/REPO' && docker compose up -d"
> ```
> e deixe **outro terminal aberto** com `wsl -d Ubuntu -- sleep infinity`. Sem isso o WSL desliga
> sozinho quando ocioso e **derruba o banco** — a API passa a responder "Erro interno" e o login falha.

### 2. API (porta 3001)

Em outro terminal:

```bash
cd api
cp .env.example .env      # só na primeira vez (Windows PowerShell: copy .env.example .env)
npm install               # só na primeira vez
npm run dev
```

Deve aparecer `API ouvidoria em http://localhost:3001`. Confira em http://localhost:3001/api/health
→ `{"ok":true}`. (Se der erro 500, o banco não está no ar.)

### 3. App web (porta 5173)

Em outro terminal:

```bash
cd app
npm install               # só na primeira vez
npm run dev
```

### 4. Abrir

| URL | O que é |
|---|---|
| http://localhost:5173/#/welcome | App do morador (entrar → nova reclamação → protocolo) |
| http://localhost:5173/#/admin | Painel do atendente (fila, mudar status, verificar integridade) |

**No celular:** com PC e celular na mesma rede Wi-Fi, abra `http://IP-DO-PC:5173/#/welcome`
(`ipconfig` mostra o IPv4; libere a porta 5173 no firewall se necessário).

### Fluxo de demonstração

1. `/welcome` → **Entrar** (qualquer nome + e-mail; não há senha real).
2. **Nova reclamação** → 5 passos → **Enviar** → anote o protocolo (`2026-0001`).
3. Em `/admin`, selecione a reclamação, mude o status, escreva a resposta e **Salvar e notificar**.
4. No app, abra **Acompanhar** e veja o novo evento na timeline.
5. No `/admin`, **Verificar integridade** confirma a cadeia de hash do histórico.

### Parar tudo

`Ctrl+C` nos terminais da API e do app; `docker compose stop` para o banco.

### Zerar os dados antes de uma demonstração

```bash
docker compose down -v && docker compose up -d
```

(no WSL, use o prefixo `wsl -d Ubuntu -- bash -lc "cd ... && ..."` mostrado acima). O protocolo volta a `2026-0001`.

### Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Login/cadastro dá "confira se a API está no ar" | API ou banco fora do ar — teste `/api/health` |
| `/api/health` dá "Erro interno" | banco parado (`docker compose up -d`; no WSL, ver `sleep infinity`) |
| Tela com "Mapa de telas" e barra lateral | você abriu o protótipo antigo (`web/`), não o `app/` |
| `EADDRINUSE` / porta ocupada | outro processo usando 3001 ou 5173 |

## Testes

Testes de integração da API (T01 protocolos únicos, T02 validação sem gravar nada,
T03 integridade do histórico por hash). Exigem **banco e API no ar**:

```bash
cd api
npm test
```

Eles criam reclamações de teste no banco; para voltar ao estado limpo use o `down -v` acima.
Evidências em `docs/evidencias/`.

## Build de produção do front

```bash
cd app && npm run build
```
