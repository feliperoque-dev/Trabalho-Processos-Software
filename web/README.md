# Ouvidoria de Obras & Vizinhança · Protótipo web

Implementação navegável do mapa de telas definido em [`../design`](../design). É um protótipo **visual**: usa dados fictícios, não tem backend e não valida campos. Essas partes ficam para a próxima etapa.

## Como rodar

```bash
cd web
npm install
npm run dev        # abre em http://localhost:5173
```

Para gerar a versão estática (a pasta `dist/` abre em qualquer servidor ou no GitHub Pages):

```bash
npm run build
npm run preview
```

## O que tem

- **Mapa de telas** (`#/`): as 16 telas em miniatura, agrupadas por fluxo, com a rota e o "leva para" de cada uma.
- **App do cidadão** (`#/welcome` e demais): moldura de celular, lista lateral das telas e um painel com rota, arquivo de design e destinos da tela atual. Num celular de verdade, o app abre em tela cheia.
- **Painel da prefeitura** (`#/admin`): layout desktop com fila de atendimento filtrável.

Ações que dependeriam do servidor (salvar, compartilhar, GPS, recuperar senha etc.) mostram um aviso "próxima etapa".

## Estrutura

```
src/
  components/   Icon, ui (Button, TextField, StatusBadge, ComplaintCard, StepHeader, CategoryCard, Chip, SwitchRow, BottomTabBar, SectionCard)
  data/         mock.ts (modelo de dados do handoff + dados fictícios), screens.ts (mapa de telas), draft.tsx (rascunho da nova reclamação)
  screens/      uma tela por arquivo; NewComplaint.tsx reúne o fluxo 05–11
  shell/        moldura de apresentação: PhoneLayout e ScreenMap
```
