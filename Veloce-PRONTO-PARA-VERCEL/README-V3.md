# Veloce OPS — V3

Atualização do protótipo com foco em operação de alto volume e redução de trabalho manual.

## Principais mudanças

- Esteira redesenhada para alto volume: cards quantitativos por etapa no topo + fila compacta filtrável abaixo.
- Cadastro de associado independente do evento, com inserção instantânea na base e persistência local no protótipo.
- Agente IA operacional com chat, comandos rápidos e execução de rotinas do painel.
- Comando de atualização de etapa por linguagem natural, por exemplo: `Mover EV-2841 para Vistoria`.
- Rotinas de cobrança de documentos, revisão de SLA, triagem e relatório diário conectadas ao endpoint `/api/webhooks/n8n`.
- Central de produtividade no Dashboard com tarefas operacionais comuns em 1 clique.
- Hierarquia tipográfica padronizada para títulos, subtítulos, labels e legendas.
- Responsividade revisada para desktop, tablet e mobile.

## Observação de arquitetura

No protótipo, eventos e associados são atualizados imediatamente no estado da interface e persistidos em `localStorage`. O schema Supabase já contém as entidades `members`, `vehicles` e `events`. Para produção, a mesma UI pode ser ligada ao Supabase Realtime e aos workflows do n8n sem alterar o modelo visual.
