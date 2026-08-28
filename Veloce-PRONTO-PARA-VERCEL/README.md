# Veloce — Central Operacional

Protótipo Next.js de uma central operacional para proteção veicular, reconstruído com foco em UX de alto volume, automação e execução assistida por IA.

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicar no Vercel

Mantenha estes arquivos diretamente dentro da pasta configurada como **Root Directory** do projeto no Vercel. O preset deve ser **Next.js**.

## O que está demonstrável

- dashboard premium e responsivo;
- esteira com quantitativos por etapa no topo e tabela escalável;
- cadastro de associados com atualização instantânea;
- abertura de eventos com atualização dos contadores;
- avanço e retorno de etapas;
- documentos e upload local demonstrativo;
- rede de prestadores;
- rotinas operacionais e automações;
- agente IA que consulta contexto e executa ações no estado do protótipo;
- persistência local via navegador.

Para produção, substitua a persistência local por Supabase Realtime e conecte as execuções ao n8n usando a estrutura já prevista no projeto.
