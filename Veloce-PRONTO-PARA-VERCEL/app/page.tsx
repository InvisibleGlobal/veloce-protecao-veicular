"use client";

import { ChangeEvent, FormEvent, MouseEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
type View = "Dashboard" | "Esteira" | "Associados" | "Rede" | "Documentos" | "Rotinas" | "Assistente";
type Stage = "Entrada" | "Documentos" | "Analise" | "Vistoria" | "Aprovacao" | "Reparo" | "Concluido";
type Sla = "Dentro" | "Risco" | "Atrasado";
type AssociateStatus = "Ativo" | "Pendente" | "Inativo";
type IconName =
  | "grid" | "flow" | "users" | "network" | "file" | "bolt" | "message" | "plus"
  | "search" | "bell" | "chevron" | "check" | "clock" | "arrow" | "close" | "send"
  | "filter" | "upload" | "car" | "shield" | "menu" | "trend" | "refresh" | "phone"
  | "mail" | "pin" | "more" | "documentCheck" | "alert" | "report" | "scan" | "settings"
  | "eye" | "command" | "activity" | "userPlus" | "building" | "route" | "calendar" | "download";

type EventItem = {
  id: string;
  associate: string;
  vehicle: string;
  plate: string;
  city: string;
  stage: Stage;
  sla: Sla;
  owner: string;
  updated: string;
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
  updated: string;
};

type Message = { id: string; role: "user" | "assistant"; text: string };

type Routine = {
  title: string;
  description: string;
  icon: IconName;
  action: string;
  accent?: boolean;
};

const EVENT_STORAGE = "veloce-v4-events";
const ASSOCIATE_STORAGE = "veloce-v4-associates";
const CHANNEL_NAME = "veloce-v4-live";

const stageMeta: Array<{ key: Stage; label: string; helper: string }> = [
  { key: "Entrada", label: "Entrada", helper: "Novos eventos" },
  { key: "Documentos", label: "Documentos", helper: "Conferência" },
  { key: "Analise", label: "Análise", helper: "Validação" },
  { key: "Vistoria", label: "Vistoria", helper: "Em campo" },
  { key: "Aprovacao", label: "Aprovação", helper: "Decisão" },
  { key: "Reparo", label: "Reparo", helper: "Execução" },
  { key: "Concluido", label: "Concluído", helper: "Finalizados" },
];

const initialEvents: EventItem[] = [
  { id: "EV-2848", associate: "Marina Costa", vehicle: "Jeep Compass", plate: "RTA-8D21", city: "São Paulo, SP", stage: "Documentos", sla: "Risco", owner: "Larissa", updated: "há 4 min" },
  { id: "EV-2847", associate: "Rafael Prado", vehicle: "Toyota Corolla", plate: "GHT-2A18", city: "Campinas, SP", stage: "Vistoria", sla: "Dentro", owner: "André", updated: "há 8 min" },
  { id: "EV-2846", associate: "Bianca Freitas", vehicle: "Honda HR-V", plate: "QXZ-5H11", city: "Santos, SP", stage: "Analise", sla: "Dentro", owner: "Larissa", updated: "há 12 min" },
  { id: "EV-2845", associate: "Diego Moura", vehicle: "VW T-Cross", plate: "BFD-1C92", city: "Sorocaba, SP", stage: "Entrada", sla: "Dentro", owner: "Nina", updated: "há 16 min" },
  { id: "EV-2844", associate: "Helena Duarte", vehicle: "Hyundai Creta", plate: "PRL-7J14", city: "Jundiaí, SP", stage: "Aprovacao", sla: "Atrasado", owner: "André", updated: "há 23 min" },
  { id: "EV-2843", associate: "Lucas Neri", vehicle: "Chevrolet Tracker", plate: "FPN-4M26", city: "São Paulo, SP", stage: "Reparo", sla: "Dentro", owner: "Nina", updated: "há 29 min" },
  { id: "EV-2842", associate: "Paula Meireles", vehicle: "Nissan Kicks", plate: "LXD-9G31", city: "Guarulhos, SP", stage: "Documentos", sla: "Atrasado", owner: "Larissa", updated: "há 38 min" },
  { id: "EV-2841", associate: "Marcelo Reis", vehicle: "Fiat Fastback", plate: "SRA-3K20", city: "Osasco, SP", stage: "Entrada", sla: "Risco", owner: "Nina", updated: "há 44 min" },
  { id: "EV-2840", associate: "Aline Lopes", vehicle: "Renault Kardian", plate: "TNG-6B08", city: "São Paulo, SP", stage: "Concluido", sla: "Dentro", owner: "André", updated: "há 51 min" },
  { id: "EV-2839", associate: "Caio Leal", vehicle: "VW Nivus", plate: "JQR-2L40", city: "Santo André, SP", stage: "Vistoria", sla: "Risco", owner: "Larissa", updated: "há 1 h" },
  { id: "EV-2838", associate: "Renata Nunes", vehicle: "Honda City", plate: "DXP-5N73", city: "São Bernardo, SP", stage: "Analise", sla: "Dentro", owner: "André", updated: "há 1 h" },
  { id: "EV-2837", associate: "Bruno Mota", vehicle: "Toyota Yaris", plate: "MST-8A19", city: "Barueri, SP", stage: "Concluido", sla: "Dentro", owner: "Nina", updated: "há 2 h" },
  { id: "EV-2836", associate: "Lívia Ramos", vehicle: "Peugeot 2008", plate: "KQA-3D49", city: "São Paulo, SP", stage: "Documentos", sla: "Dentro", owner: "Larissa", updated: "há 2 h" },
  { id: "EV-2835", associate: "Fábio Teles", vehicle: "BYD Song", plate: "VCP-9A72", city: "Campinas, SP", stage: "Reparo", sla: "Risco", owner: "Nina", updated: "há 3 h" },
  { id: "EV-2834", associate: "Clara Salles", vehicle: "GWM Haval H6", plate: "KLM-4Q18", city: "São Paulo, SP", stage: "Entrada", sla: "Dentro", owner: "Nina", updated: "há 3 h" },
  { id: "EV-2833", associate: "Henrique Dias", vehicle: "Fiat Pulse", plate: "RCD-7M61", city: "Campinas, SP", stage: "Aprovacao", sla: "Dentro", owner: "André", updated: "há 4 h" },
];

const initialAssociates: AssociateItem[] = [
  { id: "AS-1952", name: "Marina Costa", cpf: "***.482.***-**", phone: "(11) 99942-3810", email: "marina@exemplo.com", vehicle: "Jeep Compass", plate: "RTA-8D21", city: "São Paulo, SP", status: "Ativo", updated: "agora" },
  { id: "AS-1951", name: "Rafael Prado", cpf: "***.184.***-**", phone: "(19) 99128-7712", email: "rafael@exemplo.com", vehicle: "Toyota Corolla", plate: "GHT-2A18", city: "Campinas, SP", status: "Ativo", updated: "há 8 min" },
  { id: "AS-1950", name: "Bianca Freitas", cpf: "***.337.***-**", phone: "(13) 99718-4300", email: "bianca@exemplo.com", vehicle: "Honda HR-V", plate: "QXZ-5H11", city: "Santos, SP", status: "Pendente", updated: "há 12 min" },
  { id: "AS-1949", name: "Diego Moura", cpf: "***.764.***-**", phone: "(15) 99881-2190", email: "diego@exemplo.com", vehicle: "VW T-Cross", plate: "BFD-1C92", city: "Sorocaba, SP", status: "Ativo", updated: "há 16 min" },
  { id: "AS-1948", name: "Helena Duarte", cpf: "***.108.***-**", phone: "(11) 99214-6512", email: "helena@exemplo.com", vehicle: "Hyundai Creta", plate: "PRL-7J14", city: "Jundiaí, SP", status: "Ativo", updated: "há 23 min" },
  { id: "AS-1947", name: "Lucas Neri", cpf: "***.409.***-**", phone: "(11) 99553-8061", email: "lucas@exemplo.com", vehicle: "Chevrolet Tracker", plate: "FPN-4M26", city: "São Paulo, SP", status: "Ativo", updated: "há 29 min" },
];

const providers = [
  { name: "Auto Prime Centro", city: "São Paulo, SP", specialty: "Funilaria e pintura", load: 62, eta: "2 dias", score: "4,9", jobs: 18 },
  { name: "Vistocar Leste", city: "São Paulo, SP", specialty: "Vistoria técnica", load: 41, eta: "hoje", score: "4,8", jobs: 12 },
  { name: "Oficina Norte", city: "Guarulhos, SP", specialty: "Mecânica e elétrica", load: 78, eta: "3 dias", score: "4,7", jobs: 24 },
  { name: "CheckAuto Campinas", city: "Campinas, SP", specialty: "Vistoria e laudos", load: 36, eta: "amanhã", score: "4,9", jobs: 9 },
];

const documents = [
  { event: "EV-2848", associate: "Marina Costa", item: "CNH do condutor", status: "Pendente", age: "18 min" },
  { event: "EV-2842", associate: "Paula Meireles", item: "Fotos do veículo", status: "Atrasado", age: "1 h 12 min" },
  { event: "EV-2836", associate: "Lívia Ramos", item: "Boletim de ocorrência", status: "Em análise", age: "2 h" },
  { event: "EV-2833", associate: "Henrique Dias", item: "Comprovante de endereço", status: "Recebido", age: "3 h" },
];

const routines: Routine[] = [
  { title: "Cobrar documentos", description: "Identifica pendências, organiza a lista e dispara a cobrança.", icon: "documentCheck", action: "Cobrar documentos pendentes" },
  { title: "Revisar SLAs", description: "Separa riscos e atrasos para o time atuar primeiro no que importa.", icon: "clock", action: "Revisar SLAs críticos", accent: true },
  { title: "Distribuir rede", description: "Compara região, capacidade e prazo antes de sugerir prestadores.", icon: "route", action: "Distribuir eventos na rede" },
  { title: "Triar entradas", description: "Organiza novos eventos e sinaliza o que precisa de validação humana.", icon: "scan", action: "Triar novas entradas" },
  { title: "Gerar relatório", description: "Consolida volume, SLA, etapas e pendências em um resumo executivo.", icon: "report", action: "Gerar relatório operacional" },
  { title: "Revisar cadastros", description: "Aponta dados incompletos antes que eles virem gargalo na operação.", icon: "users", action: "Revisar cadastros pendentes" },
];

const nav: Array<{ view: View; label: string; icon: IconName }> = [
  { view: "Dashboard", label: "Visão geral", icon: "grid" },
  { view: "Esteira", label: "Esteira", icon: "flow" },
  { view: "Associados", label: "Associados", icon: "users" },
  { view: "Rede", label: "Rede", icon: "network" },
  { view: "Documentos", label: "Documentos", icon: "file" },
  { view: "Rotinas", label: "Rotinas", icon: "bolt" },
];

const viewCopy: Record<View, { eyebrow: string; title: string; subtitle: string }> = {
  Dashboard: { eyebrow: "CENTRAL OPERACIONAL", title: "Operação de hoje", subtitle: "Volume, prioridades e execução em uma visão clara." },
  Esteira: { eyebrow: "CONTROLE DE FLUXO", title: "Esteira operacional", subtitle: "Quantitativos primeiro; detalhe somente quando for necessário." },
  Associados: { eyebrow: "BASE OPERACIONAL", title: "Associados", subtitle: "Cadastro e consulta com atualização imediata no painel." },
  Rede: { eyebrow: "REDE CREDENCIADA", title: "Prestadores", subtitle: "Capacidade, prazo e distribuição sem planilhas paralelas." },
  Documentos: { eyebrow: "DOCUMENTAÇÃO", title: "Documentos", subtitle: "Pendências e conferências organizadas por evento." },
  Rotinas: { eyebrow: "AUTOMAÇÃO OPERACIONAL", title: "Rotinas", subtitle: "Tarefas recorrentes transformadas em ações simples." },
  Assistente: { eyebrow: "COMANDO OPERACIONAL", title: "Agente de operação", subtitle: "Peça a ação, acompanhe a execução e mantenha o controle na mesma tela." },
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <img
      className="svg-icon"
      src={`/icons/${name}.svg`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}

function StatusChip({ type, children }: { type: "success" | "warning" | "danger" | "neutral"; children: ReactNode }) {
  return <span className={`status-chip status-${type}`}>{children}</span>;
}

function PanelHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="panel-header">
      <div>
        <h2 className="section-title">{title}</h2>
        {description ? <p className="description panel-description">{description}</p> : null}
      </div>
      {action ? <div className="panel-header-action">{action}</div> : null}
    </div>
  );
}

function StatNumber({ value, label, detail, icon }: { value: string | number; label: string; detail: string; icon: IconName }) {
  return (
    <div className="hero-stat">
      <div className="hero-stat-icon"><Icon name={icon} size={16}/></div>
      <div className="hero-stat-copy">
        <span className="metric-value">{value}</span>
        <span className="metric-label">{label}</span>
        <span className="caption">{detail}</span>
      </div>
    </div>
  );
}

export default function Page() {
  const [view, setView] = useState<View>("Dashboard");
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [associates, setAssociates] = useState<AssociateItem[]>(initialAssociates);
  const [selectedStage, setSelectedStage] = useState<Stage | "Todos">("Todos");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [associateModal, setAssociateModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "m-1", role: "assistant", text: "Contexto operacional pronto. Posso consultar a fila, mover eventos, revisar prazos, organizar documentos, abrir cadastros e gerar um resumo sem sair desta tela." },
  ]);
  const [agentInput, setAgentInput] = useState("");
  const [agentBusy, setAgentBusy] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem(EVENT_STORAGE);
      const storedAssociates = localStorage.getItem(ASSOCIATE_STORAGE);
      if (storedEvents) setEvents(JSON.parse(storedEvents));
      if (storedAssociates) setAssociates(JSON.parse(storedAssociates));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(EVENT_STORAGE, JSON.stringify(events)); } catch {}
  }, [events]);

  useEffect(() => {
    try { localStorage.setItem(ASSOCIATE_STORAGE, JSON.stringify(associates)); } catch {}
  }, [associates]);

  useEffect(() => {
    if (!("BroadcastChannel" in window)) return;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data?.type === "events") setEvents(event.data.value);
      if (event.data?.type === "associates") setAssociates(event.data.value);
    };
    return () => channel.close();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSelectedEvent(null);
        setAssociateModal(false);
        setEventModal(false);
        setSearchOpen(false);
        setMobileNav(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) window.setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const counts = useMemo(() => {
    const result = {} as Record<Stage, number>;
    stageMeta.forEach((stage) => { result[stage.key] = events.filter((item) => item.stage === stage.key).length; });
    return result;
  }, [events]);

  const attentions = useMemo(() => {
    const result = {} as Record<Stage, number>;
    stageMeta.forEach((stage) => { result[stage.key] = events.filter((item) => item.stage === stage.key && item.sla !== "Dentro").length; });
    return result;
  }, [events]);

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return events.filter((item) => {
      const stageOk = selectedStage === "Todos" || item.stage === selectedStage;
      const queryOk = !normalized || [item.id, item.associate, item.vehicle, item.plate, item.city, item.owner].some((value) => value.toLowerCase().includes(normalized));
      return stageOk && queryOk;
    });
  }, [events, selectedStage, query]);

  const riskCount = events.filter((item) => item.sla === "Risco").length;
  const overdueCount = events.filter((item) => item.sla === "Atrasado").length;
  const activeCount = events.filter((item) => item.stage !== "Concluido").length;
  const docCount = events.filter((item) => item.stage === "Documentos").length;

  function broadcast(type: "events" | "associates", value: EventItem[] | AssociateItem[]) {
    if (!("BroadcastChannel" in window)) return;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type, value });
    channel.close();
  }

  function navigate(next: View) {
    setView(next);
    setMobileNav(false);
    setQuery("");
    if (next !== "Esteira") setSelectedStage("Todos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function moveEvent(id: string, stage: Stage) {
    const next = events.map((event) => event.id === id ? { ...event, stage, updated: "agora" } : event);
    setEvents(next);
    broadcast("events", next);
    const refreshed = next.find((event) => event.id === id) || null;
    setSelectedEvent(refreshed);
    setToast(`${id} movido para ${stageMeta.find((item) => item.key === stage)?.label}.`);
  }

  function createAssociate(data: Omit<AssociateItem, "id" | "updated">) {
    const number = 1953 + associates.length;
    const nextItem: AssociateItem = { ...data, id: `AS-${number}`, updated: "agora" };
    const next = [nextItem, ...associates];
    setAssociates(next);
    broadcast("associates", next);
    setAssociateModal(false);
    setToast(`${nextItem.name} foi cadastrado e já está disponível na base.`);
  }

  function createEvent(data: Omit<EventItem, "id" | "updated">) {
    const number = 2849 + events.length;
    const nextItem: EventItem = { ...data, id: `EV-${number}`, updated: "agora" };
    const next = [nextItem, ...events];
    setEvents(next);
    broadcast("events", next);
    setEventModal(false);
    setToast(`${nextItem.id} criado e incluído na esteira.`);
  }

  function handleRoutine(action: string) {
    if (action.toLowerCase().includes("cobrar")) {
      setToast(`${docCount} eventos com documentos foram organizados para cobrança.`);
    } else if (action.toLowerCase().includes("sla")) {
      setToast(`${riskCount + overdueCount} eventos precisam de atenção por SLA.`);
    } else if (action.toLowerCase().includes("relatório")) {
      downloadReport();
      return;
    } else {
      setToast(`${action}: execução registrada.`);
    }
  }

  function downloadReport() {
    const content = [
      "Veloce — resumo operacional",
      `Eventos ativos: ${activeCount}`,
      `Em risco: ${riskCount}`,
      `Atrasados: ${overdueCount}`,
      `Associados: ${associates.length}`,
      "",
      ...stageMeta.map((stage) => `${stage.label}: ${counts[stage.key]}`),
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "veloce-resumo-operacional.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    setToast("Resumo operacional gerado.");
  }

  async function executeAgent(text: string) {
    const value = text.trim();
    if (!value || agentBusy) return;

    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", text: value }]);
    setAgentInput("");
    setAgentBusy(true);

    const lower = value.toLocaleLowerCase("pt-BR");
    const normalized = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const eventMatch = value.match(/EV[-\s]?\d+/i)?.[0]?.toUpperCase().replace(/\s/g, "").replace(/^EV(?!-)/, "EV-");
    const stageAliases: Array<[Stage, string[]]> = [
      ["Entrada", ["entrada", "novo", "novos"]],
      ["Documentos", ["documentos", "documentacao"]],
      ["Analise", ["analise", "validacao"]],
      ["Vistoria", ["vistoria", "inspecao"]],
      ["Aprovacao", ["aprovacao", "aprovar"]],
      ["Reparo", ["reparo", "oficina", "execucao"]],
      ["Concluido", ["concluido", "concluir", "finalizado"]],
    ];
    const requestedStage = stageAliases.find(([, aliases]) => aliases.some((alias) => normalized.includes(alias)))?.[0];

    let localReply = "";
    let handledLocally = false;

    if (eventMatch && requestedStage) {
      const exists = events.some((event) => event.id === eventMatch);
      if (exists) {
        moveEvent(eventMatch, requestedStage);
        const label = stageMeta.find((item) => item.key === requestedStage)?.label ?? requestedStage;
        localReply = `${eventMatch} foi movido para ${label}. A esteira e os quantitativos já foram atualizados.`;
      } else {
        localReply = `Não encontrei ${eventMatch} na fila atual. Posso pesquisar por associado ou placa.`;
      }
      handledLocally = true;
    } else if ((normalized.includes("cadastrar") || normalized.includes("novo")) && normalized.includes("associ")) {
      setAssociateModal(true);
      localReply = "Cadastro de associado aberto. Ao salvar, a base e os indicadores são atualizados imediatamente.";
      handledLocally = true;
    } else if ((normalized.includes("criar") || normalized.includes("novo")) && normalized.includes("evento")) {
      setEventModal(true);
      localReply = "Cadastro de evento aberto. O novo registro entra na esteira assim que for salvo.";
      handledLocally = true;
    } else if (normalized.includes("cobrar") && normalized.includes("document")) {
      handleRoutine("Cobrar documentos pendentes");
      navigate("Documentos");
      localReply = `${docCount} eventos em Documentos foram reunidos para cobrança. Abri a frente documental para você.`;
      handledLocally = true;
    } else if (normalized.includes("sla") || normalized.includes("prazo") || normalized.includes("atras")) {
      setSelectedStage("Todos");
      navigate("Esteira");
      localReply = `A operação tem ${riskCount} eventos em risco e ${overdueCount} atrasados. Abri a esteira para priorização.`;
      handledLocally = true;
    } else if (normalized.includes("relatorio") || normalized.includes("resumo")) {
      downloadReport();
      localReply = "Resumo operacional gerado com volume ativo, SLAs e distribuição por etapa.";
      handledLocally = true;
    } else if (normalized.includes("associados") || normalized.includes("base")) {
      navigate("Associados");
      localReply = `A base tem ${associates.length} associados. Abri a consulta de cadastros.`;
      handledLocally = true;
    } else if (normalized.includes("rede") || normalized.includes("prestador")) {
      navigate("Rede");
      localReply = "Abri a rede credenciada com capacidade, prazo e carga atual dos prestadores.";
      handledLocally = true;
    } else if (normalized.includes("esteira") || normalized.includes("fila")) {
      navigate("Esteira");
      localReply = `A fila tem ${activeCount} eventos ativos. Abri a esteira com os quantitativos por etapa.`;
      handledLocally = true;
    } else if (normalized.includes("quantos") || normalized.includes("status") || normalized.includes("operacao")) {
      localReply = `Agora: ${activeCount} eventos ativos, ${riskCount} em risco, ${overdueCount} atrasados e ${associates.length} associados na base.`;
      handledLocally = true;
    }

    if (handledLocally) {
      await new Promise((resolve) => window.setTimeout(resolve, 260));
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: localReply }]);
      setAgentBusy(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value, context: { activeCount, riskCount, overdueCount, associates: associates.length, selectedStage } }),
        signal: controller.signal,
      });
      const data = await response.json();
      const reply = data?.reply || "Não identifiquei uma ação específica. Você pode pedir para mover um evento, revisar prazos, cobrar documentos, abrir cadastros ou gerar um resumo.";
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: reply }]);
    } catch {
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: "Posso executar agora: mover eventos, abrir a esteira, cadastrar associado, criar evento, revisar prazos, organizar documentos, consultar a rede e gerar resumo operacional." }]);
    } finally {
      window.clearTimeout(timeoutId);
      setAgentBusy(false);
    }
  }

  const globalSearch = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    const associateResults = associates
      .filter((item) => [item.name, item.plate, item.city, item.id].some((field) => field.toLowerCase().includes(value)))
      .slice(0, 4)
      .map((item) => ({ kind: "Associado", title: item.name, detail: `${item.id} · ${item.vehicle} · ${item.plate}`, icon: "users" as IconName, action: () => navigate("Associados") }));
    const eventResults = events
      .filter((item) => [item.id, item.associate, item.plate, item.city].some((field) => field.toLowerCase().includes(value)))
      .slice(0, 4)
      .map((item) => ({ kind: "Evento", title: item.id, detail: `${item.associate} · ${item.vehicle} · ${item.stage}`, icon: "flow" as IconName, action: () => { setSearchOpen(false); setSelectedEvent(item); } }));
    return [...eventResults, ...associateResults];
  }, [query, events, associates]);

  const pageInfo = viewCopy[view];

  return (
    <main className="app-stage">
      <section className={`app-shell ${view === "Rotinas" ? "app-shell-routines" : ""} ${view === "Dashboard" ? "app-shell-dashboard" : ""}`}>
        <header className="topbar">
          <button className="brand" onClick={() => navigate("Dashboard")} aria-label="Ir para a visão geral">
            <img src="/veloce-mark.svg" alt="" />
            <span><strong>Veloce</strong><small>Central operacional</small></span>
          </button>

          <nav className={`main-nav ${mobileNav ? "is-open" : ""}`} aria-label="Navegação principal">
            {nav.map((item) => (
              <button key={item.view} className={view === item.view ? "active" : ""} onClick={() => navigate(item.view)}>
                <Icon name={item.icon} size={15}/><span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="top-actions">
            <button className="icon-button search-trigger" aria-label="Pesquisar" onClick={() => { setQuery(""); setSearchOpen(true); }}>
              <Icon name="search" size={16}/><span className="shortcut">⌘K</span>
            </button>
            <button className="icon-button" aria-label="Notificações" onClick={() => setToast(`${riskCount + overdueCount} itens exigem atenção.`)}>
              <Icon name="bell" size={16}/><i className="notification-dot"/>
            </button>
            <button className="assistant-top" onClick={() => navigate("Assistente")}><Icon name="command" size={15}/><span>Agente</span></button>
            <button className="profile-button profile-photo-button" aria-label="Perfil" onClick={() => setToast("Perfil operacional ativo.")}><img src="/member-avatar.jpg" alt="Perfil operacional"/></button>
            <button className="icon-button mobile-menu" aria-label="Abrir menu" onClick={() => setMobileNav((value) => !value)}><Icon name={mobileNav ? "close" : "menu"} size={18}/></button>
          </div>
        </header>

        <div className="page-shell">
          {view !== "Dashboard" ? (
            <header className="page-header page-header-prototype">
              <div className="page-copy">
                <span className="eyebrow">{pageInfo.eyebrow}</span>
                <h1 className="page-title">{pageInfo.title}</h1>
                <p className="subtitle">{pageInfo.subtitle}</p>
              </div>
              <div className="page-actions">
                <button className="button button-light" onClick={() => setAssociateModal(true)}><Icon name="userPlus" size={15}/>Novo associado</button>
                <button className="button button-dark" onClick={() => setEventModal(true)}><Icon name="plus" size={15}/>Novo evento</button>
              </div>
            </header>
          ) : null}

          {view === "Dashboard" ? (
            <DashboardView
              events={events}
              associates={associates}
              counts={counts}
              attentions={attentions}
              activeCount={activeCount}
              riskCount={riskCount}
              overdueCount={overdueCount}
              onStage={(stage) => { setSelectedStage(stage); navigate("Esteira"); }}
              onEvent={setSelectedEvent}
              onRoutine={handleRoutine}
              onNavigate={navigate}
              onAssistant={() => navigate("Assistente")}
            />
          ) : null}

          {view === "Esteira" ? (
            <PipelineView
              counts={counts}
              attentions={attentions}
              selectedStage={selectedStage}
              onSelectStage={setSelectedStage}
              events={filteredEvents}
              query={query}
              onQuery={setQuery}
              onEvent={setSelectedEvent}
              onReset={() => { setSelectedStage("Todos"); setQuery(""); }}
            />
          ) : null}

          {view === "Associados" ? (
            <AssociatesView associates={associates} onNew={() => setAssociateModal(true)} onAction={setToast} />
          ) : null}

          {view === "Rede" ? <ProvidersView onAction={setToast} /> : null}
          {view === "Documentos" ? <DocumentsView onRoutine={handleRoutine} onAction={setToast} /> : null}
          {view === "Rotinas" ? <RoutinesView onRoutine={handleRoutine} onAssistant={() => navigate("Assistente")} /> : null}

          {view === "Assistente" ? (
            <AssistantView
              messages={messages}
              input={agentInput}
              onInput={setAgentInput}
              onSend={executeAgent}
              busy={agentBusy}
              onRoutine={(action) => executeAgent(action)}
              activeCount={activeCount}
              riskCount={riskCount}
              overdueCount={overdueCount}
              associates={associates.length}
            />
          ) : null}
        </div>
      </section>

      {selectedEvent ? <EventDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} onMove={moveEvent}/> : null}
      {associateModal ? <AssociateModal onClose={() => setAssociateModal(false)} onSubmit={createAssociate}/> : null}
      {eventModal ? <EventModal associates={associates} onClose={() => setEventModal(false)} onSubmit={createEvent}/> : null}
      {searchOpen ? <SearchDialog query={query} onQuery={setQuery} results={globalSearch} onClose={() => { setSearchOpen(false); setQuery(""); }} inputRef={searchRef}/> : null}
      {toast ? <div className="toast"><Icon name="check" size={15}/><span>{toast}</span></div> : null}
    </main>
  );
}

function DashboardView({
  events, associates, counts, attentions, activeCount, riskCount, overdueCount, onStage, onEvent, onRoutine, onNavigate, onAssistant,
}: {
  events: EventItem[];
  associates: AssociateItem[];
  counts: Record<Stage, number>;
  attentions: Record<Stage, number>;
  activeCount: number;
  riskCount: number;
  overdueCount: number;
  onStage: (stage: Stage) => void;
  onEvent: (event: EventItem) => void;
  onRoutine: (action: string) => void;
  onNavigate: (view: View) => void;
  onAssistant: () => void;
}) {
  const priority = events.filter((item) => item.sla !== "Dentro").slice(0, 4);
  const spotlight = associates[0];
  const completedCount = counts.Concluido;
  const attentionCount = riskCount + overdueCount;
  const safeCount = Math.max(activeCount - attentionCount, 0);
  const slaPercent = activeCount ? Math.round((safeCount / activeCount) * 100) : 0;

  const stageBars = stageMeta.slice(0, 6).map((stage) => ({
    key: stage.key,
    short: stage.label.slice(0, 3),
    label: stage.label,
    value: counts[stage.key],
  }));
  const maxStageValue = Math.max(...stageBars.map((item) => item.value), 1);

  const ownerLoad = [
    { name: "Nina", value: events.filter((item) => item.owner === "Nina").length, tone: "dark" },
    { name: "Larissa", value: events.filter((item) => item.owner === "Larissa").length, tone: "yellow" },
    { name: "André", value: events.filter((item) => item.owner === "André").length, tone: "soft" },
  ];

  const agendaItems = [
    {
      time: "08:30",
      title: "Triagem de novas entradas",
      detail: `${counts.Entrada} eventos para validar na abertura`,
      chips: ["Nina", "Larissa"],
      accent: "dark",
    },
    {
      time: "10:00",
      title: "Cobrança documental",
      detail: `${counts.Documentos} itens aguardando retorno`,
      chips: ["Docs", "SLA"],
      accent: "light",
    },
    {
      time: "13:30",
      title: "Distribuição para rede",
      detail: `${providers.length} prestadores prontos para consulta`,
      chips: ["Rede", "Campo"],
      accent: "yellow",
    },
    {
      time: "16:00",
      title: "Fechamento do relatório",
      detail: `${completedCount} eventos já concluídos hoje`,
      chips: ["Resumo"],
      accent: "light",
    },
  ];

  const liveItems = [
    {
      title: `${priority[0]?.id || "EV-2848"} precisa de atenção`,
      detail: priority[0] ? `${priority[0].associate} · ${priority[0].stage}` : "Fila priorizada automaticamente",
      icon: "alert" as IconName,
    },
    {
      title: `${counts.Documentos} documentações em conferência`,
      detail: "Pendências e recebimentos sincronizados",
      icon: "file" as IconName,
    },
    {
      title: `${providers[1]?.name || "Vistocar Leste"} com melhor disponibilidade`,
      detail: providers[1]?.eta ? `Prazo estimado: ${providers[1].eta}` : "Rede monitorada em tempo real",
      icon: "building" as IconName,
    },
  ];

  const compactRoutines = routines.slice(0, 3);

  return (
    <div className="dashboard-view dashboard-prototype-view">
      <section className="prototype-board panel">
        <div className="prototype-board-top">
          <div className="prototype-chip-row">
            <span className="prototype-brand">Visão operacional</span>
            {[
              { label: "Hoje", action: () => onNavigate("Dashboard") },
              { label: "Esteira", action: () => onNavigate("Esteira") },
              { label: "Documentos", action: () => onNavigate("Documentos") },
              { label: "Rede", action: () => onNavigate("Rede") },
            ].map((item, index) => (
              <button key={item.label} className={`prototype-tab ${index === 0 ? "active" : ""}`} onClick={item.action}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="prototype-mini-actions">
            <button className="icon-button" aria-label="Buscar" onClick={() => onNavigate("Associados")}><Icon name="search" size={15}/></button>
            <button className="icon-button" aria-label="Notificações" onClick={onAssistant}><Icon name="bell" size={15}/></button>
            <button className="icon-button" aria-label="Configurações" onClick={() => onNavigate("Rotinas")}><Icon name="settings" size={15}/></button>
          </div>
        </div>

        <div className="prototype-overview">
          <div className="prototype-overview-copy">
            <span className="eyebrow">DASHBOARD OPERACIONAL</span>
            <h2 className="prototype-welcome-title">Bem-vinda à operação Veloce</h2>
            <p className="description prototype-welcome-text">Acompanhe volume, SLAs, responsáveis, agenda e tarefas críticas em uma única visão.</p>
            <div className="prototype-pills">
              <span className="prototype-pill prototype-pill-dark">{counts.Entrada} novas entradas</span>
              <span className="prototype-pill prototype-pill-yellow">{attentionCount} atenções imediatas</span>
              <span className="prototype-pill">{completedCount} concluídos</span>
            </div>
          </div>
          <div className="prototype-metric-cluster">
            <div><small>Eventos</small><strong>{activeCount}</strong><span>em acompanhamento</span></div>
            <div><small>Críticos</small><strong>{attentionCount}</strong><span>risco e atraso</span></div>
            <div><small>Concluídos</small><strong>{completedCount}</strong><span>hoje na esteira</span></div>
          </div>
        </div>

        <div className="prototype-main-grid">
          <article className="prototype-member-card">
            <div className="prototype-card-head">
              <div>
                <span className="label">DESTAQUE DO DIA</span>
                <h3 className="card-title">Associada acompanhada</h3>
              </div>
              <button className="icon-button icon-button-plain" aria-label="Abrir cadastro" onClick={() => onNavigate("Associados")}><Icon name="arrow" size={15}/></button>
            </div>
            <button className="prototype-member-photo" onClick={() => spotlight && onNavigate("Associados")}>
              <img src="/member-main.jpg" alt="Associada em destaque" />
              <span className="prototype-member-overlay">
                <strong>{spotlight?.name || "Marina Costa"}</strong>
                <small>{spotlight?.vehicle || "Jeep Compass"} · {spotlight?.plate || "RTA-8D21"}</small>
              </span>
            </button>
            <div className="prototype-member-links">
              <button onClick={() => onNavigate("Associados")}><span>Dados cadastrais</span><Icon name="chevron" size={14}/></button>
              <button onClick={() => onNavigate("Documentos")}><span>Documentos</span><Icon name="chevron" size={14}/></button>
              <button onClick={() => onNavigate("Rede")}><span>Rede acionada</span><Icon name="chevron" size={14}/></button>
            </div>
          </article>

          <article className="prototype-progress-card">
            <div className="prototype-card-head">
              <div>
                <span className="label">PROGRESSO</span>
                <h3 className="card-title">Volume por etapa</h3>
              </div>
              <span className="prototype-badge">Atualizado agora</span>
            </div>
            <div className="prototype-progress-summary">
              <strong>6.1 h</strong>
              <span>tempo médio até a primeira ação</span>
            </div>
            <div className="prototype-bar-chart" aria-label="Gráfico de etapas">
              {stageBars.map((item) => (
                <div key={item.key} className="prototype-bar-item">
                  <div className="prototype-bar-rail"><i style={{ height: `${Math.max(18, Math.round((item.value / maxStageValue) * 100))}%` }}/></div>
                  <strong>{item.value}</strong>
                  <span>{item.short}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="prototype-sla-card">
            <div className="prototype-card-head">
              <div>
                <span className="label">SLA</span>
                <h3 className="card-title">Saúde da operação</h3>
              </div>
              <button className="icon-button icon-button-plain" aria-label="Abrir agente" onClick={onAssistant}><Icon name="command" size={15}/></button>
            </div>
            <div className="prototype-donut-wrap">
              <div className="prototype-donut" style={{ ["--prototype-progress" as string]: `${slaPercent}%` } as React.CSSProperties}>
                <div>
                  <strong>{slaPercent}%</strong>
                  <span>dentro do SLA</span>
                </div>
              </div>
            </div>
            <div className="prototype-owner-list">
              {ownerLoad.map((owner) => (
                <div key={owner.name}>
                  <span><i className={`dot dot-${owner.tone}`}/>{owner.name}</span>
                  <strong>{owner.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="prototype-task-card">
            <div className="prototype-task-top">
              <div>
                <span className="eyebrow eyebrow-light">CHECKLIST CRÍTICO</span>
                <h3 className="section-title section-title-light">Prioridades da rodada</h3>
              </div>
              <strong>{priority.length}/4</strong>
            </div>
            <div className="prototype-task-progress">
              <span>{attentionCount} itens sensíveis</span>
              <div className="prototype-task-track"><i style={{ width: `${Math.max(26, Math.min(100, attentionCount * 20))}%` }}/></div>
            </div>
            <div className="prototype-task-list">
              {priority.map((event) => (
                <button key={event.id} onClick={() => onEvent(event)}>
                  <span className="prototype-task-icon"><Icon name={event.sla === "Atrasado" ? "alert" : "clock"} size={14}/></span>
                  <span className="prototype-task-copy">
                    <strong>{event.associate}</strong>
                    <small>{event.id} · {stageMeta.find((stage) => stage.key === event.stage)?.label}</small>
                  </span>
                  <StatusChip type={event.sla === "Atrasado" ? "danger" : "warning"}>{event.sla}</StatusChip>
                </button>
              ))}
            </div>
          </article>

          <article className="prototype-calendar-card">
            <div className="prototype-card-head prototype-card-head-calendar">
              <div>
                <span className="label">AGENDA OPERACIONAL</span>
                <h3 className="card-title">Agenda operacional do dia</h3>
              </div>
              <div className="prototype-calendar-controls">
                <span>Outubro</span>
                <button className="icon-button icon-button-plain" aria-label="Abrir esteira" onClick={() => onNavigate("Esteira")}><Icon name="calendar" size={15}/></button>
              </div>
            </div>
            <div className="prototype-calendar-grid">
              {agendaItems.map((item) => (
                <div key={item.time} className="prototype-agenda-row">
                  <span className="prototype-agenda-time">{item.time}</span>
                  <div className={`prototype-agenda-card prototype-agenda-${item.accent}`}>
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                    <div className="prototype-agenda-chips">
                      {item.chips.map((chip) => <span key={chip}>{chip}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="prototype-bottom-grid">
        <article className="panel prototype-stage-panel">
          <PanelHeader title="Fluxo operacional" description="Etapas clicáveis com leitura rápida e responsiva." action={<button className="text-link" onClick={() => onNavigate("Esteira")}>Abrir esteira <Icon name="arrow" size={14}/></button>}/>
          <div className="prototype-stage-grid">
            {stageMeta.map((stage) => (
              <button key={stage.key} className="prototype-stage-mini" onClick={() => onStage(stage.key)}>
                <div>
                  <span className="caption">{stage.helper}</span>
                  <strong>{stage.label}</strong>
                </div>
                <div className="prototype-stage-mini-foot">
                  <span>{counts[stage.key]}</span>
                  {attentions[stage.key] > 0 ? <small>{attentions[stage.key]} atenção</small> : <small>ok</small>}
                </div>
              </button>
            ))}
          </div>
        </article>

        <article className="panel prototype-routines-panel">
          <PanelHeader title="Ações de um clique" description="Mantive as rotinas e deixei o acesso mais nobre." action={<button className="button button-dark" onClick={onAssistant}><Icon name="command" size={14}/>Abrir agente</button>}/>
          <div className="prototype-routine-list">
            {compactRoutines.map((routine) => (
              <button key={routine.title} className="prototype-routine-item" onClick={() => onRoutine(routine.action)}>
                <span className="quick-icon"><Icon name={routine.icon} size={16}/></span>
                <span>
                  <strong>{routine.title}</strong>
                  <small>{routine.description}</small>
                </span>
                <Icon name="arrow" size={14}/>
              </button>
            ))}
          </div>
        </article>

        <article className="panel prototype-live-panel">
          <PanelHeader title="Leitura ao vivo" description="Sinais relevantes sem poluir a interface."/>
          <div className="prototype-live-list">
            {liveItems.map((item) => (
              <div key={item.title} className="prototype-live-item">
                <span className="activity-icon"><Icon name={item.icon} size={15}/></span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function StageGrid({ counts, attentions, onSelect, selected }: { counts: Record<Stage, number>; attentions: Record<Stage, number>; onSelect: (stage: Stage) => void; selected?: Stage | "Todos" }) {
  return (
    <div className="stage-grid">
      {stageMeta.map((stage) => (
        <button key={stage.key} className={`stage-card ${selected === stage.key ? "is-selected" : ""}`} onClick={() => onSelect(stage.key)}>
          <div className="stage-card-head"><span className="card-title">{stage.label}</span>{attentions[stage.key] > 0 ? <span className="attention-pill">{attentions[stage.key]}</span> : <Icon name="check" size={14}/>}</div>
          <strong className="stage-count">{counts[stage.key]}</strong>
          <div className="stage-card-foot"><span className="caption">{stage.helper}</span><Icon name="arrow" size={14}/></div>
        </button>
      ))}
    </div>
  );
}

function PipelineView({ counts, attentions, selectedStage, onSelectStage, events, query, onQuery, onEvent, onReset }: {
  counts: Record<Stage, number>;
  attentions: Record<Stage, number>;
  selectedStage: Stage | "Todos";
  onSelectStage: (stage: Stage | "Todos") => void;
  events: EventItem[];
  query: string;
  onQuery: (value: string) => void;
  onEvent: (event: EventItem) => void;
  onReset: () => void;
}) {
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const sensitive = Object.values(attentions).reduce((sum, value) => sum + value, 0);
  const selectedLabel = selectedStage === "Todos" ? "Todos os eventos" : stageMeta.find((stage) => stage.key === selectedStage)?.label;
  return (
    <div className="workspace-view pipeline-workspace">
      <section className="workspace-bento pipeline-hero-bento">
        <article className="panel workspace-hero-card pipeline-hero-card">
          <div className="workspace-hero-copy">
            <span className="eyebrow">ESTEIRA AO VIVO</span>
            <h2 className="workspace-display-title">Volume primeiro. Detalhe quando importa.</h2>
            <p className="description">A fila inteira continua navegável, mas a leitura começa por quantidades, gargalos e próximas decisões.</p>
          </div>
          <div className="workspace-hero-metrics">
            <div><span className="label">NA ESTEIRA</span><strong>{total}</strong><small>eventos visíveis</small></div>
            <div><span className="label">ATENÇÕES</span><strong>{sensitive}</strong><small>risco ou atraso</small></div>
            <div><span className="label">FILTRO</span><strong>{events.length}</strong><small>{selectedLabel}</small></div>
          </div>
        </article>
        <article className="panel pipeline-radar-card">
          <div className="workspace-card-top"><div><span className="label">SLA RADAR</span><h3 className="card-title">Pontos de atenção</h3></div><span className="prototype-badge">tempo real</span></div>
          <div className="pipeline-radar-donut" style={{ ["--radar" as string]: `${Math.min(100, Math.max(12, Math.round((sensitive / Math.max(total, 1)) * 100)))}%` } as React.CSSProperties}>
            <div><strong>{sensitive}</strong><span>itens críticos</span></div>
          </div>
        </article>
      </section>

      <section className="panel pipeline-stage-board">
        <div className="workspace-section-head">
          <div><h2 className="section-title">Etapas da operação</h2><p className="description">Selecione uma etapa para filtrar a fila sem perder contexto.</p></div>
          {selectedStage !== "Todos" ? <button className="text-link" onClick={onReset}>Limpar filtro <Icon name="close" size={14}/></button> : null}
        </div>
        <div className="pipeline-stage-strip">
          {stageMeta.map((stage) => (
            <button key={stage.key} className={`pipeline-stage-tile ${selectedStage === stage.key ? "active" : ""}`} onClick={() => onSelectStage(stage.key)}>
              <span className="caption">{stage.helper}</span>
              <strong>{counts[stage.key]}</strong>
              <span className="pipeline-stage-label">{stage.label}</span>
              <small>{attentions[stage.key] ? `${attentions[stage.key]} atenção` : "fluxo normal"}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="panel table-panel pipeline-table-panel">
        <div className="table-toolbar">
          <div><span className="eyebrow">FILA OPERACIONAL</span><h2 className="section-title">{selectedLabel}</h2><p className="description">{events.length} registros ordenados para consulta e ação.</p></div>
          <div className="toolbar-actions">
            <label className="search-field"><Icon name="search" size={15}/><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Buscar evento, placa ou associado"/></label>
            <button className="icon-button" aria-label="Limpar filtros" onClick={onReset}><Icon name="filter" size={16}/></button>
          </div>
        </div>
        <EventTable events={events} onEvent={onEvent}/>
      </section>
    </div>
  );
}

function EventTable({ events, onEvent }: { events: EventItem[]; onEvent: (event: EventItem) => void }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr><th>Evento</th><th>Associado</th><th>Veículo</th><th>Etapa</th><th>SLA</th><th>Responsável</th><th>Atualização</th><th></th></tr></thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} onClick={() => onEvent(event)}>
              <td data-label="Evento"><strong>{event.id}</strong></td>
              <td data-label="Associado"><strong>{event.associate}</strong><small>{event.city}</small></td>
              <td data-label="Veículo"><strong>{event.vehicle}</strong><small>{event.plate}</small></td>
              <td data-label="Etapa"><span className="plain-chip">{stageMeta.find((stage) => stage.key === event.stage)?.label}</span></td>
              <td data-label="SLA"><StatusChip type={event.sla === "Atrasado" ? "danger" : event.sla === "Risco" ? "warning" : "success"}>{event.sla}</StatusChip></td>
              <td data-label="Responsável">{event.owner}</td>
              <td data-label="Atualização"><span className="caption">{event.updated}</span></td>
              <td><button className="icon-button icon-button-plain" aria-label={`Abrir ${event.id}`} onClick={(clickEvent: MouseEvent<HTMLButtonElement>) => { clickEvent.stopPropagation(); onEvent(event); }}><Icon name="chevron" size={15}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {events.length === 0 ? <div className="empty-state"><Icon name="search" size={22}/><h3 className="card-title">Nenhum evento encontrado</h3><p className="description">Ajuste o filtro ou a busca para continuar.</p></div> : null}
    </div>
  );
}

function AssociatesView({ associates, onNew, onAction }: { associates: AssociateItem[]; onNew: () => void; onAction: (message: string) => void }) {
  const featured = associates[0];
  const active = associates.filter((item) => item.status === "Ativo").length;
  const pending = associates.filter((item) => item.status === "Pendente").length;
  return (
    <div className="workspace-view associates-workspace">
      <section className="workspace-bento associates-bento">
        <article className="panel associates-feature-card">
          <div className="workspace-card-top"><div><span className="label">CADASTRO EM FOCO</span><h3 className="card-title">Associado acompanhado</h3></div><button className="icon-button icon-button-plain" onClick={onNew} aria-label="Novo associado"><Icon name="userPlus" size={16}/></button></div>
          <div className="associates-feature-photo"><img src="/member-main.jpg" alt="Associado em destaque"/><div><strong>{featured?.name || "Marina Costa"}</strong><small>{featured?.vehicle || "Jeep Compass"} · {featured?.plate || "RTA-8D21"}</small></div></div>
          <div className="associates-feature-meta"><span><Icon name="pin" size={14}/>{featured?.city || "São Paulo, SP"}</span><span><Icon name="phone" size={14}/>{featured?.phone || "(11) 99942-3810"}</span></div>
        </article>
        <article className="panel associates-kpi-card associates-kpi-wide">
          <div className="workspace-card-top"><div><span className="label">BASE OPERACIONAL</span><h3 className="card-title">Saúde cadastral</h3></div><span className="prototype-badge">sincronizado</span></div>
          <div className="associates-kpi-grid">
            <div><strong>{associates.length}</strong><span>Total da base</span><small>registros disponíveis</small></div>
            <div><strong>{active}</strong><span>Ativos</span><small>cadastros regulares</small></div>
            <div><strong>{pending}</strong><span>Pendentes</span><small>precisam de revisão</small></div>
            <div><strong>{Math.max(0, associates.length - active - pending)}</strong><span>Inativos</span><small>fora do fluxo atual</small></div>
          </div>
          <div className="associates-health-bar"><i style={{ width: `${associates.length ? Math.round((active / associates.length) * 100) : 0}%` }}/></div>
        </article>
        <article className="panel associates-action-card">
          <div><span className="eyebrow">AÇÃO RÁPIDA</span><h3 className="section-title">Cadastre sem interromper a operação.</h3><p className="description">O novo associado entra na base e já fica disponível para abertura de evento.</p></div>
          <button className="button button-yellow" onClick={onNew}><Icon name="userPlus" size={15}/>Cadastrar associado</button>
        </article>
      </section>

      <section className="panel associates-list-panel">
        <div className="workspace-section-head"><div><h2 className="section-title">Base de associados</h2><p className="description">Cards compactos, mesma altura e leitura rápida em qualquer tela.</p></div><button className="button button-dark" onClick={onNew}><Icon name="plus" size={14}/>Novo cadastro</button></div>
        <div className="associate-grid associate-grid-prototype">
          {associates.map((item, index) => (
            <article className={`associate-card associate-card-prototype ${index === 0 ? "featured" : ""}`} key={item.id}>
              <div className="associate-card-head"><span className="associate-avatar">{index === 0 ? <img src="/member-avatar.jpg" alt=""/> : item.name.split(" ").slice(0,2).map((word) => word[0]).join("")}</span><StatusChip type={item.status === "Ativo" ? "success" : item.status === "Pendente" ? "warning" : "neutral"}>{item.status}</StatusChip></div>
              <div><h3 className="card-title">{item.name}</h3><p className="description">{item.id} · {item.cpf}</p></div>
              <div className="associate-meta"><span><Icon name="car" size={14}/><span><strong>{item.vehicle}</strong><small>{item.plate}</small></span></span><span><Icon name="pin" size={14}/><span><strong>{item.city}</strong><small>{item.updated}</small></span></span></div>
              <div className="associate-card-foot"><span className="caption">{item.phone}</span><button className="icon-button icon-button-plain" aria-label="Abrir cadastro" onClick={() => onAction(`Cadastro de ${item.name} selecionado.`)}><Icon name="arrow" size={15}/></button></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProvidersView({ onAction }: { onAction: (message: string) => void }) {
  const average = Math.round(providers.reduce((sum, item) => sum + item.load, 0) / providers.length);
  const best = [...providers].sort((a,b) => a.load - b.load)[0];
  return (
    <div className="workspace-view providers-workspace">
      <section className="workspace-bento providers-bento">
        <article className="panel workspace-hero-card providers-hero-card"><div className="workspace-hero-copy"><span className="eyebrow">REDE CREDENCIADA</span><h2 className="workspace-display-title">Distribua pela combinação certa de prazo e capacidade.</h2><p className="description">A rede aparece como uma decisão operacional, não como uma lista solta de prestadores.</p></div><div className="workspace-hero-metrics"><div><span className="label">REDE</span><strong>{providers.length}</strong><small>prestadores ativos</small></div><div><span className="label">OCUPAÇÃO</span><strong>{average}%</strong><small>média agora</small></div><div><span className="label">MELHOR PRAZO</span><strong>{best.eta}</strong><small>{best.name}</small></div></div></article>
        <article className="panel providers-capacity-card"><div className="workspace-card-top"><div><span className="label">CAPACIDADE</span><h3 className="card-title">Distribuição atual</h3></div><Icon name="network" size={18}/></div><div className="providers-capacity-ring" style={{ ["--capacity" as string]: `${average}%` } as React.CSSProperties}><div><strong>{average}%</strong><span>ocupação média</span></div></div></article>
      </section>
      <section className="provider-grid provider-grid-prototype">
        {providers.map((provider, index) => (
          <article className={`panel provider-card provider-card-prototype ${index === 0 ? "provider-featured" : ""}`} key={provider.name}>
            <div className="provider-head"><span className="provider-icon"><Icon name="building" size={18}/></span><span className="prototype-badge">{provider.eta}</span></div>
            <div><h3 className="card-title">{provider.name}</h3><p className="description">{provider.specialty}</p></div>
            <div className="provider-location"><Icon name="pin" size={14}/><span className="caption">{provider.city}</span></div>
            <div className="capacity-block"><div><span className="label">CAPACIDADE</span><strong>{provider.load}%</strong></div><div className="progress-track compact"><i style={{ width: `${provider.load}%` }}/></div></div>
            <div className="provider-stats"><span><small>Prazo</small><strong>{provider.eta}</strong></span><span><small>Nota</small><strong>{provider.score}</strong></span><span><small>Em curso</small><strong>{provider.jobs}</strong></span></div>
            <button className="button button-light" onClick={() => onAction(`${provider.name}: capacidade ${provider.load}% e prazo ${provider.eta}.`)}>Ver prestador <Icon name="arrow" size={14}/></button>
          </article>
        ))}
      </section>
    </div>
  );
}

function DocumentsView({ onRoutine, onAction }: { onRoutine: (action: string) => void; onAction: (message: string) => void }) {
  const pending = documents.filter((item) => item.status === "Pendente" || item.status === "Atrasado").length;
  const received = documents.filter((item) => item.status === "Recebido").length;
  return (
    <div className="workspace-view documents-workspace">
      <section className="workspace-bento documents-bento">
        <article className="panel documents-hero-card"><div><span className="eyebrow">DOCUMENTAÇÃO OPERACIONAL</span><h2 className="workspace-display-title">Pendência visível. Cobrança simples.</h2><p className="description">O painel separa o que precisa de cobrança, conferência e decisão, sem abrir planilhas paralelas.</p></div><button className="button button-dark" onClick={() => onRoutine("Cobrar documentos pendentes")}><Icon name="send" size={14}/>Cobrar pendências</button></article>
        <article className="panel documents-score-card"><span className="label">COMPLETUDE</span><div className="documents-score"><strong>86%</strong><span>média da base</span></div><div className="progress-track"><i style={{ width: "86%" }}/></div></article>
        <article className="panel documents-mini-card"><span className="label">PENDÊNCIAS</span><strong>{pending}</strong><small>exigem retorno</small></article>
        <article className="panel documents-mini-card documents-mini-yellow"><span className="label">RECEBIDOS</span><strong>{received}</strong><small>prontos para seguir</small></article>
      </section>
      <section className="panel documents-list-panel"><div className="workspace-section-head"><div><h2 className="section-title">Fila documental</h2><p className="description">Mesma altura, status claro e ação direta em cada linha.</p></div><span className="prototype-badge">{documents.length} documentos</span></div><div className="document-list document-list-prototype">{documents.map((doc) => (<button className="document-row document-row-prototype" key={`${doc.event}-${doc.item}`} onClick={() => onAction(`${doc.item} de ${doc.event} selecionado.`)}><span className="document-icon"><Icon name="file" size={17}/></span><span><strong>{doc.item}</strong><small>{doc.event} · {doc.associate}</small></span><span className="caption">{doc.age}</span><StatusChip type={doc.status === "Atrasado" ? "danger" : doc.status === "Pendente" ? "warning" : doc.status === "Recebido" ? "success" : "neutral"}>{doc.status}</StatusChip><Icon name="chevron" size={15}/></button>))}</div></section>
    </div>
  );
}

function RoutinesView({ onRoutine, onAssistant }: { onRoutine: (action: string) => void; onAssistant: () => void }) {
  const primary = routines.slice(0, 4);
  const secondary = routines.slice(4);
  return (
    <div className="workspace-view routines-workspace-v2">
      <section className="routines-dashboard-grid">
        <article className="panel routines-list-card">
          <div className="workspace-card-top"><div><span className="label">AÇÕES RÁPIDAS</span><h3 className="card-title">Rotinas recorrentes</h3><p className="description">Execução direta, sem blocos gigantes.</p></div><span className="prototype-badge">1 clique</span></div>
          <div className="routines-list-v2">{primary.map((routine) => (<button key={routine.title} onClick={() => onRoutine(routine.action)}><span className="quick-icon"><Icon name={routine.icon} size={16}/></span><span><strong>{routine.title}</strong><small>{routine.description}</small></span><Icon name="arrow" size={14}/></button>))}</div>
        </article>

        <article className="routines-agent-card">
          <div className="routines-agent-top"><span className="assistant-mark"><Icon name="command" size={19}/></span><StatusChip type="success">Online</StatusChip></div>
          <div className="routines-agent-copy"><span className="eyebrow eyebrow-light">AGENTE VELOCE</span><h2>Seu copiloto operacional.</h2><p>Peça para cobrar, revisar, mover, gerar um resumo ou abrir um cadastro sem trocar de tela.</p></div>
          <div className="routines-agent-prompts"><button onClick={onAssistant}><span>Quais SLAs estão em risco?</span><Icon name="arrow" size={14}/></button><button onClick={onAssistant}><span>Resumo de pendências críticas</span><Icon name="arrow" size={14}/></button></div>
          <button className="button button-yellow routines-agent-cta" onClick={onAssistant}><Icon name="command" size={15}/>Abrir agente</button>
        </article>

        <article className="panel routines-check-card">
          <div className="workspace-card-top"><div><span className="label">CHECKLIST</span><h3 className="card-title">Próximas automações</h3></div><strong className="routines-count">2/6</strong></div>
          <div className="routines-progress"><i/></div>
          <div className="routines-check-list">{routines.map((routine, index) => (<button key={routine.title} onClick={() => onRoutine(routine.action)}><span className={`routines-check-icon ${index < 2 ? "done" : ""}`}>{index < 2 ? <Icon name="check" size={13}/> : <Icon name={routine.icon} size={13}/>}</span><span><strong>{routine.title}</strong><small>{index < 2 ? "Rotina revisada" : "Disponível para executar"}</small></span><Icon name="chevron" size={13}/></button>))}</div>
        </article>
      </section>

      <section className="panel routines-bottom-strip">
        <div><span className="label">AUTOMAÇÕES HOJE</span><strong>18</strong><small>execuções registradas</small></div>
        <div><span className="label">TEMPO POUPADO</span><strong>3.4h</strong><small>estimativa operacional</small></div>
        <div><span className="label">SEM INTERVENÇÃO</span><strong>82%</strong><small>fluxos concluídos</small></div>
        {secondary.map((routine) => (<button key={routine.title} onClick={() => onRoutine(routine.action)}><span className="quick-icon"><Icon name={routine.icon} size={16}/></span><span><strong>{routine.title}</strong><small>{routine.description}</small></span><Icon name="arrow" size={14}/></button>))}
      </section>
    </div>
  );
}

function AssistantView({ messages, input, onInput, onSend, busy, onRoutine, activeCount, riskCount, overdueCount, associates }: {
  messages: Message[];
  input: string;
  onInput: (value: string) => void;
  onSend: (value: string) => void;
  busy: boolean;
  onRoutine: (action: string) => void;
  activeCount: number;
  riskCount: number;
  overdueCount: number;
  associates: number;
}) {
  function submit(event: FormEvent) { event.preventDefault(); onSend(input); }
  const actions: Array<[string, string, IconName, string]> = [
    ["Cadastrar associado", "Abre o cadastro e atualiza a base", "userPlus", "Cadastrar novo associado"],
    ["Cobrar documentos", "Organiza as pendências para ação", "documentCheck", "Cobrar documentos pendentes"],
    ["Revisar SLA", "Prioriza risco e atraso", "clock", "Revisar SLAs críticos"],
    ["Gerar relatório", "Consolida a operação atual", "report", "Gerar relatório operacional"],
  ];
  return (
    <div className="workspace-view assistant-workspace-v2">
      <section className="assistant-command-grid">
        <article className="assistant-command-hero">
          <div className="assistant-command-top"><span className="assistant-mark"><Icon name="command" size={20}/></span><StatusChip type="success">Contexto sincronizado</StatusChip></div>
          <div className="assistant-command-copy"><span className="eyebrow eyebrow-light">AGENTE OPERACIONAL</span><h2>Converse com a operação.</h2><p>O agente consulta o contexto, executa comandos locais e usa a automação externa quando ela estiver configurada.</p></div>
          <div className="assistant-command-kpis"><div><strong>{activeCount}</strong><span>eventos ativos</span></div><div><strong>{riskCount}</strong><span>em risco</span></div><div><strong>{overdueCount}</strong><span>atrasados</span></div><div><strong>{associates}</strong><span>associados</span></div></div>
        </article>
        <article className="panel assistant-operator-card"><div className="assistant-operator-photo"><img src="/member-main.jpg" alt="Operação Veloce"/></div><div><span className="label">CONTEXTO HUMANO</span><h3 className="card-title">Operação + IA, sem perder controle.</h3><p className="description">A experiência mantém decisões importantes visíveis e acionáveis.</p></div></article>
      </section>

      <section className="assistant-layout assistant-layout-v2">
        <article className="panel chat-panel chat-panel-v2">
          <div className="chat-topbar"><div><span className="eyebrow">CONVERSA OPERACIONAL</span><h2 className="section-title">Comando em linguagem natural</h2><p className="description">Ex.: “mover EV-2848 para Vistoria” ou “gerar relatório operacional”.</p></div><StatusChip type="success">Online</StatusChip></div>
          <div className="chat-messages">{messages.map((message) => (<div className={`chat-message ${message.role}`} key={message.id}><span className="chat-role">{message.role === "assistant" ? <Icon name="command" size={14}/> : "Você"}</span><p>{message.text}</p></div>))}{busy ? <div className="chat-message assistant"><span className="chat-role"><Icon name="refresh" size={14}/></span><p className="typing">Processando solicitação</p></div> : null}</div>
          <form className="chat-form" onSubmit={submit}><div className="chat-input-wrap"><Icon name="message" size={16}/><input value={input} onChange={(event) => onInput(event.target.value)} placeholder="Digite uma ação ou pergunta operacional"/></div><button className="button button-yellow" type="submit" disabled={!input.trim() || busy}><Icon name="send" size={14}/>Executar</button></form>
        </article>
        <aside className="assistant-side assistant-side-v2"><section className="panel agent-actions-card"><PanelHeader title="Ações disponíveis" description="Atalhos para comandos recorrentes."/><div className="agent-actions">{actions.map(([title, detail, icon, action]) => (<button className="agent-action" key={title} onClick={() => onRoutine(action)}><span className="agent-action-icon"><Icon name={icon} size={16}/></span><span><strong>{title}</strong><small>{detail}</small></span><Icon name="chevron" size={14}/></button>))}</div></section></aside>
      </section>
    </div>
  );
}

function EventDrawer({ event, onClose, onMove }: { event: EventItem; onClose: () => void; onMove: (id: string, stage: Stage) => void }) {
  return (
    <div className="overlay" onMouseDown={(e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="drawer">
        <div className="drawer-head"><div><span className="eyebrow">DETALHE DO EVENTO</span><h2 className="section-title">{event.id}</h2><p className="description">{event.associate} · {event.vehicle}</p></div><button className="icon-button" onClick={onClose} aria-label="Fechar"><Icon name="close" size={17}/></button></div>
        <div className="drawer-status"><StatusChip type={event.sla === "Atrasado" ? "danger" : event.sla === "Risco" ? "warning" : "success"}>{event.sla}</StatusChip><span className="plain-chip">{stageMeta.find((stage) => stage.key === event.stage)?.label}</span></div>
        <div className="drawer-grid">
          <span><small className="label">VEÍCULO</small><strong>{event.vehicle}</strong><small className="caption">{event.plate}</small></span>
          <span><small className="label">LOCAL</small><strong>{event.city}</strong><small className="caption">{event.updated}</small></span>
          <span><small className="label">RESPONSÁVEL</small><strong>{event.owner}</strong><small className="caption">Operação</small></span>
          <span><small className="label">SLA</small><strong>{event.sla}</strong><small className="caption">Situação atual</small></span>
        </div>
        <div className="drawer-section"><h3 className="card-title">Mover etapa</h3><div className="stage-options">{stageMeta.map((stage) => <button key={stage.key} className={event.stage === stage.key ? "active" : ""} onClick={() => onMove(event.id, stage.key)}>{stage.label}</button>)}</div></div>
        <div className="drawer-section"><h3 className="card-title">Linha do tempo</h3><div className="timeline"><div><i/><span><strong>Última atualização</strong><small>{event.updated}</small></span></div><div><i/><span><strong>Etapa atual</strong><small>{stageMeta.find((stage) => stage.key === event.stage)?.label}</small></span></div><div><i/><span><strong>Evento criado</strong><small>Hoje · 08:42</small></span></div></div></div>
      </aside>
    </div>
  );
}

function AssociateModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: Omit<AssociateItem, "id" | "updated">) => void }) {
  const [form, setForm] = useState({ name: "", cpf: "", phone: "", email: "", vehicle: "", plate: "", city: "", status: "Ativo" as AssociateStatus });
  function submit(event: FormEvent) { event.preventDefault(); if (!form.name.trim() || !form.plate.trim()) return; onSubmit(form); }
  return (
    <div className="overlay modal-overlay" onMouseDown={(e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head"><div><span className="eyebrow">NOVO CADASTRO</span><h2 className="section-title">Cadastrar associado</h2><p className="description">O registro entra na base assim que você salvar.</p></div><button className="icon-button" type="button" onClick={onClose}><Icon name="close" size={17}/></button></div>
        <div className="form-grid">
          <Field label="Nome completo" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required/>
          <Field label="CPF" value={form.cpf} onChange={(value) => setForm({ ...form, cpf: value })}/>
          <Field label="WhatsApp" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })}/>
          <Field label="E-mail" value={form.email} onChange={(value) => setForm({ ...form, email: value })}/>
          <Field label="Veículo" value={form.vehicle} onChange={(value) => setForm({ ...form, vehicle: value })}/>
          <Field label="Placa" value={form.plate} onChange={(value) => setForm({ ...form, plate: value.toUpperCase() })} required/>
          <Field label="Cidade / UF" value={form.city} onChange={(value) => setForm({ ...form, city: value })}/>
          <label className="field"><span className="label">Status</span><select value={form.status} onChange={(event: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, status: event.target.value as AssociateStatus })}><option>Ativo</option><option>Pendente</option><option>Inativo</option></select></label>
        </div>
        <div className="modal-actions"><button className="button button-light" type="button" onClick={onClose}>Cancelar</button><button className="button button-dark" type="submit">Salvar associado</button></div>
      </form>
    </div>
  );
}

function EventModal({ associates, onClose, onSubmit }: { associates: AssociateItem[]; onClose: () => void; onSubmit: (data: Omit<EventItem, "id" | "updated">) => void }) {
  const [form, setForm] = useState({ associate: associates[0]?.name || "", vehicle: associates[0]?.vehicle || "", plate: associates[0]?.plate || "", city: associates[0]?.city || "", stage: "Entrada" as Stage, sla: "Dentro" as Sla, owner: "Nina" });
  function pickAssociate(name: string) { const item = associates.find((associate) => associate.name === name); setForm({ ...form, associate: name, vehicle: item?.vehicle || "", plate: item?.plate || "", city: item?.city || "" }); }
  function submit(event: FormEvent) { event.preventDefault(); if (!form.associate.trim()) return; onSubmit(form); }
  return (
    <div className="overlay modal-overlay" onMouseDown={(e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head"><div><span className="eyebrow">NOVA OPERAÇÃO</span><h2 className="section-title">Criar evento</h2><p className="description">O evento entra na esteira imediatamente após salvar.</p></div><button className="icon-button" type="button" onClick={onClose}><Icon name="close" size={17}/></button></div>
        <div className="form-grid">
          <label className="field field-span-2"><span className="label">Associado</span><select value={form.associate} onChange={(event: ChangeEvent<HTMLSelectElement>) => pickAssociate(event.target.value)}>{associates.map((associate) => <option key={associate.id}>{associate.name}</option>)}</select></label>
          <Field label="Veículo" value={form.vehicle} onChange={(value) => setForm({ ...form, vehicle: value })}/>
          <Field label="Placa" value={form.plate} onChange={(value) => setForm({ ...form, plate: value.toUpperCase() })}/>
          <Field label="Cidade / UF" value={form.city} onChange={(value) => setForm({ ...form, city: value })}/>
          <label className="field"><span className="label">Responsável</span><select value={form.owner} onChange={(event: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, owner: event.target.value })}><option>Nina</option><option>Larissa</option><option>André</option></select></label>
        </div>
        <div className="modal-actions"><button className="button button-light" type="button" onClick={onClose}>Cancelar</button><button className="button button-dark" type="submit">Criar evento</button></div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="field"><span className="label">{label}</span><input value={value} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)} required={required}/></label>;
}

function SearchDialog({ query, onQuery, results, onClose, inputRef }: { query: string; onQuery: (value: string) => void; results: Array<{ kind: string; title: string; detail: string; icon: IconName; action: () => void }>; onClose: () => void; inputRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div className="overlay search-overlay" onMouseDown={(e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="search-dialog">
        <div className="search-dialog-input"><Icon name="search" size={18}/><input ref={inputRef} value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => onQuery(event.target.value)} placeholder="Buscar evento, associado ou placa"/><button onClick={onClose}>ESC</button></div>
        <div className="search-results">
          {!query ? <div className="search-empty"><Icon name="command" size={20}/><h3 className="card-title">Busca rápida</h3><p className="description">Digite um nome, placa ou identificador.</p></div> : null}
          {query && results.length === 0 ? <div className="search-empty"><Icon name="search" size={20}/><h3 className="card-title">Nenhum resultado</h3><p className="description">Tente outro termo.</p></div> : null}
          {results.map((result, index) => <button key={`${result.kind}-${result.title}-${index}`} onClick={() => { result.action(); onClose(); }}><span className="search-icon"><Icon name={result.icon} size={16}/></span><span><strong>{result.title}</strong><small>{result.kind} · {result.detail}</small></span><Icon name="chevron" size={14}/></button>)}
        </div>
      </div>
    </div>
  );
}
