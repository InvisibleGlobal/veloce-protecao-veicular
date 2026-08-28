# Checklist técnico desta versão

- Helvetica / Helvetica Neue / Arial como stack global.
- Tokens únicos para título de página, título de seção/card, subtítulo, descrição, label e legenda.
- Grid e espaçamentos centralizados por variáveis CSS.
- Cards com alturas e alinhamentos consistentes nas grades principais.
- Glassmorphism sutil, bordas translúcidas, sombras controladas e hover.
- Ícones vetoriais renderizados em SVG inline; sem emojis.
- Contraste corrigido nos estados sobre fundos amarelos/escuros.
- Breakpoints para desktop, notebook/tablet, mobile e telas pequenas.
- Esteira com quantitativos no topo e fila detalhada abaixo.
- Cadastro de associado e criação/movimentação de eventos atualizando a interface imediatamente.
- Busca, drawer, modais, botões e ações principais com handlers.
- Agente operacional executando localmente comandos de movimentação, cadastro, criação de evento, SLA, documentos, rede, esteira e relatório.
- Endpoint `/api/agent` com fallback local e encaminhamento opcional ao n8n quando `N8N_WEBHOOK_URL` estiver configurado.
- Sintaxe TS/TSX dos arquivos principais validada com o compilador TypeScript disponível no ambiente.
