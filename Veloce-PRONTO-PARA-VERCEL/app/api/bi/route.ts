export async function GET(request: Request) {
  const expected = process.env.BI_API_KEY;
  const supplied = new URL(request.url).searchParams.get("key");
  if (expected && supplied !== expected) return Response.json({ error: "Não autorizado" }, { status: 401 });
  return Response.json({
    generatedAt: new Date().toISOString(),
    summary: { activeEvents: 52, averageDays: 3.8, criticalPending: 7, monthlyResolved: 184, slaCompliance: 0.92 },
    stages: [
      { name: "Entrada", count: 18 }, { name: "Documentos", count: 11 },
      { name: "Análise", count: 9 }, { name: "Execução", count: 14 }, { name: "Concluídos", count: 32 },
    ],
    mode: process.env.NEXT_PUBLIC_SUPABASE_URL ? "connected" : "demo",
  });
}
