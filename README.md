# Veloce — Curadoria completa

Build ID: `veloce-technical-refinement-v18-2026-09-01`

## V18 — refinamento tecnológico
- Identidade grafite e dourado preservada, Poppins local e opção clara/escura.
- Gráficos de etapas e prazos calculados a partir dos eventos da sessão; não representam uma série histórica ou integração em tempo real.
- Clique nas etapas para abrir a esteira filtrada. No celular, gráficos alternados em abas.
- Luzes nas bordas, pulse e ícones em parallax; efeitos pausam fora da tela e respeitam movimento reduzido.
- Navegação conserva a tela anterior durante a rolagem suave, evitando saltos de altura.
- Testes: `npm run validate`, `node scripts/verify-refinement.mjs`, `npm run build`.
- A validação automatizada de estrutura e dados não substitui a inspeção visual em dispositivos reais.

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
