"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

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

const EVENT_STORAGE = "veloce-premium-events";
const ASSOCIATE_STORAGE = "veloce-premium-associates";
const CHANNEL_NAME = "veloce-premium-live";

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
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    flow: <><path d="M4 6h16"/><path d="M4 12h10"/><path d="M4 18h16"/><circle cx="17" cy="12" r="3"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    network: <><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M12 7.5v4"/><path d="m12 11.5-5.2 4.2"/><path d="m12 11.5 5.2 4.2"/></>,
    file: <><path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/></>,
    bolt: <path d="m13 2-8 11h7l-1 9 8-12h-7z"/>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.5-4.5A8 8 0 1 1 21 15Z"/><path d="M8 10h8M8 14h5"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    filter: <><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></>,
    car: <><path d="m5 11 2-5h10l2 5"/><rect x="3" y="11" width="18" height="7" rx="2"/><circle cx="7" cy="18" r="1"/><circle cx="17" cy="18" r="1"/></>,
    shield: <><path d="M12 3 4.5 6v5c0 5 3.2 8.2 7.5 10 4.3-1.8 7.5-5 7.5-10V6Z"/><path d="m9 12 2 2 4-4"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    trend: <><path d="M4 18 10 12l4 4 6-8"/><path d="M16 8h4v4"/></>,
    refresh: <><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M6.1 8a7 7 0 0 1 11.2-1.8L20 12"/><path d="M17.9 16a7 7 0 0 1-11.2 1.8L4 12"/></>,
    phone: <path d="M7 3 4 5c0 8.3 6.7 15 15 15l2-3-5-3-2 2c-3-1.2-5.8-4-7-7l2-2Z"/>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>,
    documentCheck: <><path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5"/><path d="m9 15 2 2 4-4"/></>,
    alert: <><path d="M12 3 2.7 19h18.6Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
    report: <><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></>,
    scan: <><path d="M8 3H4a1 1 0 0 0-1 1v4"/><path d="M16 3h4a1 1 0 0 1 1 1v4"/><path d="M8 21H4a1 1 0 0 1-1-1v-4"/><path d="M16 21h4a1 1 0 0 0 1-1v-4"/><path d="M7 12h10"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-3v-.09a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7 14.69a1.7 1.7 0 0 0-1.56-1.04H5.3v-3h.14A1.7 1.7 0 0 0 7 9.61a1.7 1.7 0 0 0-.34-1.88L6.6 7.67 8.72 5.55l.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.04-1.56V4.3h3v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.04h.14v3h-.14A1.7 1.7 0 0 0 19.4 15Z"/></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
    command: <><path d="M9 6V4a2 2 0 1 0-2 2h10a2 2 0 1 0-2-2v16a2 2 0 1 0 2-2H7a2 2 0 1 0 2 2Z"/></>,
    activity: <path d="M3 12h4l2-6 4 12 2-6h6"/>,
    userPlus: <><path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M19 8v6"/><path d="M16 11h6"/></>,
    building: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/></>,
    route: <><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a4 4 0 0 0 4-4v-4a4 4 0 0 1 3-4"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    download: <><path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
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
    { id: "m-1", role: "assistant", text: "A operação está carregada. Posso consultar a fila, revisar SLAs, cobrar documentos, abrir cadastros e executar rotinas sem você trocar de tela." },
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

    const lower = value.toLowerCase();
    let localReply = "";
    const eventMatch = value.match(/EV-?\d+/i)?.[0]?.toUpperCase().replace("EV", "EV-").replace("EV--", "EV-");
    const stage = stageMeta.find((item) => lower.includes(item.label.toLowerCase()) || lower.includes(item.key.toLowerCase()));

    if (eventMatch && stage) {
      const exists = events.some((event) => event.id === eventMatch);
      if (exists) {
        moveEvent(eventMatch, stage.key);
        localReply = `${eventMatch} foi atualizado para ${stage.label}. Os quantitativos da esteira já refletem a mudança.`;
      }
    } else if (lower.includes("cadastrar") && lower.includes("associ")) {
      setAssociateModal(true);
      localReply = "Abri o cadastro de associado. Ao salvar, a base e os indicadores são atualizados imediatamente.";
    } else if (lower.includes("novo evento") || (lower.includes("criar") && lower.includes("evento"))) {
      setEventModal(true);
      localReply = "Abri o cadastro de evento. Depois de salvar, ele entra na etapa Entrada e aparece na fila.";
    } else if (lower.includes("sla")) {
      localReply = `Há ${riskCount} eventos em risco e ${overdueCount} atrasados. Posso abrir a esteira filtrada para você.`;
    } else if (lower.includes("document")) {
      localReply = `Há ${docCount} eventos na etapa Documentos. Organizei essa frente como prioridade operacional.`;
    } else if (lower.includes("relat")) {
      downloadReport();
      localReply = "O resumo operacional foi gerado e o arquivo está pronto no navegador.";
    }

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value, context: { activeCount, riskCount, overdueCount, selectedStage } }),
      });
      const data = await response.json();
      const reply = localReply || data?.reply || "Solicitação processada.";
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: reply }]);
    } catch {
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: localReply || "Não consegui alcançar a automação externa agora. Os comandos locais continuam disponíveis." }]);
    } finally {
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
      <section className="app-shell">
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
            <button className="profile-button" aria-label="Perfil"><span>DV</span></button>
            <button className="icon-button mobile-menu" aria-label="Abrir menu" onClick={() => setMobileNav((value) => !value)}><Icon name={mobileNav ? "close" : "menu"} size={18}/></button>
          </div>
        </header>

        <div className="page-shell">
          <header className="page-header">
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
            <AssociatesView associates={associates} onNew={() => setAssociateModal(true)} />
          ) : null}

          {view === "Rede" ? <ProvidersView /> : null}
          {view === "Documentos" ? <DocumentsView onRoutine={handleRoutine} /> : null}
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
  return (
    <div className="dashboard-view">
      <section className="hero-layout">
        <div className="hero-intro">
          <div className="hero-progress">
            <div className="hero-progress-top"><span className="label">FLUXO DO DIA</span><span className="caption">78% dentro do SLA</span></div>
            <div className="progress-track"><i style={{ width: "78%" }}/></div>
          </div>
          <div className="hero-kpis">
            <StatNumber value={activeCount} label="Eventos ativos" detail="em acompanhamento" icon="activity"/>
            <StatNumber value={riskCount + overdueCount} label="Atenções" detail={`${overdueCount} atrasados`} icon="alert"/>
            <StatNumber value={associates.length} label="Associados" detail="base disponível" icon="users"/>
          </div>
        </div>
      </section>

      <section className="stage-section">
        <div className="section-inline-head">
          <div><h2 className="section-title">Fluxo operacional</h2><p className="description">Clique em uma etapa para abrir a fila correspondente.</p></div>
          <button className="text-link" onClick={() => onNavigate("Esteira")}>Ver esteira <Icon name="arrow" size={14}/></button>
        </div>
        <StageGrid counts={counts} attentions={attentions} onSelect={onStage}/>
      </section>

      <section className="bento-grid">
        <article className="panel queue-card">
          <PanelHeader title="Fila prioritária" description="Eventos com risco ou atraso ordenados para ação." action={<button className="icon-button icon-button-plain" aria-label="Abrir esteira" onClick={() => onNavigate("Esteira")}><Icon name="arrow" size={16}/></button>}/>
          <div className="priority-table">
            {priority.map((event) => (
              <button key={event.id} className="priority-row" onClick={() => onEvent(event)}>
                <span className="priority-id">{event.id}</span>
                <span className="priority-main"><strong>{event.associate}</strong><small>{event.vehicle} · {event.plate}</small></span>
                <span className="priority-stage">{stageMeta.find((stage) => stage.key === event.stage)?.label}</span>
                <StatusChip type={event.sla === "Atrasado" ? "danger" : "warning"}>{event.sla}</StatusChip>
                <Icon name="chevron" size={14}/>
              </button>
            ))}
          </div>
        </article>

        <article className="panel workload-card">
          <PanelHeader title="Carga da operação" description="Distribuição dos eventos ativos."/>
          <div className="workload-visual">
            <div className="donut" style={{ "--progress": "74%" } as React.CSSProperties}>
              <div><strong>74%</strong><span>capacidade</span></div>
            </div>
            <div className="workload-list">
              <div><span><i className="dot dot-dark"/>Nina</span><strong>12</strong></div>
              <div><span><i className="dot dot-yellow"/>Larissa</span><strong>9</strong></div>
              <div><span><i className="dot dot-soft"/>André</span><strong>7</strong></div>
            </div>
          </div>
        </article>

        <article className="panel routines-card">
          <PanelHeader title="Ações de um clique" description="Rotinas que normalmente exigem várias etapas."/>
          <div className="quick-actions">
            {routines.slice(0, 4).map((routine) => (
              <button key={routine.title} className="quick-action" onClick={() => onRoutine(routine.action)}>
                <span className="quick-icon"><Icon name={routine.icon} size={17}/></span>
                <span><strong>{routine.title}</strong><small>{routine.description}</small></span>
                <Icon name="arrow" size={14}/>
              </button>
            ))}
          </div>
        </article>

        <article className="assistant-card">
          <div className="assistant-card-top">
            <span className="assistant-mark"><Icon name="command" size={19}/></span>
            <StatusChip type="success">Operação conectada</StatusChip>
          </div>
          <div className="assistant-card-copy">
            <span className="eyebrow eyebrow-light">COMANDO DIRETO</span>
            <h2 className="section-title section-title-light">Resolva sem trocar de tela.</h2>
            <p className="description description-light">Peça para consultar, mover, cobrar, revisar ou gerar um resumo da operação.</p>
          </div>
          <button className="button button-yellow" onClick={onAssistant}><Icon name="message" size={15}/>Abrir agente</button>
        </article>

        <article className="panel live-card">
          <PanelHeader title="Atividade recente" description="Atualizações registradas na operação."/>
          <div className="activity-list">
            <div><span className="activity-icon"><Icon name="check" size={14}/></span><span><strong>EV-2847 enviado para vistoria</strong><small>André · há 8 min</small></span></div>
            <div><span className="activity-icon"><Icon name="file" size={14}/></span><span><strong>Documento recebido em EV-2836</strong><small>Larissa · há 14 min</small></span></div>
            <div><span className="activity-icon"><Icon name="users" size={14}/></span><span><strong>Cadastro de Marina atualizado</strong><small>Base operacional · há 21 min</small></span></div>
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
  return (
    <div>
      <section className="stage-section stage-section-large">
        <div className="section-inline-head">
          <div><h2 className="section-title">Volume por etapa</h2><p className="description">Os cartões continuam legíveis mesmo quando a fila cresce.</p></div>
          {selectedStage !== "Todos" ? <button className="text-link" onClick={onReset}>Limpar filtro <Icon name="close" size={14}/></button> : null}
        </div>
        <StageGrid counts={counts} attentions={attentions} onSelect={onSelectStage} selected={selectedStage}/>
      </section>

      <section className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2 className="section-title">Fila operacional</h2>
            <p className="description">{selectedStage === "Todos" ? "Todos os eventos" : stageMeta.find((stage) => stage.key === selectedStage)?.label} · {events.length} registros</p>
          </div>
          <div className="toolbar-actions">
            <label className="search-field"><Icon name="search" size={15}/><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Buscar evento, placa ou associado"/></label>
            <button className="icon-button" aria-label="Filtros"><Icon name="filter" size={16}/></button>
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
              <td><button className="icon-button icon-button-plain" aria-label={`Abrir ${event.id}`}><Icon name="chevron" size={15}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {events.length === 0 ? <div className="empty-state"><Icon name="search" size={22}/><h3 className="card-title">Nenhum evento encontrado</h3><p className="description">Ajuste o filtro ou a busca para continuar.</p></div> : null}
    </div>
  );
}

function AssociatesView({ associates, onNew }: { associates: AssociateItem[]; onNew: () => void }) {
  return (
    <div>
      <section className="summary-strip">
        <div><span className="label">BASE TOTAL</span><strong>{associates.length}</strong><small>registros disponíveis</small></div>
        <div><span className="label">ATIVOS</span><strong>{associates.filter((item) => item.status === "Ativo").length}</strong><small>cadastros regulares</small></div>
        <div><span className="label">PENDENTES</span><strong>{associates.filter((item) => item.status === "Pendente").length}</strong><small>precisam de revisão</small></div>
      </section>
      <section className="panel table-panel">
        <div className="table-toolbar">
          <div><h2 className="section-title">Base de associados</h2><p className="description">Novos registros aparecem aqui assim que são salvos.</p></div>
          <button className="button button-dark" onClick={onNew}><Icon name="userPlus" size={15}/>Cadastrar associado</button>
        </div>
        <div className="associate-grid">
          {associates.map((item) => (
            <article className="associate-card" key={item.id}>
              <div className="associate-card-head"><span className="associate-avatar">{item.name.split(" ").slice(0,2).map((word) => word[0]).join("")}</span><StatusChip type={item.status === "Ativo" ? "success" : item.status === "Pendente" ? "warning" : "neutral"}>{item.status}</StatusChip></div>
              <div><h3 className="card-title">{item.name}</h3><p className="description">{item.id} · {item.cpf}</p></div>
              <div className="associate-meta">
                <span><Icon name="car" size={14}/><span><strong>{item.vehicle}</strong><small>{item.plate}</small></span></span>
                <span><Icon name="pin" size={14}/><span><strong>{item.city}</strong><small>{item.updated}</small></span></span>
              </div>
              <div className="associate-card-foot"><span className="caption">{item.phone}</span><button className="icon-button icon-button-plain" aria-label="Abrir cadastro"><Icon name="arrow" size={15}/></button></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProvidersView() {
  return (
    <div>
      <section className="summary-strip">
        <div><span className="label">PRESTADORES</span><strong>{providers.length}</strong><small>visíveis no painel</small></div>
        <div><span className="label">OCUPAÇÃO MÉDIA</span><strong>54%</strong><small>capacidade da rede</small></div>
        <div><span className="label">MELHOR PRAZO</span><strong>Hoje</strong><small>vistoria disponível</small></div>
      </section>
      <section className="provider-grid">
        {providers.map((provider) => (
          <article className="panel provider-card" key={provider.name}>
            <div className="provider-head"><span className="provider-icon"><Icon name="building" size={18}/></span><button className="icon-button icon-button-plain" aria-label="Mais opções"><Icon name="more" size={17}/></button></div>
            <div><h3 className="card-title">{provider.name}</h3><p className="description">{provider.specialty}</p></div>
            <div className="provider-location"><Icon name="pin" size={14}/><span className="caption">{provider.city}</span></div>
            <div className="capacity-block"><div><span className="label">CAPACIDADE</span><strong>{provider.load}%</strong></div><div className="progress-track compact"><i style={{ width: `${provider.load}%` }}/></div></div>
            <div className="provider-stats"><span><small>Prazo</small><strong>{provider.eta}</strong></span><span><small>Nota</small><strong>{provider.score}</strong></span><span><small>Em curso</small><strong>{provider.jobs}</strong></span></div>
            <button className="button button-light">Ver prestador <Icon name="arrow" size={14}/></button>
          </article>
        ))}
      </section>
    </div>
  );
}

function DocumentsView({ onRoutine }: { onRoutine: (action: string) => void }) {
  return (
    <div className="documents-layout">
      <section className="panel table-panel">
        <PanelHeader title="Pendências documentais" description="Itens que precisam de validação, cobrança ou conferência." action={<button className="button button-dark" onClick={() => onRoutine("Cobrar documentos pendentes")}><Icon name="send" size={14}/>Cobrar pendências</button>}/>
        <div className="document-list">
          {documents.map((doc) => (
            <div className="document-row" key={`${doc.event}-${doc.item}`}>
              <span className="document-icon"><Icon name="file" size={17}/></span>
              <span><strong>{doc.item}</strong><small>{doc.event} · {doc.associate}</small></span>
              <span className="caption">{doc.age}</span>
              <StatusChip type={doc.status === "Atrasado" ? "danger" : doc.status === "Pendente" ? "warning" : doc.status === "Recebido" ? "success" : "neutral"}>{doc.status}</StatusChip>
              <button className="icon-button icon-button-plain" aria-label="Abrir documento"><Icon name="chevron" size={15}/></button>
            </div>
          ))}
        </div>
      </section>
      <aside className="panel document-summary">
        <PanelHeader title="Resumo" description="Situação da documentação hoje."/>
        <div className="document-kpis">
          <div><span className="metric-value">12</span><span className="metric-label">Pendências</span><span className="caption">aguardando envio</span></div>
          <div><span className="metric-value">4</span><span className="metric-label">Em análise</span><span className="caption">na fila interna</span></div>
          <div><span className="metric-value">86%</span><span className="metric-label">Completude</span><span className="caption">média da base</span></div>
        </div>
      </aside>
    </div>
  );
}

function RoutinesView({ onRoutine, onAssistant }: { onRoutine: (action: string) => void; onAssistant: () => void }) {
  return (
    <div>
      <section className="routine-intro panel">
        <div><span className="eyebrow">TRABALHO OPERACIONAL, SIMPLIFICADO</span><h2 className="section-title">O painel executa o trabalho repetitivo sem esconder o controle.</h2><p className="description">Cada rotina deixa claro o que será feito antes da execução.</p></div>
        <button className="button button-dark" onClick={onAssistant}><Icon name="command" size={15}/>Pedir outra ação</button>
      </section>
      <section className="routine-grid">
        {routines.map((routine) => (
          <button className={`routine-card ${routine.accent ? "routine-card-accent" : ""}`} key={routine.title} onClick={() => onRoutine(routine.action)}>
            <span className="routine-icon"><Icon name={routine.icon} size={19}/></span>
            <span className="routine-copy"><strong className="card-title">{routine.title}</strong><small className="description">{routine.description}</small></span>
            <span className="routine-arrow"><Icon name="arrow" size={15}/></span>
          </button>
        ))}
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
  return (
    <div className="assistant-page">
      <section className="assistant-hero panel">
        <div className="assistant-hero-main"><span className="assistant-mark"><Icon name="command" size={20}/></span><div><span className="eyebrow">AGENTE OPERACIONAL</span><h2 className="section-title">Converse com a operação.</h2><p className="description">O agente consulta o contexto e executa ações disponíveis no painel.</p></div></div>
        <div className="assistant-context"><span className="status-dot"/><div><span className="label">CONTEXTO</span><strong>Sincronizado</strong><small>eventos · associados · documentos · rede</small></div></div>
      </section>

      <section className="assistant-layout">
        <article className="panel chat-panel">
          <div className="chat-topbar"><div><h2 className="section-title">Conversa operacional</h2><p className="description">Comandos objetivos, resultado registrado na mesma sessão.</p></div><StatusChip type="success">Online</StatusChip></div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div className={`chat-message ${message.role}`} key={message.id}>
                <span className="chat-role">{message.role === "assistant" ? <Icon name="command" size={14}/> : "Você"}</span>
                <p>{message.text}</p>
              </div>
            ))}
            {busy ? <div className="chat-message assistant"><span className="chat-role"><Icon name="refresh" size={14}/></span><p className="typing">Processando solicitação</p></div> : null}
          </div>
          <form className="chat-form" onSubmit={submit}>
            <div className="chat-input-wrap"><Icon name="message" size={16}/><input value={input} onChange={(event) => onInput(event.target.value)} placeholder="Ex.: mover EV-2848 para Vistoria"/></div>
            <button className="button button-dark" type="submit" disabled={!input.trim() || busy}><Icon name="send" size={14}/>Enviar</button>
          </form>
        </article>

        <aside className="assistant-side">
          <section className="panel agent-actions-card">
            <PanelHeader title="O que posso executar" description="Atalhos para rotinas frequentes."/>
            <div className="agent-actions">
              {[
                ["Cadastrar associado", "Abre o cadastro e atualiza a base", "userPlus", "Cadastrar novo associado"],
                ["Cobrar documentos", "Organiza as pendências para ação", "documentCheck", "Cobrar documentos pendentes"],
                ["Revisar SLA", "Prioriza risco e atraso", "clock", "Revisar SLAs críticos"],
                ["Gerar relatório", "Consolida a operação atual", "report", "Gerar relatório operacional"],
              ].map(([title, detail, icon, action]) => (
                <button className="agent-action" key={title} onClick={() => onRoutine(action)}>
                  <span className="agent-action-icon"><Icon name={icon as IconName} size={16}/></span>
                  <span><strong>{title}</strong><small>{detail}</small></span>
                  <Icon name="chevron" size={14}/>
                </button>
              ))}
            </div>
          </section>
          <section className="panel agent-context-card">
            <PanelHeader title="Contexto carregado" description="Números usados durante a conversa."/>
            <div className="agent-context-grid">
              <div><strong>{activeCount}</strong><span>Eventos ativos</span></div>
              <div><strong>{riskCount}</strong><span>Em risco</span></div>
              <div><strong>{overdueCount}</strong><span>Atrasados</span></div>
              <div><strong>{associates}</strong><span>Associados</span></div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function EventDrawer({ event, onClose, onMove }: { event: EventItem; onClose: () => void; onMove: (id: string, stage: Stage) => void }) {
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
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
    <div className="overlay modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
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
          <label className="field"><span className="label">Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AssociateStatus })}><option>Ativo</option><option>Pendente</option><option>Inativo</option></select></label>
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
    <div className="overlay modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head"><div><span className="eyebrow">NOVA OPERAÇÃO</span><h2 className="section-title">Criar evento</h2><p className="description">O evento entra na esteira imediatamente após salvar.</p></div><button className="icon-button" type="button" onClick={onClose}><Icon name="close" size={17}/></button></div>
        <div className="form-grid">
          <label className="field field-span-2"><span className="label">Associado</span><select value={form.associate} onChange={(event) => pickAssociate(event.target.value)}>{associates.map((associate) => <option key={associate.id}>{associate.name}</option>)}</select></label>
          <Field label="Veículo" value={form.vehicle} onChange={(value) => setForm({ ...form, vehicle: value })}/>
          <Field label="Placa" value={form.plate} onChange={(value) => setForm({ ...form, plate: value.toUpperCase() })}/>
          <Field label="Cidade / UF" value={form.city} onChange={(value) => setForm({ ...form, city: value })}/>
          <label className="field"><span className="label">Responsável</span><select value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })}><option>Nina</option><option>Larissa</option><option>André</option></select></label>
        </div>
        <div className="modal-actions"><button className="button button-light" type="button" onClick={onClose}>Cancelar</button><button className="button button-dark" type="submit">Criar evento</button></div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="field"><span className="label">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} required={required}/></label>;
}

function SearchDialog({ query, onQuery, results, onClose, inputRef }: { query: string; onQuery: (value: string) => void; results: Array<{ kind: string; title: string; detail: string; icon: IconName; action: () => void }>; onClose: () => void; inputRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div className="overlay search-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="search-dialog">
        <div className="search-dialog-input"><Icon name="search" size={18}/><input ref={inputRef} value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Buscar evento, associado ou placa"/><button onClick={onClose}>ESC</button></div>
        <div className="search-results">
          {!query ? <div className="search-empty"><Icon name="command" size={20}/><h3 className="card-title">Busca rápida</h3><p className="description">Digite um nome, placa ou identificador.</p></div> : null}
          {query && results.length === 0 ? <div className="search-empty"><Icon name="search" size={20}/><h3 className="card-title">Nenhum resultado</h3><p className="description">Tente outro termo.</p></div> : null}
          {results.map((result, index) => <button key={`${result.kind}-${result.title}-${index}`} onClick={() => { result.action(); onClose(); }}><span className="search-icon"><Icon name={result.icon} size={16}/></span><span><strong>{result.title}</strong><small>{result.kind} · {result.detail}</small></span><Icon name="chevron" size={14}/></button>)}
        </div>
      </div>
    </div>
  );
}
