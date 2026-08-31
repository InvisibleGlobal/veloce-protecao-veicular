# QA visual e responsivo

O QA abaixo foi executado em Chromium sobre HTMLs estáticos representativos usando o MESMO `app/globals.css` final. A checagem mede largura computada, tipografia computada e overflow.

| Tela | 1440px | 768px | 390px |
|---|---|---|---|
| Dashboard | 54 / 19 / min 15; sem overflow | 54 / 19 / min 15; sem overflow | 33 / 15 / min 13; sem overflow |
| Esteira | 54 / 19 / min 15; sem overflow | 54 / 19 / min 15; sem overflow | 33 / 15 / min 13; sem overflow |
| Associados | 54 / 19 / min 15; sem overflow | 54 / 19 / min 15; sem overflow | 33 / 15 / min 13; sem overflow |
| Rede | 54 / 19 / min 15; sem overflow | 54 / 19 / min 15; sem overflow | 33 / 15 / min 13; sem overflow |
| Documentos | 54 / 19 / min 15; sem overflow | 54 / 19 / min 15; sem overflow | 33 / 15 / min 13; sem overflow |
| Rotinas | 54 / 19 / min 15; sem overflow | 54 / 19 / min 15; sem overflow | 33 / 15 / min 13; sem overflow |
| Agente | 54 / 19 / min 15; sem overflow | 54 / 19 / min 15; sem overflow | 33 / 15 / min 13; sem overflow |

Critério de “sem overflow”: `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

Screenshots de QA estão em `qa/renders/`.
