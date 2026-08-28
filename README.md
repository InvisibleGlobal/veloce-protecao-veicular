# Veloce — Central Operacional

Projeto Next.js pronto para Vercel, reconstruído com interface clara, responsiva e operacional.

## Deploy

Mantenha o Root Directory do projeto no Vercel apontando para a pasta onde este `package.json` está localizado.

## Assistente externo (opcional)

Se quiser encaminhar solicitações não reconhecidas localmente para n8n, crie no Vercel:

`N8N_WEBHOOK_URL=https://...`

Sem essa variável, os comandos operacionais locais continuam funcionando.

## Comandos locais do assistente

- `Mover EV-2848 para Análise`
- `Mostrar eventos atrasados`
- `Cadastrar novo associado`
- `Criar novo evento`
- `Gerar resumo da operação`

## Atualização ao vivo do protótipo

Cadastros e alterações são refletidos imediatamente na interface, persistem no navegador e são sincronizados entre abas abertas pelo `BroadcastChannel`.
