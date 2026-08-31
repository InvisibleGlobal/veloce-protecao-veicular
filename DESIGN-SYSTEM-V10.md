# Design System — Veloce V10

## 1. Princípio de produto
A interface deve responder em poucos segundos:
1. O que está acontecendo?
2. O que exige ação agora?
3. Qual é o próximo passo?

O SaaS não é uma landing page nem um relatório. Textos longos foram substituídos por estados, números, responsáveis e ações.

## 2. Tipografia
### Display
`Avenir Next`, com fallback `Cabin`, `Helvetica Neue`, Arial, sans-serif.
Uso: H1, H2/H3 estruturais, métricas e números de destaque.

### UI
`SF Pro Text`, com fallback `Helvetica Neue`, Arial, sans-serif.
Uso: navegação, labels, corpo, inputs, botões, tabelas e legendas.

### Escala fixa
**Desktop**
- Título de página: 54px
- Subtítulo de página: 19px
- Legenda/microcopy: 15px
- Corpo: 16px

**Mobile**
- Título de página: 33px
- Subtítulo de página: 15px
- Legenda/microcopy: 13px
- Corpo: 15px

Quando não cabe, o layout reorganiza. A fonte não diminui abaixo desse piso.

## 3. Grid e Auto Layout
- Shell máximo: 1640px.
- Dashboard: bento de 12 colunas.
- Gaps: 12–30px conforme camada.
- Cards: largura fluida, `minmax(0,1fr)`, sem truncar o layout para caber.
- Tablet: navegação completa sai do header e vira drawer.
- Mobile: uma coluna; KPIs em scroll horizontal; ações rápidas 2x2; cards secundários escondidos da primeira experiência.

## 4. Paleta
- Ink: `#151512`
- Dark: `#181815`
- Shell: `#F7F5EF`
- Surface: `#FFFFFF`
- Canvas: `#ECEAE4`
- Yellow: `#F4C515`
- Danger: `#B43A31`

Não há azul/navy. O estado neutro substitui o antigo verde ilegível.

## 5. Superfícies
- Bordas: 1px, baixa opacidade/contraste.
- Raios: 13px controles; 20px cards; 30px shell.
- Sombras: curtas e difusas, sem glow/neon.
- Sem glassmorphism, gradiente tecnológico ou halo artificial.

## 6. Agente
- `command.svg` é um SVG físico geométrico de quatro nós conectados.
- Sem estrela, brilho mágico, sparkle ou símbolo de “IA”.
- Card do agente usa carvão + amarelo apenas como acento funcional.
- Copy operacional: comando, contexto, execução e resultado.

## 7. Referências aplicadas
Das referências fornecidas foram extraídos, de forma concreta:
- dashboard modular/bento;
- KPI cluster com micrográficos;
- bloco escuro central de ação;
- atividade recente em lista curta;
- card fotográfico de veículo;
- composição assimétrica porém alinhada;
- bordas discretas;
- superfície clara quente;
- amarelo pontual;
- alta densidade funcional sem parágrafos explicativos.
