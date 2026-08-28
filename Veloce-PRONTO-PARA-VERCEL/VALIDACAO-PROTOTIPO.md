# Veloce — validação do dashboard protótipo v2

## Reconstrução visual
- Dashboard principal reconstruído em bento grid seguindo a organização da referência enviada: visão do dia no topo + retrato + progresso + SLA + checklist + agenda + módulos operacionais.
- O Dashboard não duplica o cabeçalho grande; a hierarquia principal vive dentro do painel, como na referência.
- O layout evita cards soltos e vazios excessivos: os módulos são encaixados em grid com gutters consistentes.
- Foto real fornecida na referência reaproveitada no card de destaque e no avatar de perfil.

## Design system
- Tipografia global: Helvetica / Helvetica Neue / Arial.
- Tokens únicos para título, subtítulo, corpo, legenda, label, botão e métrica.
- Ícones carregados como arquivos `.svg` externos em `/public/icons`.
- 31 ícones usados no TSX foram conferidos e todos possuem arquivo físico correspondente.
- Nenhuma tag `<svg>` desenhada dentro de `app/page.tsx`.
- Nenhum emoji usado como iconografia.
- Glassmorphism sutil, off-white, grafite e amarelo preservados.

## Responsividade / auto-layout
QA visual do dashboard estático executado com Chromium/Playwright nos seguintes viewports:
- 1440 × 1100 — sem overflow horizontal
- 1280 × 900 — sem overflow horizontal
- 1024 × 800 — sem overflow horizontal
- 768 × 900 — sem overflow horizontal
- 520 × 900 — sem overflow horizontal
- 390 × 844 — sem overflow horizontal
- 360 × 800 — sem overflow horizontal

## Funcionalidades preservadas
- Esteira e filtros por etapa
- Drawer de evento e mudança de etapa
- Cadastro de associado com atualização imediata
- Criação de evento
- Rede de prestadores
- Documentos
- Rotinas
- Busca global
- Agente operacional com fallback local
- Integração opcional com n8n via `N8N_WEBHOOK_URL`

## Validação técnica
- `app/page.tsx`: sintaxe TS/TSX validada com `typescript.transpileModule`.
- `app/layout.tsx`: sintaxe validada.
- `app/api/agent/route.ts`: sintaxe validada.
- `app/globals.css`: validado com `tinycss2`, 0 erros de parsing.
- Todos os assets de imagem referenciados existem em `/public`.
- O ambiente não concluiu `npm install` dentro do limite disponível, então `next build` não foi executado localmente.

Build ID: `prototype-layout-v2-2026-08-28-1845`
