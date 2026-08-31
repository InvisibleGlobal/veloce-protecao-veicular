# Veloce — Design System final

## Direção
Produto operacional premium, humano e objetivo. A interface abandona estética genérica de “AI SaaS”: sem azul/navy, sem glow, sem glassmorphism decorativo, sem microtipografia e sem efeitos tecnológicos gratuitos.

## Paleta
- Carvão principal: `#171713` / `#181814`
- Branco: `#FFFFFF`
- Canvas quente: `#F8F6F1`
- Fundo externo: `#EEEAE1`
- Amarelo Veloce: `#F3C515`
- Amarelo suave: `#FFF5B9`
- Texto secundário: `#737066`
- Linha: `#E3DED2`
- Atraso: vermelho discreto `#B95B50`

## Tipografia
- Display: `Avenir Next`, fallback `Helvetica Neue`, `Segoe UI`, Arial.
- UI/corpo: `Helvetica Neue`, fallback `Segoe UI`, Arial.
- Desktop: título principal 54px; subtítulo 19px; legenda/corpo mínimo 15px.
- Mobile: título principal 33px; subtítulo 15px; legenda mínima 13px.
- Ações, nomes e títulos de cards no mobile permanecem em 15px ou mais; 13px é reservado a metadados/legendas.

## Espaçamento
Escala 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48px. Componentes usam `grid`, `flex`, `minmax(0,1fr)` e `min-width:0` para comportamento equivalente a Auto Layout.

## Geometria
- Radius pequenos: 12px
- Cards: 16–22px
- Shell: 28px
- Bordas: 1px, discretas
- Sombras: curtas e de baixa opacidade; sem glow

## Dashboard
Bento grid de 12 colunas no desktop. Ordem de prioridade: Esteira → KPIs → ações rápidas → Agente → atividade → destaque de vistoria → turno/KPIs → agenda.

## Mobile
Não é desktop comprimido. Mantém primeira camada curta: fila crítica, KPIs em scroller, 3 ações rápidas, Agente compacto, KPIs do turno e 2 compromissos. Atividade secundária, destaque fotográfico e card do operador saem da primeira camada. Navegação inferior fixa + drawer para áreas secundárias.

## Ícones
40 SVGs físicos em `public/icons`; 4 micrográficos físicos em `public/charts`; `command.svg` é uma geometria de quatro módulos, sem rabisco/estrela/glow.
