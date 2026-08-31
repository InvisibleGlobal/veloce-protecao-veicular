# Veloce — reconstrução da UI do zero

Esta versão descarta a camada visual anterior e mantém apenas a lógica funcional do protótipo: navegação, eventos, associados, rede, documentos, rotinas, agente, modais e atualização de etapas.

## Direção de interface
- identidade Veloce: carvão/preto, branco, creme e amarelo;
- sidebar operacional no desktop e bottom navigation no mobile;
- Dashboard em bento grid funcional;
- conteúdo reduzido ao necessário para decidir e agir;
- sem glassmorphism, neon, azul/navy ou estética genérica de “AI dashboard”;
- bordas de 1px, raios sistemáticos e sombras curtas;
- SVGs físicos em `public/icons`;
- fotografias reais remotas para o veículo e o perfil operacional.

## Escala tipográfica obrigatória
Desktop:
- título principal: 54px;
- subtítulo: 19px;
- legenda/corpo mínimo: 15px.

Mobile:
- título principal: 33px;
- subtítulo: 15px;
- legenda/corpo mínimo: 13px.

## Fluxo para produção
Substitua o conteúdo de `Veloce-PRONTO-PARA-VERCEL` por esta pasta, faça commit e `git push origin main`.
