# Veloce — UI Rebuild V10

Reconstrução estrutural e visual do protótipo operacional Veloce, orientada pelas referências de dashboard fornecidas e pelos requisitos de legibilidade, densidade e uso operacional.

## O que muda nesta versão
- Dashboard refeito em bento operacional, não em uma sequência de cards genéricos.
- Estrutura visual única; sem camadas V4/V6/V7/V8/V9 acumuladas.
- Tipografia separada em display e UI: **Avenir Next** para títulos/métricas e **SF Pro Text** para interface/corpo, com fallbacks nativos.
- Escala obrigatória: desktop **54 / 19 / 15**; mobile **33 / 15 / 13**.
- Nenhum microtexto abaixo do piso definido.
- Paleta Veloce: carvão, branco, creme e amarelo; sem azul/navy e sem status verde de baixo contraste.
- Agente sem estética de “AI template”: símbolo geométrico, sem estrela/sparkle, sem neon, sem gradiente tech e sem copy “IA/copiloto/beta”.
- Mobile redesenhado por prioridade: conteúdo secundário sai da primeira tela em vez de ser comprimido.
- Tabelas viram cards no mobile; métricas usam scroll horizontal; navegação ganha bottom navigation + drawer.
- Fotos de operação/veículo usadas na aplicação vêm de fontes fotográficas reais e livres para uso no protótipo (Pexels), carregadas por URL.

## Módulos funcionais preservados
Visão geral, Esteira, Associados, Rede, Documentos, Rotinas, Agente, busca global, novo associado, novo evento, detalhes/movimentação de etapa e notificações.

## Build ID
`veloce-ui-rebuild-v10-reference-driven-2026-08-31`

## Validação
Rode:

```bash
npm run validate
```

A validação cobre ícones SVG físicos, ausência de SVG inline/emoji, balanço do CSS, tokens tipográficos, proibições de azul/navy/green/`!important`, copy de estética AI e presença das fontes reais usadas no código.
