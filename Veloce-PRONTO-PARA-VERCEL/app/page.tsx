"use client";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Database,
  FileCheck2,
  FileText,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Network,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Send,
  Server,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UserPlus,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type Stage = "Entrada" | "Documentos" | "Análise" | "Vistoria" | "Aprovação" | "Reparo" | "Concluído";
type Priority = "Alta" | "Normal";
type Sla = "Dentro" | "Risco" | "Atrasado";
type EventItem = {
  id: string;
  member: string;
  phone: string;
  vehicle: string;
  plate: string;
  type: string;
  stage: Stage;
  owner: string;
  priority: Priority;
  created: string;
  updated: string;
  docs: string[];
  value: number;
  city: string;
  sla: Sla;
};

type AssociateStatus = "Ativo" | "Pendente";
type AssociateItem = {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  vehicle: string;
  plate: string;
  city: string;
  status: AssociateStatus;
  joined: string;
  updated: string;
};

type AgentMessage = {
  id: string;
  role: "agent" | "user";
  text: string;
  meta?: string;
};

const stages: Stage[] = ["Entrada", "Documentos", "Análise", "Vistoria", "Aprovação", "Reparo", "Concluído"];
const STORAGE_KEY = "veloce-events-v3";
const ASSOCIATE_STORAGE_KEY = "veloce-associates-v3";

const seed: EventItem[] = [
  { id: "EV-2841", member: "Marina Costa", phone: "(62) 99821-4430", vehicle: "Jeep Renegade 2023", plate: "QWE-8H21", type: "Colisão", stage: "Análise", owner: "Camila", priority: "Alta", created: "28/08/2026", updated: "há 8 min", docs: ["CNH.pdf", "Documento-veiculo.pdf"], value: 18400, city: "Goiânia / GO", sla: "Risco" },
  { id: "EV-2839", member: "Rafael Nunes", phone: "(62) 99108-7731", vehicle: "Honda Civic 2020", plate: "RTA-2D09", type: "Assistência", stage: "Vistoria", owner: "Leandro", priority: "Normal", created: "28/08/2026", updated: "há 14 min", docs: ["CNH.pdf"], value: 3200, city: "Aparecida / GO", sla: "Dentro" },
  { id: "EV-2835", member: "Bruna Almeida", phone: "(62) 98410-0023", vehicle: "VW T-Cross 2022", plate: "GHI-4B10", type: "Vidros", stage: "Documentos", owner: "Camila", priority: "Alta", created: "27/08/2026", updated: "há 32 min", docs: [], value: 4800, city: "Goiânia / GO", sla: "Atrasado" },
  { id: "EV-2828", member: "Carlos Ribeiro", phone: "(62) 99661-1522", vehicle: "Toyota Corolla 2021", plate: "KLM-7C44", type: "Roubo/Furto", stage: "Aprovação", owner: "André", priority: "Alta", created: "26/08/2026", updated: "há 48 min", docs: ["B.O.pdf", "CNH.pdf"], value: 92700, city: "Trindade / GO", sla: "Risco" },
  { id: "EV-2821", member: "Elisa Martins", phone: "(62) 99780-2262", vehicle: "Hyundai HB20 2024", plate: "OPA-1A73", type: "Colisão", stage: "Reparo", owner: "Leandro", priority: "Normal", created: "25/08/2026", updated: "há 1 h", docs: ["Orçamento.pdf"], value: 12100, city: "Goiânia / GO", sla: "Dentro" },
  { id: "EV-2819", member: "Leonardo Paiva", phone: "(62) 99325-4421", vehicle: "Chevrolet Onix 2022", plate: "RBL-8D17", type: "Colisão", stage: "Entrada", owner: "Camila", priority: "Normal", created: "25/08/2026", updated: "há 1 h", docs: [], value: 7600, city: "Senador Canedo / GO", sla: "Dentro" },
  { id: "EV-2814", member: "Ana Luiza Reis", phone: "(62) 98201-1198", vehicle: "Nissan Kicks 2021", plate: "PRK-3A21", type: "Assistência", stage: "Documentos", owner: "André", priority: "Normal", created: "24/08/2026", updated: "há 2 h", docs: ["CNH.pdf"], value: 1900, city: "Goiânia / GO", sla: "Dentro" },
  { id: "EV-2808", member: "Felipe Moraes", phone: "(62) 99890-7782", vehicle: "Fiat Pulse 2024", plate: "SGB-9J38", type: "Colisão", stage: "Vistoria", owner: "Leandro", priority: "Alta", created: "23/08/2026", updated: "há 2 h", docs: ["CNH.pdf", "Fotos.zip"], value: 23600, city: "Goiânia / GO", sla: "Risco" },
  { id: "EV-2801", member: "Patrícia Lima", phone: "(62) 98511-2300", vehicle: "Ford Territory 2023", plate: "SDQ-6E44", type: "Colisão", stage: "Aprovação", owner: "André", priority: "Normal", created: "22/08/2026", updated: "há 3 h", docs: ["Laudo.pdf", "Orçamento.pdf"], value: 31800, city: "Goiânia / GO", sla: "Dentro" },
  { id: "EV-2794", member: "Lucas Carvalho", phone: "(62) 99177-4022", vehicle: "VW Nivus 2022", plate: "RXP-1F08", type: "Vidros", stage: "Reparo", owner: "Camila", priority: "Normal", created: "21/08/2026", updated: "há 4 h", docs: ["Orçamento.pdf"], value: 5400, city: "Aparecida / GO", sla: "Dentro" },
  { id: "EV-2788", member: "João Victor Melo", phone: "(62) 99908-1146", vehicle: "Toyota Hilux 2021", plate: "QZA-0C71", type: "Roubo/Furto", stage: "Concluído", owner: "André", priority: "Alta", created: "19/08/2026", updated: "ontem", docs: ["B.O.pdf", "Termo.pdf"], value: 164000, city: "Goiânia / GO", sla: "Dentro" },
  { id: "EV-2779", member: "Renata Prado", phone: "(62) 98121-0045", vehicle: "Honda HR-V 2020", plate: "PQR-7H35", type: "Colisão", stage: "Concluído", owner: "Leandro", priority: "Normal", created: "18/08/2026", updated: "ontem", docs: ["Laudo.pdf", "Nota.pdf"], value: 14800, city: "Goiânia / GO", sla: "Dentro" },
];

const associateSeed: AssociateItem[] = seed.map((item, index) => ({
  id: `AS-${String(1188 - index).padStart(4, "0")}`,
  name: item.member,
  cpf: "***.***.***-**",
  phone: item.phone,
  email: `${item.member.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, ".")}@email.com`,
  vehicle: item.vehicle,
  plate: item.plate,
  city: item.city,
  status: item.docs.length ? "Ativo" : "Pendente",
  joined: item.created,
  updated: item.updated,
}));

const nav = [
  ["Dashboard", LayoutDashboard],
  ["Esteira", Gauge],
  ["Associados", Users],
  ["Prestadores", Wrench],
  ["Documentos", FileText],
  ["Automações", Activity],
  ["Assistente", MessageSquare],
] as const;

const viewCopy: Record<string, string> = {
  Dashboard: "Tudo que a operação precisa fazer, concentrado em um painel simples, rápido e acionável.",
  Esteira: "Volume por etapa no topo e uma fila operacional preparada para alto volume.",
  Associados: "Cadastre, localize e acompanhe associados com atualização instantânea.",
  Prestadores: "Rede credenciada, capacidade, qualidade e SLA em uma única visão.",
  Documentos: "Recebimento, validação e rastreabilidade dos arquivos da operação.",
  Automações: "Rotinas repetitivas executadas sem depender de acompanhamento manual.",
  "Assistente": "Converse com a operação, consulte dados e execute rotinas sem trocar de tela.",
};

const money = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);
const uid = () => Math.random().toString(36).slice(2, 10);

export default function Home() {
  const [view, setView] = useState("Dashboard");
  const [items, setItems] = useState<EventItem[]>(seed);
  const [associates, setAssociates] = useState<AssociateItem[]>(associateSeed);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [eventModal, setEventModal] = useState(false);
  const [associateModal, setAssociateModal] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [agentCommand, setAgentCommand] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    const storedAssociates = localStorage.getItem(ASSOCIATE_STORAGE_KEY);
    if (storedEvents) {
      try { setItems(JSON.parse(storedEvents)); } catch { /* ignore malformed local data */ }
    }
    if (storedAssociates) {
      try { setAssociates(JSON.parse(storedAssociates)); } catch { /* ignore malformed local data */ }
    }
    navigator.serviceWorker?.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem(ASSOCIATE_STORAGE_KEY, JSON.stringify(associates)); }, [associates]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setSelected(null);
        setEventModal(false);
        setAssociateModal(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(
    () => items.filter((x) => `${x.id} ${x.member} ${x.plate} ${x.type} ${x.owner} ${x.city}`.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  const filteredAssociates = useMemo(
    () => associates.filter((x) => `${x.id} ${x.name} ${x.phone} ${x.email} ${x.vehicle} ${x.plate} ${x.city}`.toLowerCase().includes(query.toLowerCase())),
    [associates, query]
  );

  const active = items.filter((x) => x.stage !== "Concluído").length;
  const completed = items.filter((x) => x.stage === "Concluído").length;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function createEvent(form: FormData) {
    const currentMax = Math.max(...items.map((x) => Number(x.id.replace("EV-", ""))), 2841);
    const event: EventItem = {
      id: `EV-${currentMax + 1}`,
      member: String(form.get("member")),
      phone: String(form.get("phone")),
      vehicle: String(form.get("vehicle")),
      plate: String(form.get("plate")).toUpperCase(),
      type: String(form.get("type")),
      stage: "Entrada",
      owner: String(form.get("owner")),
      priority: form.get("priority") as Priority,
      created: new Date().toLocaleDateString("pt-BR"),
      updated: "agora",
      docs: [],
      value: Number(form.get("value")) || 0,
      city: String(form.get("city")) || "Goiânia / GO",
      sla: "Dentro",
    };
    setItems((value) => [event, ...value]);
    setEventModal(false);
    notify(`${event.id} criado e inserido na esteira.`);
  }

  function createAssociate(form: FormData) {
    const currentMax = Math.max(...associates.map((x) => Number(x.id.replace("AS-", ""))), 1188);
    const associate: AssociateItem = {
      id: `AS-${currentMax + 1}`,
      name: String(form.get("name")),
      cpf: String(form.get("cpf")) || "Não informado",
      phone: String(form.get("phone")),
      email: String(form.get("email")) || "Não informado",
      vehicle: String(form.get("vehicle")) || "Veículo não informado",
      plate: String(form.get("plate") || "---").toUpperCase(),
      city: String(form.get("city")) || "Goiânia / GO",
      status: form.get("status") as AssociateStatus,
      joined: new Date().toLocaleDateString("pt-BR"),
      updated: "agora",
    };
    setAssociates((value) => [associate, ...value]);
    setAssociateModal(false);
    setView("Associados");
    notify(`${associate.name} cadastrado. A base foi atualizada ao vivo.`);
  }

  function move(id: string, direction: number) {
    setItems((value) => value.map((item) => {
      if (item.id !== id) return item;
      const index = Math.max(0, Math.min(stages.length - 1, stages.indexOf(item.stage) + direction));
      const next = { ...item, stage: stages[index], updated: "agora" };
      if (selected?.id === id) setSelected(next);
      return next;
    }));
  }

  function setEventStage(id: string, stage: Stage) {
    const found = items.some((item) => item.id.toLowerCase() === id.toLowerCase());
    if (!found) return false;
    setItems((value) => value.map((item) => item.id.toLowerCase() === id.toLowerCase() ? { ...item, stage, updated: "agora" } : item));
    setSelected((item) => item && item.id.toLowerCase() === id.toLowerCase() ? { ...item, stage, updated: "agora" } : item);
    notify(`${id.toUpperCase()} atualizado para ${stage}.`);
    return true;
  }

  function addDocs(id: string, files: FileList | null) {
    if (!files) return;
    const names = [...files].map((file) => file.name);
    setItems((value) => value.map((item) => item.id === id ? { ...item, docs: [...item.docs, ...names], updated: "agora" } : item));
    setSelected((item) => item ? { ...item, docs: [...item.docs, ...names], updated: "agora" } : item);
    notify(`${names.length} arquivo(s) anexado(s) ao ${id}.`);
  }

  function openAgent(command?: string) {
    setView("Assistente");
    if (command) setAgentCommand(command);
  }

  function handlePrimaryAction() {
    if (view === "Associados") setAssociateModal(true);
    else if (view === "Assistente") openAgent("Quero cadastrar um novo associado");
    else setEventModal(true);
  }

  const primaryLabel = view === "Associados" ? "Novo associado" : view === "Assistente" ? "Nova solicitação" : "Novo evento";
  const PrimaryIcon = view === "Associados" ? UserPlus : view === "Assistente" ? MessageSquare : Plus;

  return (
    <div className="ops-shell">
      <aside className={`ops-sidebar ${menu ? "show" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><ShieldCheck /></div>
          <div><strong>VELOCE</strong><span>OPERAÇÃO</span></div>
        </div>
        <button className="mobile-close" onClick={() => setMenu(false)} aria-label="Fechar menu"><X /></button>

        <div className="workspace-switcher">
          <span className="workspace-avatar">VP</span>
          <div><small>WORKSPACE</small><b>Veloce Proteção</b></div>
          <ChevronDown />
        </div>

        <p className="nav-label">OPERAÇÃO</p>
        <nav className="primary-nav">
          {nav.map(([name, Icon]) => (
            <button key={name} className={`${view === name ? "active" : ""} ${name === "Assistente" ? "ai-nav" : ""}`} onClick={() => { setView(name); setMenu(false); }}>
              <Icon /><span>{name}</span>{name === "Esteira" && <em>{active}</em>}{name === "Assistente" && <i className="ai-live-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="infra-panel">
          <div className="infra-title"><span className="status-led" />Infraestrutura</div>
          <div className="infra-row"><Database /><span>Database</span><b>24 ms</b></div>
          <div className="infra-row"><Network /><span>Automações</span><b>online</b></div>
          <div className="infra-row"><Server /><span>API Gateway</span><b>99.99%</b></div>
        </div>
        <button className="settings-link"><Settings />Configurações</button>
      </aside>

      <main className="ops-main">
        <header className="ops-topbar">
          <button className="mobile-menu" onClick={() => setMenu(true)} aria-label="Abrir menu"><Menu /></button>
          <div className="top-context"><span>Operação</span><ChevronRight /><b>{view}</b></div>
          <div className="global-search">
            <Search />
            <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar evento, associado, placa ou responsável" />
            <kbd>⌘ K</kbd>
          </div>
          <div className="environment"><span className="status-led" />LIVE</div>
          <button className="icon-button" aria-label="Notificações"><Bell /><i>3</i></button>
          <div className="user-block"><span>DM</span><div><b>Débora Martins</b><small>Admin</small></div></div>
        </header>

        <section className="ops-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><CircleDot />CENTRAL OPERACIONAL · DADOS SINCRONIZADOS</div>
              <h1>{view === "Dashboard" ? "Operação sob controle" : view}</h1>
              <p>{viewCopy[view]}</p>
            </div>
            <div className="heading-actions">
              <button className="assistant-button" onClick={() => openAgent()}><MessageSquare />Abrir assistente<span className="status-led" /></button>
              <button className="secondary-button"><SlidersHorizontal />Filtros</button>
              <button className="primary-button" onClick={handlePrimaryAction}><PrimaryIcon />{primaryLabel}</button>
            </div>
          </div>

          {view === "Dashboard" && <Dashboard items={items} active={active} completed={completed} onOpen={setSelected} onGoPipeline={() => setView("Esteira")} onNewAssociate={() => setAssociateModal(true)} onAgent={openAgent} />}
          {view === "Esteira" && <Pipeline items={filtered} onOpen={setSelected} />}
          {view === "Associados" && <Associates items={filteredAssociates} onNew={() => setAssociateModal(true)} />}
          {view === "Prestadores" && <Providers />}
          {view === "Documentos" && <Documents items={items} />}
          {view === "Automações" && <Automations />}
          {view === "Assistente" && <AgentView items={items} command={agentCommand} onCommandConsumed={() => setAgentCommand(null)} onSetStage={setEventStage} onNewAssociate={() => setAssociateModal(true)} onNewEvent={() => setEventModal(true)} notify={notify} />}
        </section>
      </main>

      {eventModal && <NewEvent onClose={() => setEventModal(false)} onCreate={createEvent} />}
      {associateModal && <NewAssociate onClose={() => setAssociateModal(false)} onCreate={createAssociate} />}
      {selected && <Detail item={selected} onClose={() => setSelected(null)} onMove={(direction) => move(selected.id, direction)} onFiles={(files) => addDocs(selected.id, files)} />}
      {toast && <div className="toast"><CheckCircle2 />{toast}</div>}
    </div>
  );
}

function Dashboard({ items, active, completed, onOpen, onGoPipeline, onNewAssociate, onAgent }: { items: EventItem[]; active: number; completed: number; onOpen: (item: EventItem) => void; onGoPipeline: () => void; onNewAssociate: () => void; onAgent: (command?: string) => void }) {
  const monthly = [46, 52, 49, 61, 58, 67, 72, 68, 79, 81, 86, 94];
  const activeItems = items.filter((item) => item.stage !== "Concluído");
  const managed = activeItems.reduce((sum, item) => sum + item.value, 0);
  const withinSla = activeItems.filter((item) => item.sla === "Dentro").length;
  const sla = activeItems.length ? Math.round((withinSla / activeItems.length) * 100) : 100;
  const critical = activeItems.filter((item) => item.priority === "Alta" || item.sla !== "Dentro").length;
  const stageCounts = stages.slice(0, -1).map((stage) => ({ stage, count: activeItems.filter((item) => item.stage === stage).length }));
  const maxStage = Math.max(1, ...stageCounts.map((x) => x.count));
  const missingDocs = activeItems.filter((item) => item.docs.length === 0).length;
  const intake = activeItems.filter((item) => item.stage === "Entrada").length;

  return (
    <>
      <div className="metric-grid">
        <Metric label="EVENTOS ATIVOS" value={String(active).padStart(2, "0")} delta="+12,8%" hint="vs. mês anterior" icon={<Car />} />
        <Metric label="VALOR SOB GESTÃO" value={money(managed)} delta="+7,4%" hint="estimativa operacional" />
        <Metric label="SLA DENTRO DO PRAZO" value={`${sla}%`} delta="+2,1 pp" hint={`${withinSla} eventos no prazo`} />
        <Metric label="PENDÊNCIAS CRÍTICAS" value={String(critical).padStart(2, "0")} delta="3 hoje" hint="requerem ação" tone="alert" icon={<AlertTriangle />} />
      </div>

      <OpsHub missingDocs={missingDocs} critical={critical} intake={intake} onNewAssociate={onNewAssociate} onAgent={onAgent} />

      <div className="dashboard-grid">
        <article className="panel performance-panel">
          <PanelHeader label="VOLUME OPERACIONAL" title="Eventos processados" aside={<span className="live-chip"><span className="status-led" />LIVE</span>} />
          <div className="chart-meta"><strong>94</strong><span>eventos em agosto</span><em>+9,3%</em></div>
          <div className="bar-chart">
            <div className="y-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
            <div className="bars">
              {monthly.map((value, index) => (
                <div className="bar-column" key={index}><i style={{ height: `${value}%` }} className={index === monthly.length - 1 ? "current" : ""} /><small>{["Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"][index]}</small></div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel stage-panel">
          <PanelHeader label="DISTRIBUIÇÃO" title="Carga por etapa" aside={<Gauge />} />
          <div className="stage-load">
            {stageCounts.map(({ stage, count }) => (
              <div className="stage-load-row" key={stage}>
                <div><span>{stage}</span><b>{count}</b></div>
                <div className="load-track"><i style={{ width: `${(count / maxStage) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="throughput"><span><Clock3 />Lead time médio</span><b>3,8 dias</b></div>
          <div className="throughput"><span><Zap />Throughput / dia</span><b>4,6 eventos</b></div>
        </article>
      </div>

      <div className="lower-grid">
        <article className="panel queue-panel">
          <PanelHeader label="FILA OPERACIONAL" title="Eventos prioritários" aside={<button className="text-button" onClick={onGoPipeline}>Abrir esteira <ArrowRight /></button>} />
          <div className="event-table">
            <div className="event-table-head"><span>Evento / Associado</span><span>Tipo</span><span>Etapa</span><span>SLA</span><span>Responsável</span><span>Atualização</span><span /></div>
            {items.filter((item) => item.stage !== "Concluído").slice(0, 7).map((item) => (
              <button className="event-row" key={item.id} onClick={() => onOpen(item)}>
                <span className="event-person"><i className={`priority-dot ${item.priority === "Alta" ? "high" : ""}`} /><span><b>{item.id} · {item.member}</b><small>{item.vehicle} · {item.plate}</small></span></span>
                <span>{item.type}</span>
                <span><StatusBadge value={item.stage} /></span>
                <span><SlaBadge value={item.sla} /></span>
                <span>{item.owner}</span>
                <span className="muted-cell">{item.updated}</span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </article>

        <aside className="panel system-panel">
          <PanelHeader label="SAÚDE DO SISTEMA" title="Serviços conectados" aside={<Activity />} />
          <div className="system-score"><strong>99.98%</strong><span>uptime últimos 30 dias</span></div>
          <SystemRow icon={<Database />} name="Supabase" meta="DB + Storage" latency="24 ms" />
          <SystemRow icon={<Network />} name="n8n" meta="18 workflows ativos" latency="online" />
          <SystemRow icon={<Server />} name="API" meta="Gateway produção" latency="38 ms" />
          <SystemRow icon={<FileCheck2 />} name="Documentos" meta="Fila de validação" latency="normal" />
          <div className="system-footer"><span className="status-led" />Nenhuma indisponibilidade detectada</div>
        </aside>
      </div>
    </>
  );
}

function OpsHub({ missingDocs, critical, intake, onNewAssociate, onAgent }: { missingDocs: number; critical: number; intake: number; onNewAssociate: () => void; onAgent: (command?: string) => void }) {
  const actions = [
    { title: "Cobrar documentos", caption: "WhatsApp + registro automático", value: `${missingDocs} pendentes`, icon: <ClipboardCheck />, action: () => onAgent("Cobrar documentos pendentes agora") },
    { title: "Revisar SLAs", caption: "Priorizar e alertar responsáveis", value: `${critical} críticos`, icon: <Clock3 />, action: () => onAgent("Revisar SLAs críticos e me diga o que precisa de ação") },
    { title: "Triar novas entradas", caption: "Classificar a fila sem planilha", value: `${intake} aguardando`, icon: <ListChecks />, action: () => onAgent("Triar os novos eventos da etapa Entrada") },
    { title: "Cadastrar associado", caption: "Registro aparece na base na hora", value: "tempo real", icon: <UserPlus />, action: onNewAssociate },
    { title: "Gerar relatório", caption: "Resumo diário pronto para gestão", value: "1 clique", icon: <ReceiptText />, action: () => onAgent("Gerar relatório diário da operação") },
    { title: "Pedir ao assistente", caption: "Consulte dados ou execute ações", value: "online", icon: <MessageSquare />, action: () => onAgent() },
  ];

  return <article className="panel ops-hub">
    <PanelHeader label="ROTINAS OPERACIONAIS" title="O trabalho pesado, resolvido no painel" aside={<span className="assistant-status"><Network />Automações conectadas</span>} />
    <div className="ops-action-grid">
      {actions.map((item) => <button className="ops-action-card" key={item.title} onClick={item.action}>
        <span className="ops-action-icon">{item.icon}</span>
        <div><b>{item.title}</b><small>{item.caption}</small></div>
        <em>{item.value}</em>
        <ArrowRight />
      </button>)}
    </div>
  </article>;
}

function Metric({ label, value, delta, hint, tone, icon }: { label: string; value: string; delta: string; hint: string; tone?: "alert"; icon?: ReactNode }) {
  return <article className={`metric-card ${tone || ""}`}><div className="metric-top"><small>{label}</small>{icon}</div><strong>{value}</strong><div className="metric-foot"><span>{delta}</span><em>{hint}</em></div></article>;
}

function PanelHeader({ label, title, aside }: { label: string; title: string; aside?: ReactNode }) {
  return <div className="panel-header"><div><small>{label}</small><h3>{title}</h3></div>{aside && <div className="panel-aside">{aside}</div>}</div>;
}

function StatusBadge({ value }: { value: Stage }) {
  const cls = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace("ç", "c");
  return <span className={`status-badge ${cls}`}>{value}</span>;
}

function SlaBadge({ value }: { value: Sla }) {
  return <span className={`sla-badge ${value === "Dentro" ? "good" : value === "Risco" ? "risk" : "late"}`}><i />{value}</span>;
}

function SystemRow({ icon, name, meta, latency }: { icon: ReactNode; name: string; meta: string; latency: string }) {
  return <div className="system-row"><span className="system-icon">{icon}</span><div><b>{name}</b><small>{meta}</small></div><em>{latency}</em></div>;
}

function Pipeline({ items, onOpen }: { items: EventItem[]; onOpen: (item: EventItem) => void }) {
  const [stageFilter, setStageFilter] = useState<Stage | "Todos">("Todos");
  const visible = stageFilter === "Todos" ? items : items.filter((item) => item.stage === stageFilter);
  const total = Math.max(items.length, 1);

  return <div className="pipeline-workspace">
    <section className="stage-summary-grid" aria-label="Resumo da esteira">
      {stages.map((stage, index) => {
        const stageItems = items.filter((item) => item.stage === stage);
        const attention = stageItems.filter((item) => item.sla !== "Dentro" || item.priority === "Alta").length;
        const pct = Math.round((stageItems.length / total) * 100);
        return <button key={stage} className={`stage-summary-card ${stageFilter === stage ? "selected" : ""}`} onClick={() => setStageFilter(stage)}>
          <div className="stage-summary-head"><span>0{index + 1}</span>{attention > 0 && <em>{attention} atenção</em>}</div>
          <strong>{stageItems.length}</strong>
          <b>{stage}</b>
          <small>{pct}% da fila exibida</small>
          <div className="stage-summary-track"><i style={{ width: `${Math.max(5, pct)}%` }} /></div>
        </button>;
      })}
    </section>

    <article className="panel pipeline-list-panel">
      <PanelHeader label="FILA DA ESTEIRA" title={stageFilter === "Todos" ? "Todos os eventos" : `Etapa: ${stageFilter}`} aside={<button className="filter-reset" onClick={() => setStageFilter("Todos")}><RefreshCw />Ver todos <span>{items.length}</span></button>} />
      <div className="pipeline-list-head"><span>Evento / associado</span><span>Tipo</span><span>Etapa</span><span>SLA</span><span>Responsável</span><span>Valor</span><span>Atualização</span><span /></div>
      <div className="pipeline-list-body">
        {visible.map((item) => <button className="pipeline-list-row" key={item.id} onClick={() => onOpen(item)}>
          <span className="event-person"><i className={`priority-dot ${item.priority === "Alta" ? "high" : ""}`} /><span><b>{item.id} · {item.member}</b><small>{item.vehicle} · {item.plate}</small></span></span>
          <span>{item.type}</span>
          <span><StatusBadge value={item.stage} /></span>
          <span><SlaBadge value={item.sla} /></span>
          <span>{item.owner}</span>
          <span className="mono-value">{money(item.value)}</span>
          <span className="muted-cell">{item.updated}</span>
          <ChevronRight />
        </button>)}
        {!visible.length && <div className="pipeline-list-empty">Nenhum evento nesta etapa.</div>}
      </div>
    </article>
  </div>;
}

function Associates({ items, onNew }: { items: AssociateItem[]; onNew: () => void }) {
  const active = items.filter((item) => item.status === "Ativo").length;
  const pending = items.filter((item) => item.status === "Pendente").length;
  const live = items.filter((item) => item.updated === "agora").length;

  return <>
    <div className="associate-stats">
      <MiniMetric label="BASE TOTAL" value={items.length} meta="associados localizados" />
      <MiniMetric label="ATIVOS" value={active} meta="cadastros regulares" />
      <MiniMetric label="PENDENTES" value={pending} meta="pedem conferência" tone={pending ? "warn" : undefined} />
      <MiniMetric label="ATUALIZAÇÃO AO VIVO" value={live || 1} meta="mudanças nesta sessão" live />
    </div>

    <article className="panel table-panel associates-panel">
      <PanelHeader label="BASE OPERACIONAL" title="Cadastro de associados" aside={<div className="associate-header-actions"><span className="live-chip"><span className="status-led" />SINCRONIZADO</span><button className="text-button" onClick={onNew}><UserPlus />Cadastrar associado</button></div>} />
      <div className="associate-table">
        <div className="associate-head"><span>Associado</span><span>Contato</span><span>Veículo</span><span>Localidade</span><span>Status</span><span>Atualização</span><span /></div>
        {items.map((item) => <div className={`associate-row ${item.updated === "agora" ? "live-row" : ""}`} key={item.id}>
          <span className="member-name"><i>{item.name.split(" ").map((name) => name[0]).slice(0, 2).join("")}</i><span><b>{item.name}</b><small>{item.id} · {item.cpf}</small></span></span>
          <span><b>{item.phone}</b><small>{item.email}</small></span>
          <span><b>{item.vehicle}</b><small>{item.plate}</small></span>
          <span>{item.city}</span>
          <span className={`associate-status ${item.status === "Ativo" ? "active" : "pending"}`}><i />{item.status}</span>
          <span className="live-updated">{item.updated === "agora" && <i />}{item.updated}</span>
          <button className="icon-button" aria-label="Abrir associado"><ChevronRight /></button>
        </div>)}
      </div>
    </article>
  </>;
}

function MiniMetric({ label, value, meta, tone, live }: { label: string; value: number; meta: string; tone?: "warn"; live?: boolean }) {
  return <article className={`mini-metric ${tone || ""}`}><div><small>{label}</small>{live && <span className="status-led" />}</div><strong>{String(value).padStart(2, "0")}</strong><p>{meta}</p></article>;
}

function Providers() {
  const providers = [
    ["Auto Prime", "Funilaria e pintura", "Goiânia / GO", "4,9", "12", "96%"],
    ["Glass Pro", "Vidros automotivos", "Aparecida / GO", "4,8", "8", "94%"],
    ["Reboque 24h", "Assistência e remoção", "Goiânia / GO", "4,7", "16", "91%"],
    ["Prime Motors", "Mecânica geral", "Trindade / GO", "4,8", "6", "95%"],
  ];
  return <div className="provider-list">{providers.map((provider) => <article className="panel provider-row" key={provider[0]}>
    <div className="provider-icon"><Building2 /></div><div className="provider-main"><small>PRESTADOR CREDENCIADO</small><h3>{provider[0]}</h3><p>{provider[1]} · {provider[2]}</p></div>
    <div className="provider-stat"><span>NOTA</span><b>{provider[3]}</b></div><div className="provider-stat"><span>EM EXECUÇÃO</span><b>{provider[4]}</b></div><div className="provider-stat"><span>SLA</span><b>{provider[5]}</b></div><button className="icon-button"><MoreHorizontal /></button>
  </article>)}</div>;
}

function Documents({ items }: { items: EventItem[] }) {
  const docs = items.flatMap((item) => item.docs.map((name) => ({ event: item.id, member: item.member, name, updated: item.updated })));
  return <article className="panel table-panel"><PanelHeader label="ARQUIVOS DA OPERAÇÃO" title="Documentos recebidos" aside={<span className="count-chip">{docs.length} arquivos</span>} />
    <div className="document-list">{docs.map((doc, index) => <div className="document-row" key={`${doc.event}-${index}`}><span className="file-icon"><FileText /></span><div><b>{doc.name}</b><small>{doc.event} · {doc.member}</small></div><span className="validation"><CheckCircle2 />Validado</span><em>{doc.updated}</em><button className="icon-button"><MoreHorizontal /></button></div>)}</div>
  </article>;
}

function Automations() {
  const automations = [
    ["Evento criado", "Enviar confirmação ao associado e criar tarefas internas.", "Ativa", "1.284 execuções"],
    ["Documento pendente", "Cobrar automaticamente após 24 horas sem envio.", "Ativa", "426 execuções"],
    ["SLA em risco", "Alertar gestor e responsável pelo evento.", "Ativa", "89 execuções"],
    ["Evento concluído", "Enviar pesquisa NPS e arquivar documentação.", "Pausada", "1.018 execuções"],
  ];
  return <div className="automation-list">{automations.map((automation) => <article className="panel automation-row" key={automation[0]}>
    <span className="automation-icon"><Zap /></span><div className="automation-main"><div><h3>{automation[0]}</h3><span className={`automation-state ${automation[2] === "Ativa" ? "active" : ""}`}>{automation[2]}</span></div><p>{automation[1]}</p></div><div className="automation-meta"><small>HISTÓRICO</small><b>{automation[3]}</b></div><button className="secondary-button">Editar fluxo <ArrowRight /></button>
  </article>)}</div>;
}

function AgentView({ items, command, onCommandConsumed, onSetStage, onNewAssociate, onNewEvent, notify }: { items: EventItem[]; command: string | null; onCommandConsumed: () => void; onSetStage: (id: string, stage: Stage) => boolean; onNewAssociate: () => void; onNewEvent: () => void; notify: (message: string) => void }) {
  const [messages, setMessages] = useState<AgentMessage[]>([
    { id: uid(), role: "agent", text: "Estou conectado à operação. Posso consultar a fila, cobrar documentos, revisar SLAs, gerar resumos e atualizar etapas por comando.", meta: "Assistente conectado" },
  ]);
  const [executions, setExecutions] = useState<string[]>(["Sincronização da operação verificada", "18 automações disponíveis", "Base operacional carregada"]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (!command) return;
    void execute(command);
    onCommandConsumed();
    // external commands are intentionally consumed once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command]);

  async function triggerAutomation(event: string, payload: Record<string, unknown> = {}) {
    try {
      await fetch("/api/webhooks/n8n", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, ...payload }) });
    } catch { /* demo remains interactive without backend */ }
  }

  async function execute(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    setMessages((value) => [...value, { id: uid(), role: "user", text }]);
    setInput("");
    setBusy(true);

    const lower = text.toLowerCase();
    const normalized = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const eventMatch = text.match(/EV-\d+/i);
    const requestedStage = stages.find((stage) => normalized.includes(stage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
    let response = "Entendi. Posso executar isso pela operação conectada. Me dê o evento ou a ação específica que você quer resolver.";
    let meta = "Consulta concluída";

    if (lower.includes("cadastrar") && lower.includes("associad")) {
      response = "Vou abrir o cadastro de associado. Assim que você salvar, o novo registro aparece imediatamente na base sem recarregar a página.";
      meta = "Ação preparada agora";
      onNewAssociate();
      setExecutions((value) => ["Cadastro de associado iniciado", ...value].slice(0, 6));
    } else if ((lower.includes("abrir") || lower.includes("criar")) && lower.includes("evento")) {
      response = "Abrindo um novo evento operacional. O registro entra automaticamente em Entrada e passa a contar nos indicadores da esteira.";
      meta = "Ação preparada agora";
      onNewEvent();
      setExecutions((value) => ["Abertura de evento iniciada", ...value].slice(0, 6));
    } else if (eventMatch && requestedStage) {
      const found = onSetStage(eventMatch[0], requestedStage);
      response = found ? `${eventMatch[0].toUpperCase()} foi atualizado para ${requestedStage}. A esteira e os quantitativos já refletem a mudança.` : `Não encontrei ${eventMatch[0].toUpperCase()} na base atual.`;
      meta = found ? "Alteração executada agora" : "Evento não localizado";
      if (found) {
        await triggerAutomation("event-stage-updated", { id: eventMatch[0].toUpperCase(), stage: requestedStage });
        setExecutions((value) => [`${eventMatch[0].toUpperCase()} → ${requestedStage}`, ...value].slice(0, 6));
      }
    } else if (lower.includes("document")) {
      const pending = items.filter((item) => item.stage !== "Concluído" && item.docs.length === 0);
      await triggerAutomation("document-reminder-bulk", { events: pending.map((item) => item.id) });
      response = pending.length ? `Encontrei ${pending.length} evento(s) sem documentos: ${pending.map((item) => item.id).join(", ")}. A cobrança automática foi enviada para a fila de WhatsApp e registrada na automação.` : "Não há eventos ativos sem documentos na base atual.";
      meta = pending.length ? `${pending.length} cobrança(s) encaminhada(s)` : "Nenhuma pendência encontrada";
      setExecutions((value) => [`Cobrança de documentos · ${pending.length} itens`, ...value].slice(0, 6));
      notify("Rotina de cobrança de documentos executada.");
    } else if (lower.includes("sla") || lower.includes("crític") || lower.includes("critico")) {
      const critical = items.filter((item) => item.stage !== "Concluído" && (item.sla !== "Dentro" || item.priority === "Alta"));
      response = critical.length ? `Há ${critical.length} evento(s) que merecem atenção. Prioridade imediata: ${critical.slice(0, 4).map((item) => `${item.id} (${item.sla}, ${item.owner})`).join(" · ")}. Posso atualizar uma etapa ou disparar alertas pelo ID.` : "Todos os eventos ativos estão dentro do padrão definido.";
      meta = "Risco operacional revisado";
      setExecutions((value) => [`Revisão de SLA · ${critical.length} itens`, ...value].slice(0, 6));
    } else if (lower.includes("relat") || lower.includes("resum")) {
      const active = items.filter((item) => item.stage !== "Concluído");
      const value = active.reduce((sum, item) => sum + item.value, 0);
      const late = active.filter((item) => item.sla === "Atrasado").length;
      response = `Resumo gerado: ${active.length} eventos ativos, ${items.filter((item) => item.stage === "Concluído").length} concluídos, ${money(value)} sob gestão e ${late} SLA(s) atrasado(s). A fila com maior volume pode ser consultada pelos cards da Esteira.`;
      meta = "Relatório operacional gerado agora";
      await triggerAutomation("daily-report-generated", { active: active.length, late, managedValue: value });
      setExecutions((value) => ["Relatório operacional gerado", ...value].slice(0, 6));
    } else if (lower.includes("tri") || lower.includes("entrada")) {
      const intake = items.filter((item) => item.stage === "Entrada");
      const incomplete = intake.filter((item) => item.docs.length === 0);
      response = `Triagem concluída na fila de Entrada: ${intake.length} evento(s). ${incomplete.length} ainda precisam de documentação antes de avançar. Posso cobrar esses documentos agora.`;
      meta = "Triagem concluída";
      setExecutions((value) => [`Triagem de Entrada · ${intake.length} itens`, ...value].slice(0, 6));
    }

    await new Promise((resolve) => window.setTimeout(resolve, 260));
    setMessages((value) => [...value, { id: uid(), role: "agent", text: response, meta }]);
    setBusy(false);
  }

  const suggestions = [
    "Cobrar documentos pendentes agora",
    "Revisar SLAs críticos",
    "Gerar relatório diário da operação",
    "Mover EV-2841 para Vistoria",
  ];

  return <div className="agent-layout">
    <article className="panel agent-console">
      <div className="agent-console-head">
        <div className="agent-identity"><span className="agent-avatar"><MessageSquare /></span><div><small>CONSOLE OPERACIONAL</small><h3>Assistente Operacional</h3><p><span className="status-led" /> conectado ao painel e às automações</p></div></div>
        <span className="agent-capability"><Activity />EXECUTA AÇÕES</span>
      </div>

      <div className="agent-messages">
        {messages.map((message) => <div className={`agent-message ${message.role}`} key={message.id}>
          {message.role === "agent" && <span className="message-avatar"><MessageSquare /></span>}
          <div><p>{message.text}</p>{message.meta && <small><CheckCircle2 />{message.meta}</small>}</div>
        </div>)}
        {busy && <div className="agent-thinking"><span /><span /><span /> executando</div>}
        <div ref={endRef} />
      </div>

      <div className="agent-suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => void execute(suggestion)}>{suggestion}</button>)}</div>
      <form className="agent-input" onSubmit={(event) => { event.preventDefault(); void execute(input); }}>
        <MessageSquare /><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ex.: mover EV-2841 para Vistoria ou cobrar documentos pendentes" /><button type="submit" disabled={busy || !input.trim()}><Send /></button>
      </form>
    </article>

    <aside className="agent-side">
      <article className="panel agent-actions-panel">
        <PanelHeader label="O QUE ELE RESOLVE" title="Ações por comando" aside={<Zap />} />
        <button onClick={onNewAssociate}><UserPlus /><span><b>Cadastrar associado</b><small>Inclui na base e atualiza a tela</small></span><ChevronRight /></button>
        <button onClick={() => void execute("Cobrar documentos pendentes agora")}><ClipboardCheck /><span><b>Cobrar pendências</b><small>Aciona rotina de comunicação</small></span><ChevronRight /></button>
        <button onClick={() => void execute("Revisar SLAs críticos")}><Clock3 /><span><b>Revisar SLA</b><small>Encontra riscos e prioridades</small></span><ChevronRight /></button>
        <button onClick={() => void execute("Gerar relatório diário da operação")}><ReceiptText /><span><b>Gerar resumo</b><small>Consolida a operação instantaneamente</small></span><ChevronRight /></button>
      </article>

      <article className="panel execution-panel">
        <PanelHeader label="EXECUÇÕES" title="Atividade recente" aside={<span className="live-chip"><span className="status-led" />LIVE</span>} />
        <div className="execution-list">{executions.map((execution, index) => <div key={`${execution}-${index}`}><span><Check /></span><div><b>{execution}</b><small>{index === 0 ? "agora" : `${index * 2 + 1} min atrás`}</small></div></div>)}</div>
      </article>
    </aside>
  </div>;
}

function NewEvent({ onClose, onCreate }: { onClose: () => void; onCreate: (form: FormData) => void }) {
  return <div className="overlay"><form className="modal" action={onCreate}>
    <div className="modal-head"><div><small>NOVO ATENDIMENTO</small><h2>Abrir evento operacional</h2><p>Cadastre os dados essenciais para iniciar a esteira.</p></div><button type="button" className="icon-button" onClick={onClose}><X /></button></div>
    <div className="form-grid">
      <label>Nome do associado<input required name="member" placeholder="Nome completo" /></label>
      <label>WhatsApp<input required name="phone" placeholder="(00) 00000-0000" /></label>
      <label>Veículo<input required name="vehicle" placeholder="Marca, modelo e ano" /></label>
      <label>Placa<input required name="plate" placeholder="ABC-1D23" /></label>
      <label>Localidade<input name="city" defaultValue="Goiânia / GO" /></label>
      <label>Valor estimado<input name="value" type="number" min="0" placeholder="0" /></label>
      <label>Tipo<select name="type"><option>Colisão</option><option>Roubo/Furto</option><option>Assistência</option><option>Vidros</option></select></label>
      <label>Responsável<select name="owner"><option>Camila</option><option>Leandro</option><option>André</option></select></label>
      <label>Prioridade<select name="priority"><option>Normal</option><option>Alta</option></select></label>
    </div>
    <footer><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button className="primary-button" type="submit"><Plus />Criar evento</button></footer>
  </form></div>;
}

function NewAssociate({ onClose, onCreate }: { onClose: () => void; onCreate: (form: FormData) => void }) {
  return <div className="overlay"><form className="modal associate-modal" action={onCreate}>
    <div className="modal-head"><div><small>NOVO ASSOCIADO</small><h2>Cadastrar associado</h2><p>O registro entra na base imediatamente após salvar.</p></div><button type="button" className="icon-button" onClick={onClose}><X /></button></div>
    <div className="form-grid">
      <label>Nome completo<input required name="name" placeholder="Nome do associado" /></label>
      <label>CPF<input name="cpf" placeholder="000.000.000-00" /></label>
      <label>WhatsApp<input required name="phone" placeholder="(00) 00000-0000" /></label>
      <label>E-mail<input name="email" type="email" placeholder="nome@email.com" /></label>
      <label>Veículo<input name="vehicle" placeholder="Marca, modelo e ano" /></label>
      <label>Placa<input name="plate" placeholder="ABC-1D23" /></label>
      <label>Localidade<input name="city" defaultValue="Goiânia / GO" /></label>
      <label>Status<select name="status"><option>Ativo</option><option>Pendente</option></select></label>
    </div>
    <footer><span className="modal-live-note"><span className="status-led" />Atualização instantânea</span><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button className="primary-button" type="submit"><UserPlus />Cadastrar associado</button></footer>
  </form></div>;
}

function Detail({ item, onClose, onMove, onFiles }: { item: EventItem; onClose: () => void; onMove: (direction: number) => void; onFiles: (files: FileList | null) => void }) {
  const index = stages.indexOf(item.stage);
  return <div className="drawer-layer"><aside className="detail-drawer">
    <div className="drawer-head"><div><small>EVENTO {item.id}</small><h2>{item.member}</h2><p>{item.vehicle} · {item.plate}</p></div><button className="icon-button" onClick={onClose}><X /></button></div>
    <div className="detail-summary"><div><span>Tipo</span><b>{item.type}</b></div><div><span>SLA</span><SlaBadge value={item.sla} /></div><div><span>Responsável</span><b>{item.owner}</b></div><div><span>Valor</span><b>{money(item.value)}</b></div></div>

    <section className="drawer-section"><div className="drawer-section-title"><div><small>FLUXO</small><h3>Progresso do evento</h3></div><StatusBadge value={item.stage} /></div>
      <div className="stepper">{stages.map((stage, stageIndex) => <div key={stage} className={stageIndex < index ? "done" : stageIndex === index ? "current" : ""}><i>{stageIndex < index ? <Check /> : stageIndex + 1}</i><span>{stage}</span>{stageIndex === index && <em>etapa atual</em>}</div>)}</div>
      <div className="detail-actions"><button className="secondary-button" disabled={index === 0} onClick={() => onMove(-1)}><ArrowLeft />Voltar</button><button className="primary-button" disabled={index === stages.length - 1} onClick={() => onMove(1)}>Avançar etapa<ArrowRight /></button></div>
    </section>

    <section className="drawer-section files"><div className="drawer-section-title"><div><small>DOCUMENTAÇÃO</small><h3>Arquivos do evento</h3></div><label className="secondary-button"><Upload />Anexar<input type="file" multiple onChange={(event) => onFiles(event.target.files)} /></label></div>
      {item.docs.length ? item.docs.map((doc, docIndex) => <div className="drawer-file" key={docIndex}><span className="file-icon"><FileText /></span><span>{doc}</span><em><CheckCircle2 />Recebido</em></div>) : <div className="empty-state">Nenhum documento anexado.</div>}
    </section>
  </aside></div>;
}
