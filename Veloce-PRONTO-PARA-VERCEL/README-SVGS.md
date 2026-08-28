# Veloce — SVGs reais

Esta versão remove os desenhos de ícones inline de `app/page.tsx`.

## O que mudou

- 40 arquivos SVG individuais em `public/icons/`.
- `Icon` carrega cada arquivo por URL (`/icons/nome.svg`).
- Nenhum emoji é usado como ícone da interface.
- Ícones mantêm uma única linguagem visual, tamanho e espessura.
- Contraste automático em superfícies escuras via CSS.

## Validação rápida

No navegador, abra DevTools > Network e filtre por `.svg`: os arquivos em `/icons/` aparecem como requisições reais de assets.
