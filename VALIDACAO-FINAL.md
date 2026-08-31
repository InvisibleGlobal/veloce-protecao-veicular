# Validação final — Veloce

Validações executadas nesta versão:

- TypeScript/TSX: sintaxe validada com o compilador TypeScript disponível no ambiente.
- TypeScript estrito: validação concluída com stubs locais apenas para os módulos externos React/Next ausentes no ambiente.
- SVG: 40 arquivos físicos em `public/icons`, sem SVG inline em `app/page.tsx`.
- Emojis: nenhum emoji usado como ícone no `app/page.tsx`.
- Assets: foto principal, avatar, marca e favicon presentes.
- CSS: delimitadores balanceados.
- Agente: rota local testada com sucesso para consulta de SLA e fallback sem n8n.
- Responsividade: os PNGs `qa-baseline-2026-08-28-1440.png` e `qa-baseline-2026-08-28-390.png` foram preservados apenas como baseline anterior à curadoria de 31/08. A versão atual foi validada estruturalmente pelo script de validação e pelo parser TypeScript; consulte `CORRECOES-2026-08-31.md`.
- Build guard: `npm run build` executa `npm run validate` automaticamente antes do `next build`.

## Limitação do ambiente de geração

O `npm install` não pôde concluir neste ambiente porque o acesso ao registry NPM retornou `EAI_AGAIN`. Portanto, o `next build` real depende da instalação normal das dependências no Vercel ou em uma máquina com acesso ao registry. Isso não é um erro detectado no projeto; é uma limitação de rede do ambiente de validação.
