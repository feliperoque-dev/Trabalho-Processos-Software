# Handoff de design: Ouvidoria de Obras & Vizinhança

Referência visual: os arquivos `*.dc.html` desta pasta (um por tela). Cada um é HTML com estilos inline. Use-os como **referência de layout, cores e textos**. Não copie a estrutura `<x-dc>` / `DCLogic`, que é específica da ferramenta de design.

## Tokens

| Token | Valor | Uso |
|---|---|---|
| primary | `#0D5E6B` | botões, links, item ativo |
| primary-dark | `#0B4A54` | menu lateral do admin |
| primary-soft | `#DFF0F1` / `#E8F4F5` | fundo de ícones, item selecionado |
| accent | `#C2410C` / `#F2A65A` | pino do mapa, avatar |
| bg | `#F4F6F7` | fundo das telas |
| surface | `#FFFFFF` | cards |
| border | `#E1E7E9` (cards) / `#D5DEE0` (inputs) | |
| text | `#15282D` | |
| text-muted | `#4E6166` | |
| status Em análise | bg `#FFF1D1` / texto `#7A4B00` | |
| status Em andamento | bg `#DCEBFA` / texto `#1D4F8C` | |
| status Resolvida | bg `#DCF2E4` / texto `#17603A` | |
| status Pendente | bg `#FCE1E1` / texto `#9B1C1C` | |

- Fonte: **Manrope** (400–800). Títulos 22–26px/800, corpo 14–15px, legendas 12–13px.
- Raios: inputs/botões 14px, cards 16–18px, chips 999px.
- Botão primário: altura 54px. Inputs: 48–52px. Área de toque mínima: 44px.
- Espaçamento: margem lateral 20–24px, gaps de 10–16px.

## Telas e rotas

| # | Arquivo | Rota sugerida | Leva para |
|---|---|---|---|
| 01 | Main.dc.html | `/welcome` | Login, Cadastro |
| 02 | Login.dc.html | `/login` | Home, Cadastro |
| 03 | Cadastro.dc.html | `/signup` | Home, Login |
| 04 | Home.dc.html | `/(tabs)/home` | Nova reclamação, Detalhes, Minhas reclamações, Perfil |
| 05 | NovaReclamacao.dc.html | `/complaint/new` | Categorias |
| 06 | Categorias.dc.html | `/complaint/new/category` (passo 1/5) | Formulário |
| 07 | Formulario.dc.html | `/complaint/new/details` (passo 2/5) | Fotos |
| 08 | Foto.dc.html | `/complaint/new/media` (passo 3/5) | Localização |
| 09 | Localizacao.dc.html | `/complaint/new/location` (passo 4/5) | Revisão |
| 10 | Revisao.dc.html | `/complaint/new/review` (passo 5/5) | Confirmação; "Editar" volta ao passo |
| 11 | Confirmacao.dc.html | `/complaint/success` | Detalhes, Home |
| 12 | MinhasReclamacoes.dc.html | `/(tabs)/complaints` | Detalhes |
| 13 | Detalhes.dc.html | `/complaint/[id]` | |
| 14 | Perfil.dc.html | `/(tabs)/profile` | Configurações, Sair → Welcome |
| 15 | Configuracoes.dc.html | `/settings` | |
| 16 | PainelAdmin.dc.html | web separado (admin) | |

Navegação inferior (tabs): Início · Nova · Acompanhar · Perfil.

## Componentes a extrair

Button (primary / outline / ghost), TextField (label + input), StatusBadge, ComplaintCard, StepHeader (voltar + título + barra de 5 passos), CategoryCard (selecionável), Chip/Filter, Switch row, BottomTabBar, SectionCard com "Editar".

## Modelo de dados (sugestão)

```ts
type Status = 'pendente' | 'em_analise' | 'em_andamento' | 'resolvida' | 'improcedente';
type Complaint = {
  id: string; protocol: string;          // "#2026-0852"
  type: 'obra' | 'vizinhanca';
  category: 'ruido' | 'poeira' | 'entulho' | 'vibracao' | 'risco' | 'caminhoes' | 'calcada' | 'outros';
  description: string; occurredAt: string; frequency: 'primeira' | 'alguns_dias' | 'todo_dia';
  contractor?: string; anonymous: boolean;
  media: { uri: string; kind: 'photo' | 'video' }[];
  location: { address: string; lat: number; lng: number; reference?: string };
  status: Status; timeline: { label: string; at: string; by?: string }[];
  cityResponse?: string; createdAt: string;
};
```
