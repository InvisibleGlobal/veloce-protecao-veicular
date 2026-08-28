# Validação de SVGs reais

- 40 arquivos `.svg` individuais em `public/icons/`.
- `app/page.tsx` não desenha mais os ícones com `<path>`, `<rect>` ou `<circle>` inline.
- O componente `Icon` carrega os arquivos reais por URL: `/icons/{nome}.svg`.
- Nenhum emoji foi usado como substituto de ícone.
