export async function POST(request: Request) {
  const body = await request.json();
  const webhook = process.env.N8N_WEBHOOK_URL;
  if (!webhook) return Response.json({ queued: true, mode: "demo", event: body.event });
  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-automation-secret": process.env.AUTOMATION_SECRET ?? "" },
    body: JSON.stringify({ ...body, emittedAt: new Date().toISOString(), source: "veloce" }),
  });
  if (!response.ok) return Response.json({ error: "Falha ao acionar automação" }, { status: 502 });
  return Response.json({ queued: true, mode: "live" });
}
