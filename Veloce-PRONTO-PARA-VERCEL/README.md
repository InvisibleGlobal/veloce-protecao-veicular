# Veloce — Central Operacional

Projeto Next.js reconstruído com foco em operação real, clareza visual e responsividade.

## Rodar localmente

```bash
npm install
npm run dev
```

## Validar antes do deploy

```bash
npm run typecheck
npm run build
```

## Vercel

Use esta pasta como **Root Directory** do projeto no Vercel.

## Agente operacional

O endpoint `app/api/agent/route.ts` aceita `POST` e pode encaminhar a solicitação para o n8n quando a variável abaixo estiver configurada:

```env
N8N_WEBHOOK_URL=https://...
```

Sem webhook, os comandos locais da interface continuam funcionando.
