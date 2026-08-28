import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const message = typeof body?.message === "string" ? body.message : "";
  const webhook = process.env.N8N_WEBHOOK_URL;

  if (!message.trim()) {
    return NextResponse.json({ reply: "Digite uma solicitação para continuar." }, { status: 400 });
  }

  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context: body?.context ?? null, source: "veloce-panel" }),
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      const reply = data?.reply || data?.message || data?.output || "Solicitação processada pela automação.";
      return NextResponse.json({ reply, integrated: true });
    } catch {
      return NextResponse.json({ reply: "A automação externa não respondeu. A operação local continua disponível.", integrated: false });
    }
  }

  return NextResponse.json({
    reply: "Posso executar comandos operacionais locais agora. Para fluxos externos, conecte o webhook do n8n no ambiente do Vercel.",
    integrated: false,
  });
}
