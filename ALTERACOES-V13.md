# Veloce V13 — Tipografia e Motion

## Tipografia
- Desktop: título 48px, subtítulo 18px, legenda 15px.
- Mobile: título 29px, subtítulo 15px, legenda 13px.

## Agente Veloce
- Campo de conversa com SVG físico refinado em `public/icons/message.svg`.
- Removido o placeholder visual antigo do composer.
- Ajustado alinhamento, espaçamento e escala do ícone no desktop e mobile.

## Interações
- Transição sutil ao trocar de categoria/workspace.
- Scroll suave para o topo na navegação.
- Reveal progressivo dos principais blocos via IntersectionObserver.
- Hover refinado em navegação, botões, cards, filas, documentos, rede, rotinas, agente e drawer.
- Respeito a `prefers-reduced-motion`.

## Validação
- `npm run validate`: PASS.
- Sintaxe TS/TSX validada por transpile do TypeScript.
