"use client";

import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleGauge,
  Clock3,
  Command,
  Download,
  FileCheck2,
  FileText,
  Filter,
  FolderCheck,
  Gauge,
  History,
  Inbox,
  Link2,
  ListFilter,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Network,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  TimerReset,
  Upload,
  UserPlus,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";

type Stage = "Entrada" | "Documentos" | "Análise" | "Vistoria" | "Aprovação" | "Reparo" | "Concluído";
type Sla = "Dentro" | "Risco" | "Atrasado";
type Priority = "Alta" | "Normal";
type AssociateStatus = "Ativo" | "Pendente" | "Bloqueado";
type View = "Dashboard" | "Esteira" | "Associados" | "Rede" | "Documentos" | "Automações" | "Agente IA";

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
  live?: boolean;
};

type Provider = {
  name: string;
  category: string;
  city: string;
  rating: number;
  open: number;
  sla: string;
  capacity: number;
};

type AgentMessage = {
  id: string;
  role: "agent" | "user";
  text: string;
  meta?: string;
};

const stages: Stage[] = ["Entrada", "Documentos", "Análise", "Vistoria", "Aprovação", "Reparo", "Concluído"];
const EVENT_STORAGE = "veloce-final-events";
const ASSOCIATE_STORAGE = "veloce-final-associates";

const seedEvents: EventItem[] = [
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
  { id: "EV-2772", member: "Marcelo Tavares", phone: "(62) 99620-5531", vehicle: "BYD Song Plus 2025", plate: "SNL-2A47", type: "Colisão", stage: "Análise", owner: "Camila", priority: "Normal", created: "17/08/2026", updated: "há 5 h", docs: ["CNH.pdf", "Fotos.zip"], value: 27100, city: "Goiânia / GO", sla: "Dentro" },
  { id: "EV-2764", member: "Juliana Borges", phone: "(62) 99451-9020", vehicle: "Caoa Tiggo 7 2024", plate: "RHT-5G13", type: "Assistência", stage: "Entrada", owner: "André", priority: "Normal", created: "16/08/2026", updated: "há 5 h", docs: [], value: 2400, city: "Aparecida / GO", sla: "Risco" },
  { id: "EV-2758", member: "Tiago Azevedo", phone: "(62) 98224-3099", vehicle: "VW Taos 2023", plate: "QFP-9D62", type: "Vidros", stage: "Documentos", owner: "Leandro", priority: "Normal", created: "15/08/2026", updated: "há 6 h", docs: ["CNH.pdf"], value: 6100, city: "Goiânia / GO", sla: "Dentro" },
];

const baseAssociateId = 1246;
const seedAssociates: AssociateItem[] = seedEvents.map((item, index) => ({
  id: `AS-${baseAssociateId - index}`,
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

const providers: Provider[] = [
  { name: "Prime Auto Center", category: "Funilaria e pintura", city: "Goiânia / GO", rating: 4.9, open: 4, sla: "1,8 dia", capacity: 78 },
  { name: "Vistoria Atlas", category: "Vistoria técnica", city: "Goiânia / GO", rating: 4.8, open: 7, sla: "3,2 h", capacity: 64 },
  { name: "Glass One", category: "Vidros automotivos", city: "Aparecida / GO", rating: 4.7, open: 3, sla: "5,4 h", capacity: 48 },
  { name: "Mecânica Norte", category: "Mecânica geral", city: "Goiânia / GO", rating: 4.9, open: 5, sla: "1,2 dia", capacity: 71 },
  { name: "Auto Rescue 24h", category: "Assistência", city: "Região metropolitana", rating: 4.8, open: 2, sla: "28 min", capacity: 39 },
];

const navItems: View[] = ["Dashboard", "Esteira", "Associados", "Rede", "Documentos", "Automações", "Agente IA"];

const viewDescriptions: Record<View, string> = {
  Dashboard: "Uma visão única para decidir, executar e acompanhar o que normalmente exigiria várias pessoas e ferramentas.",
  Esteira: "Volume primeiro. Detalhe depois. Os quantitativos ficam visíveis e a fila continua legível mesmo com centenas de eventos.",
  Associados: "Cadastro, atualização e consulta no mesmo fluxo, com a base refletindo alterações no instante em que elas acontecem.",
  Rede: "Prestadores, capacidade e SLA organizados para facilitar escolha, distribuição e acompanhamento.",
  Documentos: "Recebimento, validação, pendências e histórico sem depender de conferência manual em várias telas.",
  Automações: "Rotinas repetitivas transformadas em ações previsíveis, auditáveis e executáveis pelo painel.",
  "Agente IA": "Peça em linguagem natural. O agente consulta o contexto, executa a ação e devolve o resultado na mesma tela.",
};

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
const uid = () => Math.random().toString(36).slice(2, 9);

export default function Home() {
  const [view, setView] = useState<View>("Dashboard");
  const [events, setEvents] = useState<EventItem[]>(seedEvents);
  const [associates, setAssociates] = useState<AssociateItem[]>(seedAssociates);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "Todos">("Todos");
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [eventModal, setEventModal] = useState(false);
  const [associateModal, setAssociateModal] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentSeed, setAgentSeed] = useState<string | undefined>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem(EVENT_STORAGE);
    const storedAssociates = localStorage.getItem(ASSOCIATE_STORAGE);
    if (storedEvents) {
      try { setEvents(JSON.parse(storedEvents)); } catch { /* ignore */ }
    }
    if (storedAssociates) {
      try { setAssociates(JSON.parse(storedAssociates)); } catch { /* ignore */ }
    }
    navigator.serviceWorker?.register("/sw.js").catch(() => undefined);
  }, []);

  useEffect(() => { localStorage.setItem(EVENT_STORAGE, JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem(ASSOCIATE_STORAGE, JSON.stringify(associates)); }, [associates]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setSelected(null);
        setEventModal(false);
        setAssociateModal(false);
        setAgentOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return events.filter((item) => {
      const byStage = stageFilter === "Todos" || item.stage === stageFilter;
      const haystack = `${item.id} ${item.member} ${item.vehicle} ${item.plate} ${item.type} ${item.owner} ${item.city}`.toLowerCase();
      return byStage && (!normalized || haystack.includes(normalized));
    });
  }, [events, query, stageFilter]);

  const filteredAssociates = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return associates.filter((item) => !normalized || `${item.id} ${item.name} ${item.phone} ${item.email} ${item.vehicle} ${item.plate} ${item.city}`.toLowerCase().includes(normalized));
  }, [associates, query]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }

  function createEvent(form: FormData) {
    const current = Math.max(...events.map((item) => Number(item.id.replace("EV-", ""))), 2841) + 1;
    const item: EventItem = {
      id: `EV-${current}`,
      member: String(form.get("member") || "Novo associado"),
      phone: String(form.get("phone") || ""),
      vehicle: String(form.get("vehicle") || "Veículo não informado"),
      plate: String(form.get("plate") || "---").toUpperCase(),
      type: String(form.get("type") || "Colisão"),
      stage: "Entrada",
      owner: String(form.get("owner") || "Camila"),
      priority: String(form.get("priority") || "Normal") as Priority,
      created: "28/08/2026",
      updated: "agora",
      docs: [],
      value: Number(form.get("value") || 0),
      city: String(form.get("city") || "Goiânia / GO"),
      sla: "Dentro",
    };
    setEvents((value) => [item, ...value]);
    setEventModal(false);
    setStageFilter("Todos");
    notify(`${item.id} entrou na esteira e os quantitativos foram atualizados.`);
  }

  function createAssociate(form: FormData) {
    const id = Math.max(...associates.map((item) => Number(item.id.replace("AS-", ""))), baseAssociateId) + 1;
    const item: AssociateItem = {
      id: `AS-${id}`,
      name: String(form.get("name") || "Novo associado"),
      cpf: String(form.get("cpf") || "***.***.***-**"),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      vehicle: String(form.get("vehicle") || "Veículo não informado"),
      plate: String(form.get("plate") || "---").toUpperCase(),
      city: String(form.get("city") || "Goiânia / GO"),
      status: String(form.get("status") || "Ativo") as AssociateStatus,
      joined: "28/08/2026",
      updated: "agora",
      live: true,
    };
    setAssociates((value) => [item, ...value.map((existing) => ({ ...existing, live: false }))]);
    setAssociateModal(false);
    setView("Associados");
    notify(`${item.name} foi cadastrado e já está disponível na operação.`);
  }

  function setEventStage(id: string, stage: Stage) {
    const exists = events.some((item) => item.id.toLowerCase() === id.toLowerCase());
    if (!exists) return false;
    setEvents((value) => value.map((item) => item.id.toLowerCase() === id.toLowerCase() ? { ...item, stage, updated: "agora" } : item));
    setSelected((item) => item && item.id.toLowerCase() === id.toLowerCase() ? { ...item, stage, updated: "agora" } : item);
    notify(`${id.toUpperCase()} movido para ${stage}.`);
    return true;
  }

  function moveEvent(id: string, direction: number) {
    const item = events.find((event) => event.id === id);
    if (!item) return;
    const nextIndex = Math.max(0, Math.min(stages.length - 1, stages.indexOf(item.stage) + direction));
    setEventStage(id, stages[nextIndex]);
  }

  function addFiles(id: string, files: FileList | null) {
    if (!files?.length) return;
    const names = [...files].map((file) => file.name);
    setEvents((value) => value.map((item) => item.id === id ? { ...item, docs: [...item.docs, ...names], updated: "agora" } : item));
    setSelected((item) => item?.id === id ? { ...item, docs: [...item.docs, ...names], updated: "agora" } : item);
    notify(`${names.length} arquivo(s) anexado(s) ao ${id}.`);
  }

  function openAgent(seed?: string) {
    setAgentSeed(seed);
    setAgentOpen(true);
  }

  function go(viewName: View) {
    setView(viewName);
    setMenuOpen(false);
    setQuery("");
    if (viewName !== "Esteira") setStageFilter("Todos");
  }

  return (
    <main className="app-stage">
      <section className="product-shell">
        <div className="ambient-light ambient-one" />
        <div className="ambient-light ambient-two" />

        <header className="topbar">
          <button className="brand" onClick={() => go("Dashboard")} aria-label="Veloce início">
            <VeloceMark />
            <span>Veloce</span>
          </button>

          <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
            {navItems.map((item) => (
              <button key={item} className={view === item ? "active" : ""} onClick={() => go(item)}>{item}</button>
            ))}
          </nav>

          <div className="top-actions">
            <button className="top-settings"><Settings /><span>Configurações</span></button>
            <button className="round-icon notification" aria-label="Notificações"><Bell /><i /></button>
            <button className="round-icon search-trigger" aria-label="Buscar" onClick={() => searchRef.current?.focus()}><Search /></button>
            <button className="mobile-menu" aria-label="Abrir menu" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </header>

        <section className="workspace">
          <WorkspaceHeader
            view={view}
            events={events}
            associates={associates}
            query={query}
            onQuery={setQuery}
            searchRef={searchRef}
            onNewEvent={() => setEventModal(true)}
            onNewAssociate={() => setAssociateModal(true)}
            onAgent={() => openAgent()}
          />

          {view === "Dashboard" && (
            <Dashboard
              events={events}
              associates={associates}
              onOpenEvent={setSelected}
              onPipeline={() => go("Esteira")}
              onAssociate={() => setAssociateModal(true)}
              onEvent={() => setEventModal(true)}
              onAgent={openAgent}
            />
          )}
          {view === "Esteira" && (
            <PipelineView
              events={filteredEvents}
              allEvents={events}
              stageFilter={stageFilter}
              onStageFilter={setStageFilter}
              onOpen={setSelected}
              onNew={() => setEventModal(true)}
            />
          )}
          {view === "Associados" && <AssociatesView associates={filteredAssociates} onNew={() => setAssociateModal(true)} />}
          {view === "Rede" && <ProvidersView />}
          {view === "Documentos" && <DocumentsView events={events} onOpen={setSelected} onAgent={openAgent} />}
          {view === "Automações" && <AutomationsView notify={notify} onAgent={openAgent} />}
          {view === "Agente IA" && (
            <AgentWorkspace
              events={events}
              associates={associates}
              initialCommand={agentSeed}
              onConsume={() => setAgentSeed(undefined)}
              onSetStage={setEventStage}
              onNewAssociate={() => setAssociateModal(true)}
              onNewEvent={() => setEventModal(true)}
              notify={notify}
            />
          )}
        </section>
      </section>

      <button className="agent-fab" onClick={() => openAgent()}><Command /><span>Falar com o agente</span><i /></button>

      {eventModal && <EventModal onClose={() => setEventModal(false)} onCreate={createEvent} />}
      {associateModal && <AssociateModal onClose={() => setAssociateModal(false)} onCreate={createAssociate} />}
      {selected && <EventDrawer item={selected} onClose={() => setSelected(null)} onMove={(direction) => moveEvent(selected.id, direction)} onFiles={(files) => addFiles(selected.id, files)} />}
      {agentOpen && view !== "Agente IA" && (
        <AgentDrawer
          events={events}
          associates={associates}
          initialCommand={agentSeed}
          onClose={() => { setAgentOpen(false); setAgentSeed(undefined); }}
          onSetStage={setEventStage}
          onNewAssociate={() => { setAgentOpen(false); setAssociateModal(true); }}
          onNewEvent={() => { setAgentOpen(false); setEventModal(true); }}
          onFull={() => { setAgentOpen(false); go("Agente IA"); }}
          notify={notify}
        />
      )}
      {toast && <div className="toast"><CheckCircle2 /><span>{toast}</span></div>}
    </main>
  );
}

function WorkspaceHeader({ view, events, associates, query, onQuery, searchRef, onNewEvent, onNewAssociate, onAgent }: {
  view: View;
  events: EventItem[];
  associates: AssociateItem[];
  query: string;
  onQuery: (value: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  onNewEvent: () => void;
  onNewAssociate: () => void;
  onAgent: () => void;
}) {
  const active = events.filter((item) => item.stage !== "Concluído");
  const inSla = active.filter((item) => item.sla === "Dentro").length;
  const sla = active.length ? Math.round((inSla / active.length) * 100) : 100;
  const critical = active.filter((item) => item.sla !== "Dentro" || item.priority === "Alta").length;
  const progress = Math.min(100, Math.round((events.filter((item) => item.stage === "Concluído").length / events.length) * 100));

  return (
    <div className="workspace-head">
      <div className="workspace-title">
        <div className="kicker"><span className="live-dot" /> CENTRAL OPERACIONAL <b>AO VIVO</b></div>
        <h1>{view === "Dashboard" ? "Bom dia, Débora." : view}</h1>
        <p>{viewDescriptions[view]}</p>
      </div>

      <div className="head-actions">
        <div className="global-search">
          <Search />
          <input ref={searchRef} value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Buscar associado, evento, placa..." />
          <kbd>⌘ K</kbd>
        </div>
        <button className="button button-ghost" onClick={onAgent}><Command />Agente IA</button>
        <button className="button button-dark" onClick={view === "Associados" ? onNewAssociate : onNewEvent}>{view === "Associados" ? <UserPlus /> : <Plus />}{view === "Associados" ? "Novo associado" : "Novo evento"}</button>
      </div>

      {view === "Dashboard" && (
        <div className="hero-status">
          <div className="flow-stat">
            <div className="flow-labels"><span>Entrada</span><span>Em execução</span><span>Concluídos</span></div>
            <div className="flow-bars">
              <div className="flow-pill dark">{events.filter((item) => item.stage === "Entrada").length}</div>
              <div className="flow-pill yellow">{active.length}</div>
              <div className="flow-line"><i style={{ width: `${Math.max(24, progress)}%` }} /></div>
              <div className="flow-pill outline">{events.filter((item) => item.stage === "Concluído").length}</div>
            </div>
          </div>

          <div className="headline-kpis">
            <HeadlineMetric label="Associados" value={String(associates.length + 1231)} icon={<Users />} />
            <HeadlineMetric label="Eventos ativos" value={String(active.length).padStart(2, "0")} icon={<CircleGauge />} />
            <HeadlineMetric label="SLA no prazo" value={`${sla}%`} icon={<TimerReset />} />
            <HeadlineMetric label="Atenção" value={String(critical).padStart(2, "0")} icon={<AlertCircle />} />
          </div>
        </div>
      )}
    </div>
  );
}

function HeadlineMetric({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return <div className="headline-metric"><span>{icon}{label}</span><strong>{value}</strong></div>;
}

function Dashboard({ events, associates, onOpenEvent, onPipeline, onAssociate, onEvent, onAgent }: {
  events: EventItem[];
  associates: AssociateItem[];
  onOpenEvent: (item: EventItem) => void;
  onPipeline: () => void;
  onAssociate: () => void;
  onEvent: () => void;
  onAgent: (seed?: string) => void;
}) {
  const active = events.filter((item) => item.stage !== "Concluído");
  const focus = active.find((item) => item.sla === "Atrasado") || active[0];
  const missingDocs = active.filter((item) => item.docs.length === 0).length;
  const risk = active.filter((item) => item.sla !== "Dentro").length;
  const completed = events.filter((item) => item.stage === "Concluído").length;
  const slaPct = active.length ? Math.round(active.filter((item) => item.sla === "Dentro").length / active.length * 100) : 100;
  const weekly = [42, 58, 38, 70, 84, 61, 76];
  const tasks = [
    { label: "Validar documentos recebidos", count: 12, action: "Validar documentos pendentes" },
    { label: "Cobrar documentação incompleta", count: missingDocs, action: "Cobrar documentos pendentes agora" },
    { label: "Revisar SLAs em risco", count: risk, action: "Revisar SLAs críticos" },
    { label: "Distribuir vistorias na rede", count: 6, action: "Distribuir vistorias aos prestadores" },
  ];
  const todayRows = active.slice(0, 5);

  return (
    <div className="dashboard-board">
      <article className="glass-card focus-card interactive-card" onClick={() => onOpenEvent(focus)}>
        <div className="card-topline">
          <span className="card-label">EVENTO EM FOCO</span>
          <button className="mini-round" aria-label="Abrir"><ArrowDownRight /></button>
        </div>
        <div className="focus-visual"><VehicleIllustration /></div>
        <div className="focus-copy">
          <div className="focus-badge"><span className={`sla-dot ${focus.sla.toLowerCase()}`} />{focus.sla === "Atrasado" ? "SLA atrasado" : `${focus.sla} do SLA`}</div>
          <h3>{focus.member}</h3>
          <p>{focus.vehicle} · {focus.plate}</p>
          <div className="focus-bottom"><span>{focus.id}</span><b>{focus.stage}</b><strong>{money(focus.value)}</strong></div>
        </div>
      </article>

      <article className="glass-card progress-card">
        <CardHeading label="RITMO DA OPERAÇÃO" title="Progresso semanal" action={<button className="mini-round"><ArrowDownRight /></button>} />
        <div className="progress-total"><strong>61,4</strong><span>h de trabalho poupado<br />nesta semana</span></div>
        <div className="week-bars">
          {weekly.map((value, index) => <div key={index} className="week-column"><div className="week-track"><i className={index === 4 ? "highlight" : ""} style={{ height: `${value}%` }} />{index === 4 && <em>12,8h</em>}</div><small>{["S", "T", "Q", "Q", "S", "S", "D"][index]}</small></div>)}
        </div>
      </article>

      <article className="glass-card sla-card">
        <CardHeading label="TEMPO DE RESPOSTA" title="SLA em tempo real" action={<button className="mini-round"><ArrowDownRight /></button>} />
        <div className="sla-ring" style={{ "--sla": `${slaPct * 3.6}deg` } as CSSProperties}>
          <div><strong>{slaPct}%</strong><span>no prazo</span></div>
        </div>
        <div className="sla-actions"><button onClick={() => onAgent("Revisar SLAs críticos")}><Command />Revisar riscos</button><span>{risk} precisam de atenção</span></div>
      </article>

      <article className="glass-card automation-card">
        <CardHeading label="FLUXO AUTOMÁTICO" title="Etapas em movimento" action={<span className="percent-badge">{Math.round((completed / events.length) * 100)}%</span>} />
        <div className="pipeline-mini-labels"><span>ENTRADA</span><span>EXECUÇÃO</span><span>SAÍDA</span></div>
        <div className="pipeline-mini"><i className="yellow" style={{ flex: 30 }} /><i className="dark" style={{ flex: 52 }} /><i className="muted" style={{ flex: 18 }} /></div>
        <div className="automation-dark">
          <div className="automation-dark-head"><span>Próximas ações</span><strong>4/7</strong></div>
          {[
            ["Cobrança documental", `${missingDocs} pendências`, true],
            ["Distribuição de vistorias", "6 eventos", true],
            ["Revisão de aprovação", "3 eventos", false],
            ["Atualizar associados", "sincronização", false],
          ].map(([label, meta, done]) => <button key={String(label)} className="automation-task" onClick={() => onAgent(String(label))}><span className={done ? "task-icon done" : "task-icon"}>{done ? <Check /> : <Link2 />}</span><div><b>{label}</b><small>{meta}</small></div><i className={done ? "task-state done" : "task-state"} /></button>)}
        </div>
      </article>

      <article className="glass-card work-card">
        <CardHeading label="TRABALHO OPERACIONAL, SIMPLIFICADO" title="O que normalmente daria trabalho hoje" action={<button className="text-button" onClick={onPipeline}>Ver operação <ArrowRight /></button>} />
        <div className="work-layout">
          <div className="work-timeline">
            <div className="timeline-head"><span>Hoje</span><strong>28 de agosto</strong><button><ChevronDown /></button></div>
            <div className="time-grid">
              {todayRows.map((item, index) => <button key={item.id} className={`timeline-event event-${index + 1}`} onClick={() => onOpenEvent(item)}><span>{item.updated.replace("há ", "")}</span><div><b>{item.member}</b><small>{item.stage} · {item.id}</small></div><OwnerStack owner={item.owner} /><i className={`sla-dot ${item.sla.toLowerCase()}`} /></button>)}
            </div>
          </div>
          <div className="work-queue">
            <div className="queue-head"><div><span>ROTINAS DE HOJE</span><strong>Resolver sem sair do painel</strong></div><button className="mini-round"><ListFilter /></button></div>
            {tasks.map((task) => <div className="work-action" key={task.label}><div className="work-action-icon"><FolderCheck /></div><div><b>{task.label}</b><small>{task.count} item(ns) aguardando</small></div><button onClick={() => onAgent(task.action)}>Resolver <ArrowRight /></button></div>)}
          </div>
        </div>
      </article>

      <article className="glass-card quick-card">
        <CardHeading label="AÇÕES RÁPIDAS" title="Comece em um clique" action={<span className="live-chip"><i />AO VIVO</span>} />
        <div className="quick-list">
          <QuickAction icon={<UserPlus />} title="Cadastrar associado" meta="Base atualiza na hora" onClick={onAssociate} />
          <QuickAction icon={<Plus />} title="Abrir novo evento" meta="Entra direto na esteira" onClick={onEvent} />
          <QuickAction icon={<FileCheck2 />} title="Cobrar documentos" meta={`${missingDocs} pendências`} onClick={() => onAgent("Cobrar documentos pendentes agora")} />
          <QuickAction icon={<Activity />} title="Gerar relatório" meta="Resumo operacional" onClick={() => onAgent("Gerar relatório diário da operação")} />
        </div>
      </article>

      <article className="glass-card agent-preview-card">
        <div className="agent-preview-head"><div className="command-mark"><Command /></div><div><span>AGENTE IA</span><h3>Peça. Ele executa.</h3></div><i className="live-dot" /></div>
        <p>Não é um chat decorativo. O agente usa o contexto do painel para consultar, atualizar e disparar rotinas.</p>
        <div className="agent-preview-example"><span>Você</span><p>“Mova o EV-2841 para Vistoria e atualize a fila.”</p></div>
        <div className="agent-preview-result"><CheckCircle2 /><div><b>Ação concluída</b><small>Esteira e quantitativos sincronizados.</small></div></div>
        <button className="agent-preview-button" onClick={() => onAgent()}>Abrir agente <ArrowRight /></button>
      </article>
    </div>
  );
}

function QuickAction({ icon, title, meta, onClick }: { icon: ReactNode; title: string; meta: string; onClick: () => void }) {
  return <button className="quick-action" onClick={onClick}><span>{icon}</span><div><b>{title}</b><small>{meta}</small></div><ArrowRight /></button>;
}

function PipelineView({ events, allEvents, stageFilter, onStageFilter, onOpen, onNew }: {
  events: EventItem[];
  allEvents: EventItem[];
  stageFilter: Stage | "Todos";
  onStageFilter: (stage: Stage | "Todos") => void;
  onOpen: (item: EventItem) => void;
  onNew: () => void;
}) {
  const activeTotal = allEvents.filter((item) => item.stage !== "Concluído").length;
  return (
    <div className="page-stack">
      <section className="stage-strip-wrap">
        <div className="section-heading-inline"><div><span className="card-label">VISÃO DE VOLUME</span><h2>Quantitativo por etapa</h2></div><div className="section-actions"><button className="button button-ghost"><Filter />Filtros</button><button className="button button-dark" onClick={onNew}><Plus />Novo evento</button></div></div>
        <div className="stage-strip">
          <button className={`stage-count-card total ${stageFilter === "Todos" ? "selected" : ""}`} onClick={() => onStageFilter("Todos")}><span>ATIVOS</span><strong>{activeTotal}</strong><small>fila completa</small><i /></button>
          {stages.map((stage, index) => {
            const stageItems = allEvents.filter((item) => item.stage === stage);
            const attention = stageItems.filter((item) => item.sla !== "Dentro").length;
            return <button className={`stage-count-card ${stageFilter === stage ? "selected" : ""}`} key={stage} onClick={() => onStageFilter(stage)}><span>{String(index + 1).padStart(2, "0")} · {stage.toUpperCase()}</span><strong>{stageItems.length}</strong><small>{attention ? `${attention} precisam de atenção` : "fluxo dentro do prazo"}</small><i style={{ width: `${Math.max(18, Math.min(100, stageItems.length * 16))}%` }} /></button>;
          })}
        </div>
      </section>

      <article className="glass-card data-card pipeline-table-card">
        <CardHeading label="FILA OPERACIONAL" title={stageFilter === "Todos" ? "Todos os eventos" : stageFilter} action={<div className="table-tools"><span>{events.length} registros</span><button className="mini-round"><SlidersHorizontal /></button><button className="mini-round"><Download /></button></div>} />
        <div className="data-table-wrap">
          <div className="data-table pipeline-table">
            <div className="data-row data-head"><span>Evento</span><span>Associado / veículo</span><span>Etapa</span><span>SLA</span><span>Responsável</span><span>Atualização</span><span /></div>
            {events.map((item) => <button className="data-row" key={item.id} onClick={() => onOpen(item)}><span className="mono-id">{item.id}</span><span className="entity-cell"><b>{item.member}</b><small>{item.vehicle} · {item.plate}</small></span><span><StageBadge stage={item.stage} /></span><span><SlaBadge sla={item.sla} /></span><span><Owner owner={item.owner} /></span><span className="muted-cell">{item.updated}</span><span className="row-arrow"><ChevronRight /></span></button>)}
            {!events.length && <div className="empty-table"><Inbox /><b>Nenhum evento neste filtro</b><span>Selecione outra etapa ou altere sua busca.</span></div>}
          </div>
        </div>
      </article>
    </div>
  );
}

function AssociatesView({ associates, onNew }: { associates: AssociateItem[]; onNew: () => void }) {
  const active = associates.filter((item) => item.status === "Ativo").length;
  const pending = associates.filter((item) => item.status === "Pendente").length;
  return <div className="page-stack">
    <div className="compact-metrics">
      <CompactMetric label="Base total" value={String(associates.length + 1231)} meta="associados" />
      <CompactMetric label="Ativos" value={String(active + 1190)} meta="cadastros regulares" />
      <CompactMetric label="Pendências" value={String(pending + 12)} meta="requerem revisão" tone="yellow" />
      <CompactMetric label="Atualizados hoje" value="38" meta="sincronizações" />
    </div>
    <article className="glass-card data-card">
      <CardHeading label="BASE DE ASSOCIADOS" title="Cadastro e relacionamento" action={<button className="button button-dark" onClick={onNew}><UserPlus />Novo associado</button>} />
      <div className="data-table-wrap">
        <div className="data-table associates-table">
          <div className="data-row data-head"><span>Associado</span><span>Contato</span><span>Veículo</span><span>Localidade</span><span>Status</span><span>Atualização</span><span /></div>
          {associates.map((item) => <div className={`data-row ${item.live ? "live-row" : ""}`} key={item.id}><span className="entity-cell"><b>{item.name}</b><small>{item.id} · {item.cpf}</small></span><span className="entity-cell"><b>{item.phone}</b><small>{item.email || "sem e-mail"}</small></span><span className="entity-cell"><b>{item.vehicle}</b><small>{item.plate}</small></span><span>{item.city}</span><span><AssociateBadge status={item.status} /></span><span className="muted-cell">{item.updated}{item.live && <em>AGORA</em>}</span><span className="row-arrow"><MoreHorizontal /></span></div>)}
        </div>
      </div>
    </article>
  </div>;
}

function ProvidersView() {
  return <div className="page-stack">
    <div className="provider-overview">
      <article className="network-map-card glass-card">
        <div className="network-copy"><span className="card-label">REDE CREDENCIADA</span><h2>Capacidade disponível, sem planilha.</h2><p>Escolha prestadores olhando simultaneamente SLA, ocupação e localização.</p><div className="network-kpis"><div><strong>42</strong><span>prestadores ativos</span></div><div><strong>8,4h</strong><span>tempo médio de aceite</span></div><div><strong>4,8</strong><span>avaliação média</span></div></div></div>
        <NetworkGraphic />
      </article>
      <article className="glass-card capacity-card"><CardHeading label="CAPACIDADE AGORA" title="Disponibilidade" action={<Gauge />} /><div className="capacity-ring"><div><strong>68%</strong><span>rede disponível</span></div></div><p>12 prestadores conseguem receber novos eventos ainda hoje.</p><button className="button button-dark">Distribuir eventos <ArrowRight /></button></article>
    </div>
    <article className="glass-card data-card"><CardHeading label="PRESTADORES" title="Rede operacional" action={<button className="button button-ghost"><Filter />Filtrar rede</button>} /><div className="provider-list">{providers.map((provider) => <div className="provider-row" key={provider.name}><span className="provider-monogram">{provider.name.split(" ").map((piece) => piece[0]).slice(0, 2).join("")}</span><div className="entity-cell"><b>{provider.name}</b><small>{provider.category} · {provider.city}</small></div><div className="provider-data"><span>NOTA</span><b>{provider.rating.toFixed(1)}</b></div><div className="provider-data"><span>EM ABERTO</span><b>{provider.open}</b></div><div className="provider-data"><span>SLA MÉDIO</span><b>{provider.sla}</b></div><div className="capacity-bar"><span style={{ width: `${provider.capacity}%` }} /></div><button className="mini-round"><ChevronRight /></button></div>)}</div></article>
  </div>;
}

function DocumentsView({ events, onOpen, onAgent }: { events: EventItem[]; onOpen: (item: EventItem) => void; onAgent: (seed?: string) => void }) {
  const missing = events.filter((item) => item.docs.length === 0);
  const oneDoc = events.filter((item) => item.docs.length === 1);
  const received = events.reduce((sum, item) => sum + item.docs.length, 0);
  return <div className="page-stack">
    <div className="compact-metrics">
      <CompactMetric label="Arquivos recebidos" value={String(received + 184)} meta="últimos 30 dias" />
      <CompactMetric label="Pendências" value={String(missing.length)} meta="sem documento" tone="yellow" />
      <CompactMetric label="Validação" value={String(oneDoc.length + 3)} meta="aguardando conferência" />
      <CompactMetric label="Conformidade" value="96%" meta="documentos aprovados" />
    </div>
    <article className="glass-card document-control-card">
      <div className="document-control-copy"><span className="card-label">COBRANÇA INTELIGENTE</span><h2>Não procure quem está devendo documento.</h2><p>O painel já identifica a pendência, organiza por prioridade e pode disparar a cobrança para você.</p><button className="button button-dark" onClick={() => onAgent("Cobrar documentos pendentes agora")}><Command />Cobrar pendências com IA</button></div>
      <div className="document-wave"><div className="wave-row"><span>Identificar</span><i className="done"><Check /></i></div><div className="wave-line" /><div className="wave-row"><span>Priorizar</span><i className="done"><Check /></i></div><div className="wave-line" /><div className="wave-row"><span>Cobrar</span><i><Send /></i></div><div className="wave-line" /><div className="wave-row"><span>Confirmar</span><i><FileCheck2 /></i></div></div>
    </article>
    <article className="glass-card data-card"><CardHeading label="PENDÊNCIAS" title="Documentação por evento" action={<span className="live-chip"><i />SINCRONIZADO</span>} /><div className="data-table document-table">{events.filter((item) => item.docs.length < 2).map((item) => <button className="data-row" onClick={() => onOpen(item)} key={item.id}><span className="file-round"><FileText /></span><span className="entity-cell"><b>{item.member}</b><small>{item.id} · {item.vehicle}</small></span><span><b>{item.docs.length ? item.docs[0] : "Nenhum arquivo"}</b><small>{item.docs.length ? "1 arquivo recebido" : "documentação pendente"}</small></span><span><SlaBadge sla={item.docs.length ? "Risco" : "Atrasado"} /></span><span className="muted-cell">{item.updated}</span><span className="row-arrow"><ChevronRight /></span></button>)}</div></article>
  </div>;
}

function AutomationsView({ notify, onAgent }: { notify: (message: string) => void; onAgent: (seed?: string) => void }) {
  const [running, setRunning] = useState<string | null>(null);
  const routines = [
    { id: "DOC-01", title: "Cobrança de documentos", description: "Identifica pendências e dispara contato com o associado.", frequency: "A cada 30 min", executions: "184 hoje", icon: <FileCheck2 /> },
    { id: "SLA-02", title: "Vigilância de SLA", description: "Recalcula risco e prioriza eventos antes do vencimento.", frequency: "Em tempo real", executions: "2.418 hoje", icon: <TimerReset /> },
    { id: "NET-03", title: "Distribuição de prestadores", description: "Cruza capacidade, região e especialidade da rede.", frequency: "Sob demanda", executions: "38 hoje", icon: <Network /> },
    { id: "REP-04", title: "Resumo executivo", description: "Consolida operação, desvios e próximos movimentos.", frequency: "Diariamente 18h", executions: "1 hoje", icon: <Activity /> },
    { id: "CAD-05", title: "Sincronização cadastral", description: "Mantém associado, evento e documentos consistentes.", frequency: "A cada alteração", executions: "327 hoje", icon: <RefreshCw /> },
  ];
  async function run(title: string) {
    setRunning(title);
    await new Promise((resolve) => setTimeout(resolve, 620));
    setRunning(null);
    notify(`${title} executada com sucesso.`);
  }
  return <div className="page-stack"><article className="automation-hero glass-card"><div><span className="card-label">AUTOMAÇÃO OPERACIONAL</span><h2>O trabalho continua.<br />A repetição não.</h2><p>Rotinas previsíveis deixam de depender de alguém lembrar, conferir e executar manualmente.</p><button className="button button-dark" onClick={() => onAgent("Quais rotinas você consegue executar agora?")}><Command />Pedir ao agente</button></div><AutomationGraphic /></article><article className="glass-card data-card"><CardHeading label="ROTINAS ATIVAS" title="Execução e controle" action={<span className="live-chip"><i />5 ATIVAS</span>} /><div className="routine-list">{routines.map((routine) => <div className="routine-row" key={routine.id}><span className="routine-icon">{routine.icon}</span><div className="entity-cell"><b>{routine.title}</b><small>{routine.description}</small></div><div className="routine-data"><span>FREQUÊNCIA</span><b>{routine.frequency}</b></div><div className="routine-data"><span>EXECUÇÕES</span><b>{routine.executions}</b></div><span className="routine-status"><i />Ativa</span><button className="button button-ghost" disabled={running === routine.title} onClick={() => void run(routine.title)}>{running === routine.title ? <RefreshCw className="spin" /> : <Activity />}{running === routine.title ? "Executando" : "Executar"}</button></div>)}</div></article></div>;
}

function AgentWorkspace({ events, associates, initialCommand, onConsume, onSetStage, onNewAssociate, onNewEvent, notify }: {
  events: EventItem[];
  associates: AssociateItem[];
  initialCommand?: string;
  onConsume: () => void;
  onSetStage: (id: string, stage: Stage) => boolean;
  onNewAssociate: () => void;
  onNewEvent: () => void;
  notify: (message: string) => void;
}) {
  return <AgentConsole events={events} associates={associates} initialCommand={initialCommand} onConsume={onConsume} onSetStage={onSetStage} onNewAssociate={onNewAssociate} onNewEvent={onNewEvent} notify={notify} full />;
}

function AgentDrawer({ events, associates, initialCommand, onClose, onSetStage, onNewAssociate, onNewEvent, onFull, notify }: {
  events: EventItem[];
  associates: AssociateItem[];
  initialCommand?: string;
  onClose: () => void;
  onSetStage: (id: string, stage: Stage) => boolean;
  onNewAssociate: () => void;
  onNewEvent: () => void;
  onFull: () => void;
  notify: (message: string) => void;
}) {
  return <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside className="agent-drawer"><div className="drawer-top"><div><span className="card-label">AGENTE IA</span><h2>Operação por comando</h2></div><div><button className="mini-round" onClick={onFull}><ArrowDownRight /></button><button className="mini-round" onClick={onClose}><X /></button></div></div><AgentConsole events={events} associates={associates} initialCommand={initialCommand} onSetStage={onSetStage} onNewAssociate={onNewAssociate} onNewEvent={onNewEvent} notify={notify} /></aside></div>;
}

function AgentConsole({ events, associates, initialCommand, onConsume, onSetStage, onNewAssociate, onNewEvent, notify, full = false }: {
  events: EventItem[];
  associates: AssociateItem[];
  initialCommand?: string;
  onConsume?: () => void;
  onSetStage: (id: string, stage: Stage) => boolean;
  onNewAssociate: () => void;
  onNewEvent: () => void;
  notify: (message: string) => void;
  full?: boolean;
}) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([
    { id: uid(), role: "agent", text: "Estou conectado à operação. Posso consultar a fila, mover eventos, revisar SLA, cobrar documentos, abrir cadastros e gerar resumos sem você trocar de tela.", meta: "Contexto operacional carregado" },
  ]);
  const [executions, setExecutions] = useState(["Contexto operacional sincronizado", "Filas e SLAs carregados"]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);
  useEffect(() => {
    if (initialCommand) {
      void execute(initialCommand);
      onConsume?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCommand]);

  async function execute(raw: string) {
    const command = raw.trim();
    if (!command || busy) return;
    setInput("");
    setMessages((value) => [...value, { id: uid(), role: "user", text: command }]);
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 420));

    const lower = command.toLowerCase();
    let response = "Analisei o pedido. Posso executar isso pela operação ou detalhar o que precisa acontecer antes.";
    let meta = "Consulta concluída";

    const eventMatch = command.match(/EV-?\d+/i);
    const stage = stages.find((item) => lower.includes(item.toLowerCase()));
    if (eventMatch && stage) {
      const id = eventMatch[0].replace(/EV(?!-)/i, "EV-").toUpperCase();
      const ok = onSetStage(id, stage);
      response = ok ? `${id} foi movido para ${stage}. A etapa, o contador da esteira e o registro de atualização já refletem a mudança.` : `Não encontrei ${id} na base atual. Posso procurar por associado ou placa.`;
      meta = ok ? "Alteração executada agora" : "Evento não localizado";
      if (ok) setExecutions((value) => [`${id} → ${stage}`, ...value].slice(0, 6));
    } else if (lower.includes("cadastrar") && lower.includes("associ")) {
      response = "Abri o fluxo de cadastro. Assim que você salvar, o novo associado aparece imediatamente na base e fica disponível para a operação.";
      meta = "Cadastro iniciado";
      setTimeout(onNewAssociate, 280);
    } else if ((lower.includes("novo") || lower.includes("abrir") || lower.includes("criar")) && lower.includes("evento")) {
      response = "Vou abrir o novo evento. Ao salvar, ele entra em Entrada e os quantitativos da esteira são recalculados na hora.";
      meta = "Abertura iniciada";
      setTimeout(onNewEvent, 280);
    } else if (lower.includes("document")) {
      const pending = events.filter((item) => item.docs.length === 0);
      response = `Encontrei ${pending.length} evento(s) sem documentação. A cobrança foi organizada por prioridade e a rotina de contato foi preparada para execução.`;
      meta = `Rotina preparada · ${pending.length} pendências`;
      setExecutions((value) => [`Cobrança documental · ${pending.length} itens`, ...value].slice(0, 6));
      notify("Cobrança documental preparada pelo agente.");
    } else if (lower.includes("sla") || lower.includes("risco") || lower.includes("atras")) {
      const atRisk = events.filter((item) => item.stage !== "Concluído" && item.sla !== "Dentro");
      response = `Revisão concluída: ${atRisk.length} evento(s) exigem atenção. ${atRisk.filter((item) => item.sla === "Atrasado").length} já estão atrasados. Priorizei a fila considerando SLA e criticidade.`;
      meta = `SLA revisado · ${atRisk.length} itens`;
      setExecutions((value) => [`Revisão de SLA · ${atRisk.length} itens`, ...value].slice(0, 6));
    } else if (lower.includes("relat") || lower.includes("resum")) {
      const active = events.filter((item) => item.stage !== "Concluído");
      const managed = active.reduce((sum, item) => sum + item.value, 0);
      response = `Resumo pronto: ${active.length} eventos ativos, ${events.length - active.length} concluídos, ${money(managed)} sob gestão, ${associates.length + 1231} associados na base consolidada e ${active.filter((item) => item.sla !== "Dentro").length} SLAs para revisão.`;
      meta = "Resumo operacional gerado agora";
      setExecutions((value) => ["Resumo executivo gerado", ...value].slice(0, 6));
    } else if (lower.includes("prestador") || lower.includes("vistoria") || lower.includes("distrib")) {
      response = "Cruzei a fila de vistoria com disponibilidade, região e SLA da rede. Existem 6 eventos aptos para distribuição e 12 prestadores com capacidade hoje.";
      meta = "Distribuição analisada";
      setExecutions((value) => ["Capacidade da rede analisada", ...value].slice(0, 6));
    } else if (lower.includes("associ")) {
      response = `A base consolidada tem ${associates.length + 1231} associados. Os últimos registros estão sincronizados e qualquer novo cadastro entra imediatamente na listagem.`;
      meta = "Base consultada";
    }

    setMessages((value) => [...value, { id: uid(), role: "agent", text: response, meta }]);
    setBusy(false);
  }

  const prompts = ["Revisar SLAs críticos", "Cobrar documentos pendentes", "Gerar resumo da operação", "Mover EV-2841 para Vistoria"];

  return <div className={`agent-console ${full ? "full" : "compact"}`}>
    {full && <div className="agent-console-banner"><div><span className="command-mark"><Command /></span><div><span className="card-label">AGENTE OPERACIONAL</span><h2>Converse com a operação.</h2><p>O agente não só responde: ele consulta o contexto e executa ações no painel.</p></div></div><div className="agent-system"><span><i />CONTEXTO</span><b>Sincronizado</b><small>eventos · associados · documentos · rede</small></div></div>}
    <div className="agent-grid">
      <section className="agent-chat glass-card">
        {!full && <div className="agent-chat-head"><div className="command-mark"><Command /></div><div><span className="card-label">AGENTE IA</span><h3>Conectado à operação</h3></div><span className="live-chip"><i />ONLINE</span></div>}
        <div className="agent-messages">
          {messages.map((message) => <div className={`agent-message ${message.role}`} key={message.id}>{message.role === "agent" && <span className="message-mark"><Command /></span>}<div><p>{message.text}</p>{message.meta && <small><CheckCircle2 />{message.meta}</small>}</div></div>)}
          {busy && <div className="agent-thinking"><span /><span /><span /><em>executando</em></div>}
          <div ref={endRef} />
        </div>
        <div className="prompt-row">{prompts.map((prompt) => <button key={prompt} onClick={() => void execute(prompt)}>{prompt}</button>)}</div>
        <form className="agent-input" onSubmit={(event: FormEvent) => { event.preventDefault(); void execute(input); }}><Command /><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ex.: mover EV-2841 para Vistoria" /><button disabled={busy || !input.trim()}><Send /></button></form>
      </section>
      {full && <aside className="agent-context-column"><article className="glass-card agent-action-card"><CardHeading label="AÇÕES DISPONÍVEIS" title="O que posso resolver" action={<Activity />} /><QuickAction icon={<UserPlus />} title="Cadastrar associado" meta="Atualiza a base ao salvar" onClick={onNewAssociate} /><QuickAction icon={<FileCheck2 />} title="Cobrar documentos" meta="Organiza e dispara pendências" onClick={() => void execute("Cobrar documentos pendentes agora")} /><QuickAction icon={<TimerReset />} title="Revisar SLA" meta="Prioriza risco e atraso" onClick={() => void execute("Revisar SLAs críticos")} /><QuickAction icon={<Network />} title="Distribuir rede" meta="Cruza capacidade e região" onClick={() => void execute("Distribuir vistorias aos prestadores")} /></article><article className="glass-card execution-card"><CardHeading label="EXECUÇÕES" title="Atividade do agente" action={<span className="live-chip"><i />LIVE</span>} /><div className="execution-list">{executions.map((item, index) => <div key={`${item}-${index}`}><span><Check /></span><div><b>{item}</b><small>{index === 0 ? "agora" : `${index * 3 + 1} min atrás`}</small></div></div>)}</div></article></aside>}
    </div>
  </div>;
}

function EventModal({ onClose, onCreate }: { onClose: () => void; onCreate: (form: FormData) => void }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal-card" action={onCreate}><ModalHeader kicker="NOVO EVENTO" title="Abrir atendimento" description="O registro entra em Entrada e atualiza a esteira imediatamente." onClose={onClose} /><div className="form-grid"><Field label="Associado"><input required name="member" placeholder="Nome completo" /></Field><Field label="WhatsApp"><input required name="phone" placeholder="(00) 00000-0000" /></Field><Field label="Veículo"><input required name="vehicle" placeholder="Marca, modelo e ano" /></Field><Field label="Placa"><input required name="plate" placeholder="ABC-1D23" /></Field><Field label="Localidade"><input name="city" defaultValue="Goiânia / GO" /></Field><Field label="Valor estimado"><input name="value" type="number" min="0" placeholder="0" /></Field><Field label="Tipo"><select name="type"><option>Colisão</option><option>Roubo/Furto</option><option>Assistência</option><option>Vidros</option></select></Field><Field label="Responsável"><select name="owner"><option>Camila</option><option>Leandro</option><option>André</option></select></Field><Field label="Prioridade"><select name="priority"><option>Normal</option><option>Alta</option></select></Field></div><footer className="modal-footer"><span className="live-note"><i />ATUALIZAÇÃO AO VIVO</span><button type="button" className="button button-ghost" onClick={onClose}>Cancelar</button><button className="button button-dark" type="submit"><Plus />Criar evento</button></footer></form></div>;
}

function AssociateModal({ onClose, onCreate }: { onClose: () => void; onCreate: (form: FormData) => void }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal-card" action={onCreate}><ModalHeader kicker="NOVO ASSOCIADO" title="Cadastrar associado" description="Salvou, apareceu. O registro entra na base e fica disponível para a operação na hora." onClose={onClose} /><div className="form-grid"><Field label="Nome completo"><input required name="name" placeholder="Nome do associado" /></Field><Field label="CPF"><input name="cpf" placeholder="000.000.000-00" /></Field><Field label="WhatsApp"><input required name="phone" placeholder="(00) 00000-0000" /></Field><Field label="E-mail"><input name="email" type="email" placeholder="nome@email.com" /></Field><Field label="Veículo"><input name="vehicle" placeholder="Marca, modelo e ano" /></Field><Field label="Placa"><input name="plate" placeholder="ABC-1D23" /></Field><Field label="Localidade"><input name="city" defaultValue="Goiânia / GO" /></Field><Field label="Status"><select name="status"><option>Ativo</option><option>Pendente</option><option>Bloqueado</option></select></Field></div><footer className="modal-footer"><span className="live-note"><i />ATUALIZAÇÃO AO VIVO</span><button type="button" className="button button-ghost" onClick={onClose}>Cancelar</button><button className="button button-dark" type="submit"><UserPlus />Cadastrar associado</button></footer></form></div>;
}

function EventDrawer({ item, onClose, onMove, onFiles }: { item: EventItem; onClose: () => void; onMove: (direction: number) => void; onFiles: (files: FileList | null) => void }) {
  const index = stages.indexOf(item.stage);
  return <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside className="event-drawer"><div className="drawer-top"><div><span className="card-label">{item.id}</span><h2>{item.member}</h2><p>{item.vehicle} · {item.plate}</p></div><button className="mini-round" onClick={onClose}><X /></button></div><div className="drawer-summary"><div><span>TIPO</span><b>{item.type}</b></div><div><span>SLA</span><SlaBadge sla={item.sla} /></div><div><span>RESPONSÁVEL</span><b>{item.owner}</b></div><div><span>VALOR</span><b>{money(item.value)}</b></div></div><section className="drawer-section"><CardHeading label="FLUXO" title="Progresso do evento" action={<StageBadge stage={item.stage} />} /><div className="vertical-steps">{stages.map((stage, stageIndex) => <div className={`${stageIndex < index ? "done" : ""} ${stageIndex === index ? "current" : ""}`} key={stage}><i>{stageIndex < index ? <Check /> : stageIndex + 1}</i><span>{stage}</span>{stageIndex === index && <em>etapa atual</em>}</div>)}</div><div className="drawer-actions"><button className="button button-ghost" disabled={index === 0} onClick={() => onMove(-1)}><ArrowLeft />Voltar</button><button className="button button-dark" disabled={index === stages.length - 1} onClick={() => onMove(1)}>Avançar <ArrowRight /></button></div></section><section className="drawer-section"><CardHeading label="DOCUMENTOS" title="Arquivos do evento" action={<label className="button button-ghost upload-button"><Upload />Anexar<input hidden type="file" multiple onChange={(event) => onFiles(event.target.files)} /></label>} /><div className="drawer-files">{item.docs.length ? item.docs.map((doc) => <div key={doc}><span><FileText /></span><div><b>{doc}</b><small>Recebido e vinculado ao evento</small></div><CheckCircle2 /></div>) : <div className="drawer-empty"><Inbox /><b>Nenhum documento</b><span>Use “Anexar” ou peça ao agente para cobrar o associado.</span></div>}</div></section></aside></div>;
}

function ModalHeader({ kicker, title, description, onClose }: { kicker: string; title: string; description: string; onClose: () => void }) {
  return <div className="modal-header"><div><span className="card-label">{kicker}</span><h2>{title}</h2><p>{description}</p></div><button type="button" className="mini-round" onClick={onClose}><X /></button></div>;
}
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="field"><span>{label}</span>{children}</label>; }

function CardHeading({ label, title, action }: { label: string; title: string; action?: ReactNode }) {
  return <div className="card-heading"><div><span className="card-label">{label}</span><h3>{title}</h3></div>{action}</div>;
}
function CompactMetric({ label, value, meta, tone }: { label: string; value: string; meta: string; tone?: "yellow" }) { return <article className={`compact-metric ${tone || ""}`}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>; }
function StageBadge({ stage }: { stage: Stage }) { return <span className="stage-badge"><i />{stage}</span>; }
function SlaBadge({ sla }: { sla: Sla }) { return <span className={`sla-badge ${sla.toLowerCase()}`}><i />{sla}</span>; }
function AssociateBadge({ status }: { status: AssociateStatus }) { return <span className={`associate-badge ${status.toLowerCase()}`}><i />{status}</span>; }
function Owner({ owner }: { owner: string }) { return <span className="owner"><i>{owner.slice(0, 1)}</i>{owner}</span>; }
function OwnerStack({ owner }: { owner: string }) { return <span className="owner-stack"><i>{owner.slice(0, 1)}</i><i>V</i></span>; }

function VeloceMark() {
  return <svg className="veloce-mark" viewBox="0 0 34 34" fill="none" aria-hidden="true"><rect x="1" y="1" width="32" height="32" rx="10" stroke="currentColor" strokeWidth="1.4"/><path d="M8.5 10.5 15.3 23h3.4l6.8-12.5h-4.2L17 19.1l-4.3-8.6H8.5Z" fill="currentColor"/><path d="M20.4 10.5h5.1l-5.2 9.7h-5.1l5.2-9.7Z" fill="#FFD94A"/></svg>;
}

function VehicleIllustration() {
  return <svg viewBox="0 0 420 190" className="vehicle-svg" fill="none" aria-hidden="true"><defs><linearGradient id="carBody" x1="67" y1="59" x2="346" y2="151" gradientUnits="userSpaceOnUse"><stop stopColor="#F2F1EA"/><stop offset="1" stopColor="#B9BAB6"/></linearGradient><linearGradient id="glass" x1="143" y1="62" x2="275" y2="112" gradientUnits="userSpaceOnUse"><stop stopColor="#434542"/><stop offset="1" stopColor="#20211F"/></linearGradient></defs><ellipse cx="211" cy="156" rx="156" ry="17" fill="#20211F" fillOpacity=".12"/><path d="M55 126c5-16 16-27 34-31l42-10 31-34c8-8 17-12 28-12h77c14 0 25 5 33 15l29 34 40 13c13 4 21 13 24 28l2 12H50l5-15Z" fill="url(#carBody)" stroke="#20211F" strokeWidth="2"/><path d="m153 82 25-27c5-6 12-9 21-9h28v38l-74-2Zm82 2V46h26c10 0 18 4 25 12l23 29-74-3Z" fill="url(#glass)"/><path d="M62 110h46M321 103h48M180 93h92" stroke="#20211F" strokeWidth="2" strokeLinecap="round"/><circle cx="118" cy="139" r="25" fill="#242523"/><circle cx="118" cy="139" r="13" fill="#C9CAC5" stroke="#20211F" strokeWidth="2"/><circle cx="315" cy="139" r="25" fill="#242523"/><circle cx="315" cy="139" r="13" fill="#C9CAC5" stroke="#20211F" strokeWidth="2"/><path d="M65 126h31M340 120h35" stroke="#FFD94A" strokeWidth="5" strokeLinecap="round"/><path d="M56 133h34m253 0h31" stroke="#20211F" strokeWidth="2" strokeLinecap="round"/></svg>;
}

function NetworkGraphic() {
  return <svg className="network-graphic" viewBox="0 0 430 250" fill="none" aria-hidden="true"><g stroke="#20211F" strokeOpacity=".2" strokeDasharray="4 6"><path d="M44 161 127 82l92 55 84-86 81 118"/><path d="M83 209 157 149l88 44 72-73"/></g><g fill="#FBFAF4" stroke="#20211F"><circle cx="44" cy="161" r="12"/><circle cx="127" cy="82" r="16"/><circle cx="219" cy="137" r="13"/><circle cx="303" cy="51" r="11"/><circle cx="384" cy="169" r="17"/><circle cx="83" cy="209" r="9"/><circle cx="157" cy="149" r="10"/><circle cx="245" cy="193" r="9"/><circle cx="317" cy="120" r="12"/></g><g fill="#FFD94A" stroke="#20211F"><circle cx="127" cy="82" r="7"/><circle cx="219" cy="137" r="6"/><circle cx="384" cy="169" r="8"/></g><path d="M342 208c0-16 13-29 29-29s29 13 29 29" stroke="#20211F" strokeWidth="1.5"/><path d="m365 205 9-11 10 11" stroke="#20211F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function AutomationGraphic() {
  return <svg className="automation-graphic" viewBox="0 0 520 250" fill="none" aria-hidden="true"><defs><linearGradient id="autoFade" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFD94A"/><stop offset="1" stopColor="#FFE894"/></linearGradient></defs><rect x="72" y="66" width="122" height="58" rx="18" fill="#20211F"/><rect x="207" y="66" width="122" height="58" rx="18" fill="rgba(255,255,255,.55)" stroke="#20211F"/><rect x="342" y="66" width="108" height="58" rx="18" fill="url(#autoFade)" stroke="#20211F"/><path d="M194 95h13M329 95h13" stroke="#20211F" strokeWidth="2" strokeLinecap="round"/><path d="m200 90 7 5-7 5M335 90l7 5-7 5" stroke="#20211F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="102" cy="95" r="11" fill="#FFD94A"/><path d="m96 95 4 4 8-9" stroke="#20211F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="238" cy="95" r="11" stroke="#20211F"/><path d="M238 88v8l5 3" stroke="#20211F" strokeWidth="2" strokeLinecap="round"/><path d="M371 95h17m-8-8 8 8-8 8" stroke="#20211F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M97 151h328" stroke="#20211F" strokeOpacity=".18" strokeDasharray="5 7"/><g fill="#20211F"><circle cx="97" cy="151" r="5"/><circle cx="207" cy="151" r="5"/><circle cx="316" cy="151" r="5"/><circle cx="425" cy="151" r="5"/></g><g fontFamily="sans-serif" fontSize="10" fill="#555650"><text x="78" y="174">IDENTIFICAR</text><text x="187" y="174">PRIORIZAR</text><text x="292" y="174">EXECUTAR</text><text x="401" y="174">REGISTRAR</text></g></svg>;
}
