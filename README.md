# Veloce — Curadoria completa

Build ID: `veloce-final-curadoria-completa-2026-08-31`

Esta versão substitui as tentativas anteriores e concentra uma única camada visual em `app/page.tsx` + `app/globals.css`.

## Rodar localmente
```bash
npm install
npm run validate
npm run dev
```

## Build
```bash
npm run build
```

## Publicar no fluxo atual GitHub → Vercel
Substitua o conteúdo de `Veloce-PRONTO-PARA-VERCEL` por este projeto, faça `git add -A`, commit e `git push origin main`.

## QA
- `VALIDACAO-REQUISITOS-FINAL.md`
- `VALIDACAO-QA.md`
- `DESIGN-SYSTEM.md`
- `ASSETS.md`
- renders em `qa/renders/`

## Release V13 — Tipografia + Motion
- Desktop: título 48px, subtítulo 18px, legenda 15px.
- Mobile: título 29px, subtítulo 15px, legenda 13px.
- Ícone físico SVG refinado no campo do Agente Veloce.
- Transição sutil entre categorias, reveal progressivo no scroll e hovers refinados.
- Respeito a `prefers-reduced-motion`.

## V14 — visão geral essencial
A página inicial foi simplificada para exibir somente alertas críticos e prioridades imediatas. Informações detalhadas permanecem nas abas operacionais correspondentes. Consulte `ALTERACOES-V14.md`.
