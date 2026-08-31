# Veloce — Redesign Premium V6

Esta versão não é um patch visual. A base de UI foi reconstruída para um padrão de dashboard B2B premium, usando o dashboard de referência enviado em 31/08 como régua de acabamento (sem copiar o layout).

## Alterações gerais
- navegação desktop reconstruída como sidebar navy;
- fundo da aplicação e superfícies migrados para cinzas frios + branco;
- amarelo Veloce reduzido a cor de ação/acento;
- tipografia reconstruída com hierarquia consistente e piso de legibilidade;
- microtextos e legendas aumentados;
- bordas, raios e sombras normalizados;
- cards deixaram de usar glassmorphism e gradientes decorativos em excesso;
- estados de hover/focus revisados;
- responsividade reconstruída para desktop, sidebar compacta, tablet e mobile;
- dashboard reorganizado em grid explícito, sem colunas implícitas e sem cards tortos;
- agenda transformada em cards previsíveis e alinhados;
- rotinas redesenhadas com três blocos equilibrados;
- agente reconstruído com hero navy, badges de alto contraste, chat limpo e painel de ações;
- status do agente não usa verde sobre fundos coloridos;
- botão Agente saiu do formato torto do header e virou um item estruturado da navegação;
- `command.svg` foi redesenhado como um símbolo vetorial geométrico de brilho/automação.

## QA visual
Foram renderizados e inspecionados snapshots locais de:
- Dashboard desktop 1440px;
- Agente desktop 1440px;
- Agente mobile 390px;
- Rotinas desktop 1440px.

Build ID: `veloce-premium-system-redesign-v6-2026-08-31`
