# Validação de requisitos — Veloce V10

## Tipografia e legibilidade
- [x] Família de títulos realmente alterada: Avenir Next.
- [x] Família da UI definida separadamente: SF Pro Text.
- [x] Desktop: título 54px.
- [x] Desktop: subtítulo 19px.
- [x] Desktop: legenda/microcopy 15px.
- [x] Mobile: título 33px.
- [x] Mobile: subtítulo 15px.
- [x] Mobile: legenda/microcopy 13px.
- [x] Sem microtexto abaixo desses pisos.
- [x] Sem uppercase/letter-spacing artificial usado como “estética tech”.

## Retirada da estética genérica de IA
- [x] Sem azul/navy.
- [x] Sem status verde de baixo contraste.
- [x] Sem neon/glow.
- [x] Sem glassmorphism.
- [x] Sem copy “IA”, “copiloto”, “beta”, “inteligência” ou “mágico”.
- [x] Sem ícone de estrela/sparkle no Agente.
- [x] `command.svg` redesenhado como símbolo operacional geométrico.

## CSS / Figma-like system
- [x] Stylesheet único reconstruído.
- [x] Tokens fechados de cor, tipografia, raio, sombra e espaçamento.
- [x] Zero `!important`.
- [x] Grid bento de 12 colunas.
- [x] Auto Layout com flex/grid/minmax; conteúdo reflow em vez de encolher fonte.
- [x] Header, botões, cards, inputs, tabelas, badges e estados usam geometrias consistentes.

## Referências
- [x] KPI cluster com micrográficos físicos em SVG.
- [x] Bento operacional assimétrico.
- [x] Bloco escuro de ação central.
- [x] Atividade recente curta e visual.
- [x] Card fotográfico de veículo.
- [x] Paleta quente clara + carvão + amarelo.
- [x] Densidade funcional sem parágrafos longos.

## Dashboard e produto
- [x] Dashboard prioriza ação, não explicação.
- [x] Esteira crítica aparece no primeiro bloco.
- [x] Ações rápidas são executáveis.
- [x] Agente tem atalhos e chat operacional.
- [x] Atividade, veículo, turno e próximas ações são módulos separados.
- [x] Módulos completos: Visão geral, Esteira, Associados, Rede, Documentos, Rotinas, Agente.

## Mobile
- [x] Dashboard não é desktop comprimido.
- [x] Cards secundários saem da primeira experiência.
- [x] KPI cluster vira scroller horizontal.
- [x] Ações rápidas ficam 2x2 e mostram só 4 prioridades.
- [x] Tabelas viram cards.
- [x] Bottom navigation fixa com 5 destinos prioritários.
- [x] Drawer para navegação secundária.

## Imagens
- [x] Imagem de carro sintética removida da aplicação final.
- [x] Imagem de operador sintética removida da aplicação final.
- [x] Veículo final: fotografia Pexels real.
- [x] Atendimento final: fotografia Pexels real.

## Auditoria técnica
- [x] 40 ícones SVG físicos.
- [x] Zero SVG inline em `app/page.tsx`.
- [x] Zero emoji em `app/page.tsx`.
- [x] CSS balanceado.
- [x] TSX transpilado sem erro de sintaxe.
- [x] Zero `!important` / blue / navy / green nos assets textuais da aplicação.
- [x] Zero tokens de copy associados à estética “AI template”.

## QA visual
Os renders existentes em `qa/` validam a geometria e responsividade dos módulos sem overflow lateral. As duas imagens externas Pexels são carregadas em runtime na versão final e substituem os antigos assets sintéticos.

> Limite desta validação: o ambiente atual não possui `node_modules`, portanto não foi declarado `next build` completo como aprovado. O código passou por validação estrutural e transpilação TSX.
