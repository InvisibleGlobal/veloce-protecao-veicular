# Protótipo Veloce

Aplicação React + TypeScript para demonstração de uma esteira operacional de proteção veicular.

## Abrir no computador

1. Instale o Node.js 22 ou superior.
2. Extraia o arquivo ZIP.
3. Abra a pasta extraída no terminal.
4. Execute:

```bash
npm install
npm run dev
```

5. Abra o endereço mostrado no terminal.

Os eventos criados, mudanças de etapa e nomes de documentos anexados ficam salvos no navegador usado na demonstração.

## Publicar em domínio próprio

O projeto pode ser publicado em Vercel, Azure, AWS ou servidor Node. Para produção, configure as variáveis do Supabase e do n8n e aplique o arquivo `supabase/schema.sql`.

## Funcionalidades demonstráveis

- dashboard gerencial;
- criação de eventos;
- busca;
- esteira Kanban;
- avanço e retorno de etapas;
- associados;
- prestadores;
- documentos;
- automações;
- persistência local da demonstração;
- estrutura preparada para Supabase, n8n e BI.
