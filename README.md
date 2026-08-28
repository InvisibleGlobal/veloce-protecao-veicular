# Veloce — Dashboard protótipo premium v2

Projeto Next.js completo, preparado para substituir o conteúdo da pasta usada pelo Vercel.

## Mudança principal
O Dashboard foi reconstruído para seguir a organização da referência fornecida: navegação compacta, grande área de visão do dia e bento grid com associado em destaque, progresso, SLA, checklist, agenda operacional, fluxo, rotinas e leitura ao vivo.

## Design system
- Helvetica em toda a UI
- ícones SVG externos em `/public/icons`
- glassmorphism sutil
- amarelo + grafite + off-white
- grids responsivos e auto-layout
- hierarquia tipográfica uniforme
- margens e gutters sistemáticos

## Funcionalidades mantidas
Esteira, associados, rede, documentos, rotinas, busca, criação de eventos, cadastro de associado, drawer de evento e agente operacional com fallback local + integração opcional via `N8N_WEBHOOK_URL`.

Veja `VALIDACAO-PROTOTIPO.md` para o checklist técnico.
