# Veloce — Central Operacional

Projeto Next.js da central operacional Veloce.

## Rodar

```bash
npm install
npm run dev
```

## Validar

```bash
npm run typecheck
npm run build
```

## Vercel

A pasta que contém este `package.json` deve ser usada como **Root Directory**.

## Agente operacional

As ações principais funcionam localmente no painel. Para encaminhar solicitações adicionais a uma automação externa, configure:

```env
N8N_WEBHOOK_URL=https://...
```
