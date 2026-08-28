import { NextResponse } from "next/server";

type AgentContext = {
  activeCount?: number;
  riskCount?: number;
  overdueCount?: number;
  associates?: number;
  selectedStage?: string;
};

function localReply(message: string, context: AgentContext) {
  const normalized = message.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const active = Number(context.activeCount ?? 0);
  const risk = Number(context.riskCount ?? 0);
  const overdue = Number(context.overdueCount ?? 0);
  const associates = Number(context.associates ?? 0);

  if (normalized.includes("sla") || normalized.includes("prazo") || normalized.includes("atras")) {
    return `A operação tem ${risk} eventos em risco e ${overdue} atrasados. Priorize primeiro os atrasados e, em seguida, os itens em risco.`;
  }
  if (normalized.includes("associ")) {
    return `A base atual tem ${associates} associados disponíveis para consulta e criação de novos eventos.`;
  }
  if (normalized.includes("evento") || normalized.includes("fila") || normalized.includes("esteira")) {
    return `Há ${active} eventos ativos na operação. Você pode filtrar por etapa, abrir um evento ou mover a etapa diretamente pelo painel.`;
  }
  if (normalized.includes("document")) {
    return "Posso organizar pendências documentais, destacar atrasos e encaminhar a frente para cobrança dentro do painel.";
  }
  if (normalized.includes("rede") || normalized.includes("prestador")) {
    return "A rede pode ser consultada por capacidade, prazo e região para apoiar a distribuição operacional.";
  }
  return "Posso executar agora: mover eventos, abrir a esteira, cadastrar associado, criar evento, revisar prazos, organizar documentos, consultar a rede e gerar resumo operacional.";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const context = (body?.context ?? {}) as AgentContext;
  const webhook = process.env.N8N_WEBHOOK_URL;

  if (!message) {
    return NextResponse.json({ reply: "Digite uma solicitação para continuar." }, { status: 400 });
  }

  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context, source: "veloce-panel" }),
        cache: "no-store",
        signal: AbortSignal.timeout(7000),
      });
      const data = await response.json().catch(() => ({}));
      const reply = data?.reply || data?.message || data?.output;
      if (typeof reply === "string" && reply.trim()) {
        return NextResponse.json({ reply: reply.trim(), integrated: true });
      }
    } catch {
      // A camada local abaixo mantém o painel operacional mesmo se a automação externa estiver indisponível.
    }
  }

  return NextResponse.json({ reply: localReply(message, context), integrated: false });
}
