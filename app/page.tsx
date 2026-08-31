"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";

type View = "Dashboard" | "Esteira" | "Associados" | "Rede" | "Documentos" | "Rotinas" | "Assistente";
type Stage = "Entrada" | "Documentos" | "Analise" | "Vistoria" | "Aprovacao" | "Reparo" | "Concluido";
type Sla = "Dentro" | "Risco" | "Atrasado";
type AssociateStatus = "Ativo" | "Pendente" | "Inativo";
type IconName = "grid" | "flow" | "users" | "network" | "file" | "bolt" | "message" | "plus" | "search" | "bell" | "chevron" | "check" | "clock" | "arrow" | "close" | "send" | "filter" | "upload" | "car" | "shield" | "menu" | "trend" | "refresh" | "phone" | "mail" | "pin" | "more" | "documentCheck" | "alert" | "report" | "scan" | "settings" | "eye" | "command" | "activity" | "userPlus" | "building" | "route" | "calendar" | "download";

type EventItem = { id:string; associate:string; vehicle:string; plate:string; city:string; stage:Stage; sla:Sla; owner:string; updated:string };
type AssociateItem = { id:string; name:string; cpf:string; phone:string; email:string; vehicle:string; plate:string; city:string; status:AssociateStatus; updated:string };
type Message = { id:string; role:"user"|"assistant"; text:string };

const stages: Array<{key:Stage;label:string}> = [
  {key:"Entrada",label:"Entrada"}, {key:"Documentos",label:"Documentos"}, {key:"Analise",label:"Análise"},
  {key:"Vistoria",label:"Vistoria"}, {key:"Aprovacao",label:"Aprovação"}, {key:"Reparo",label:"Reparo"}, {key:"Concluido",label:"Concluído"}
];

const initialEvents: EventItem[] = [
  {id:"EV-2848",associate:"Marina Costa",vehicle:"Jeep Compass",plate:"RTA-8D21",city:"São Paulo, SP",stage:"Documentos",sla:"Risco",owner:"Larissa",updated:"há 4 min"},
  {id:"EV-2847",associate:"Rafael Prado",vehicle:"Toyota Corolla",plate:"GHT-2A18",city:"Campinas, SP",stage:"Vistoria",sla:"Dentro",owner:"André",updated:"há 8 min"},
  {id:"EV-2846",associate:"Bianca Freitas",vehicle:"Honda HR-V",plate:"QXZ-5H11",city:"Santos, SP",stage:"Analise",sla:"Dentro",owner:"Larissa",updated:"há 12 min"},
  {id:"EV-2845",associate:"Diego Moura",vehicle:"VW T-Cross",plate:"BFD-1C92",city:"Sorocaba, SP",stage:"Entrada",sla:"Dentro",owner:"Nina",updated:"há 16 min"},
  {id:"EV-2844",associate:"Helena Duarte",vehicle:"Hyundai Creta",plate:"PRL-7J14",city:"Jundiaí, SP",stage:"Aprovacao",sla:"Atrasado",owner:"André",updated:"há 23 min"},
  {id:"EV-2843",associate:"Lucas Neri",vehicle:"Chevrolet Tracker",plate:"FPN-4M26",city:"São Paulo, SP",stage:"Reparo",sla:"Dentro",owner:"Nina",updated:"há 29 min"},
  {id:"EV-2842",associate:"Paula Meireles",vehicle:"Nissan Kicks",plate:"LXD-9G31",city:"Guarulhos, SP",stage:"Documentos",sla:"Atrasado",owner:"Larissa",updated:"há 38 min"},
  {id:"EV-2841",associate:"Marcelo Reis",vehicle:"Fiat Fastback",plate:"SRA-3K20",city:"Osasco, SP",stage:"Entrada",sla:"Risco",owner:"Nina",updated:"há 44 min"},
  {id:"EV-2840",associate:"Aline Lopes",vehicle:"Renault Kardian",plate:"TNG-6B08",city:"São Paulo, SP",stage:"Concluido",sla:"Dentro",owner:"André",updated:"há 51 min"},
  {id:"EV-2839",associate:"Caio Leal",vehicle:"VW Nivus",plate:"JQR-2L40",city:"Santo André, SP",stage:"Vistoria",sla:"Risco",owner:"Larissa",updated:"há 1 h"},
  {id:"EV-2838",associate:"Renata Nunes",vehicle:"Honda City",plate:"DXP-5N73",city:"São Bernardo, SP",stage:"Analise",sla:"Dentro",owner:"André",updated:"há 1 h"},
  {id:"EV-2837",associate:"Bruno Mota",vehicle:"Toyota Yaris",plate:"MST-8A19",city:"Barueri, SP",stage:"Concluido",sla:"Dentro",owner:"Nina",updated:"há 2 h"}
];

const initialAssociates: AssociateItem[] = [
  {id:"AS-1952",name:"Marina Costa",cpf:"***.482.***-**",phone:"(11) 99942-3810",email:"marina@exemplo.com",vehicle:"Jeep Compass",plate:"RTA-8D21",city:"São Paulo, SP",status:"Ativo",updated:"agora"},
  {id:"AS-1951",name:"Rafael Prado",cpf:"***.184.***-**",phone:"(19) 99128-7712",email:"rafael@exemplo.com",vehicle:"Toyota Corolla",plate:"GHT-2A18",city:"Campinas, SP",status:"Ativo",updated:"há 8 min"},
  {id:"AS-1950",name:"Bianca Freitas",cpf:"***.337.***-**",phone:"(13) 99718-4300",email:"bianca@exemplo.com",vehicle:"Honda HR-V",plate:"QXZ-5H11",city:"Santos, SP",status:"Pendente",updated:"há 12 min"},
  {id:"AS-1949",name:"Diego Moura",cpf:"***.764.***-**",phone:"(15) 99881-2190",email:"diego@exemplo.com",vehicle:"VW T-Cross",plate:"BFD-1C92",city:"Sorocaba, SP",status:"Ativo",updated:"há 16 min"},
  {id:"AS-1948",name:"Helena Duarte",cpf:"***.108.***-**",phone:"(11) 99214-6512",email:"helena@exemplo.com",vehicle:"Hyundai Creta",plate:"PRL-7J14",city:"Jundiaí, SP",status:"Ativo",updated:"há 23 min"},
  {id:"AS-1947",name:"Lucas Neri",cpf:"***.409.***-**",phone:"(11) 99553-8061",email:"lucas@exemplo.com",vehicle:"Chevrolet Tracker",plate:"FPN-4M26",city:"São Paulo, SP",status:"Ativo",updated:"há 29 min"}
];

const providers = [
  {name:"Auto Prime Centro",city:"São Paulo, SP",specialty:"Funilaria e pintura",load:62,eta:"2 dias",score:"4,9",jobs:18},
  {name:"Vistocar Leste",city:"São Paulo, SP",specialty:"Vistoria técnica",load:41,eta:"Hoje",score:"4,8",jobs:12},
  {name:"Oficina Norte",city:"Guarulhos, SP",specialty:"Mecânica e elétrica",load:78,eta:"3 dias",score:"4,7",jobs:24},
  {name:"CheckAuto Campinas",city:"Campinas, SP",specialty:"Vistoria e laudos",load:36,eta:"Amanhã",score:"4,9",jobs:9}
];

const documents = [
  {event:"EV-2848",associate:"Marina Costa",item:"CNH do condutor",status:"Pendente",age:"18 min"},
  {event:"EV-2842",associate:"Paula Meireles",item:"Fotos do veículo",status:"Atrasado",age:"1 h 12 min"},
  {event:"EV-2836",associate:"Lívia Ramos",item:"Boletim de ocorrência",status:"Em análise",age:"2 h"},
  {event:"EV-2833",associate:"Henrique Dias",item:"Comprovante de endereço",status:"Recebido",age:"3 h"}
];

const routines = [
  {title:"Cobrar documentos",note:"Pendências prontas para cobrança",icon:"documentCheck" as IconName},
  {title:"Revisar SLAs",note:"Riscos e atrasos da rodada",icon:"clock" as IconName},
  {title:"Distribuir rede",note:"Capacidade e região dos prestadores",icon:"route" as IconName},
  {title:"Triar entradas",note:"Novos eventos aguardando validação",icon:"scan" as IconName},
  {title:"Gerar relatório",note:"Resumo operacional da gestão",icon:"report" as IconName},
  {title:"Revisar cadastros",note:"Dados incompletos ou inconsistentes",icon:"users" as IconName}
];

const nav: Array<{view:View;label:string;icon:IconName}> = [
  {view:"Dashboard",label:"Visão geral",icon:"grid"},
  {view:"Esteira",label:"Esteira",icon:"flow"},
  {view:"Associados",label:"Associados",icon:"users"},
  {view:"Rede",label:"Rede",icon:"network"},
  {view:"Documentos",label:"Documentos",icon:"file"},
  {view:"Rotinas",label:"Rotinas",icon:"bolt"}
];

const viewMeta: Record<View,{title:string;subtitle:string}> = {
  Dashboard:{title:"Operação de hoje",subtitle:"Veja o que precisa de ação agora."},
  Esteira:{title:"Esteira operacional",subtitle:"Acompanhe cada evento do início à conclusão sem perder o SLA."},
  Associados:{title:"Associados",subtitle:"Cadastros, veículos e situação de cada associado."},
  Rede:{title:"Rede credenciada",subtitle:"Capacidade, prazo e distribuição entre prestadores."},
  Documentos:{title:"Documentos",subtitle:"Pendências e conferências organizadas por evento."},
  Rotinas:{title:"Rotinas operacionais",subtitle:"Ações recorrentes prontas para executar com segurança."},
  Assistente:{title:"Agente operacional",subtitle:"Consulte a operação e execute ações sem trocar de tela."}
};

function Icon({name,size=18}:{name:IconName;size?:number}) {
  return <img className="icon" src={`/icons/${name}.svg`} alt="" width={size} height={size}/>;
}

function Status({value}:{value:string}) {
  const tone = value === "Atrasado" ? "danger" : value === "Risco" || value === "Pendente" ? "warning" : "neutral";
  return <span className={`status status-${tone}`}>{value}</span>;
}

function AppButton({children,icon,onClick,kind="secondary",className=""}:{children:ReactNode;icon?:IconName;onClick?:()=>void;kind?:"primary"|"secondary"|"ghost";className?:string}) {
  return <button className={`button button-${kind} ${className}`} onClick={onClick}>{icon&&<Icon name={icon} size={17}/>}<span>{children}</span></button>;
}

function SectionHead({title,action,onAction}:{title:string;action?:string;onAction?:()=>void}) {
  return <div className="section-head"><h2>{title}</h2>{action&&<button className="text-action" onClick={onAction}>{action}<Icon name="arrow" size={15}/></button>}</div>;
}

function MiniBars({values}:{values:number[]}) {
  return <div className="mini-bars" aria-hidden>{values.map((value,i)=><i key={i} style={{height:`${value}%`}}/>)}</div>;
}

function MetricCard({label,value,detail,bars}:{label:string;value:string;detail:string;bars:number[]}) {
  return <article className="metric-card"><span className="metric-label">{label}</span><strong>{value}</strong><span className="metric-detail">{detail}</span><MiniBars values={bars}/></article>;
}

export default function Page() {
  const [view,setView] = useState<View>("Dashboard");
  const [events,setEvents] = useState<EventItem[]>(initialEvents);
  const [associates,setAssociates] = useState<AssociateItem[]>(initialAssociates);
  const [selectedEvent,setSelectedEvent] = useState<EventItem|null>(null);
  const [modal,setModal] = useState<"associate"|"event"|"search"|null>(null);
  const [navOpen,setNavOpen] = useState(false);
  const [toast,setToast] = useState("");
  const [search,setSearch] = useState("");

  const risk = useMemo(()=>events.filter(e=>e.sla!=="Dentro"),[events]);
  const overdue = useMemo(()=>events.filter(e=>e.sla==="Atrasado"),[events]);
  const inInspection = useMemo(()=>events.filter(e=>e.stage==="Vistoria"),[events]);
  const filteredEvents = useMemo(()=>{
    const q=search.trim().toLowerCase();
    if(!q) return events;
    return events.filter(e=>[e.id,e.associate,e.vehicle,e.plate,e.city,e.owner,e.stage].some(v=>v.toLowerCase().includes(q)));
  },[events,search]);

  function navigate(next:View){ setView(next); setNavOpen(false); window.scrollTo({top:0,behavior:"smooth"}); }
  function notify(text:string){ setToast(text); window.setTimeout(()=>setToast(""),2600); }
  function moveEvent(id:string,stage:Stage){ setEvents(list=>list.map(e=>e.id===id?{...e,stage,updated:"agora"}:e)); setSelectedEvent(prev=>prev?.id===id?{...prev,stage,updated:"agora"}:prev); notify("Etapa atualizada."); }

  return <main className="app-stage">
    <div className="app-layout">
      <Sidebar view={view} onNavigate={navigate} open={navOpen} onClose={()=>setNavOpen(false)}/>
      <section className="app-main">
        <Topbar onMenu={()=>setNavOpen(true)} onSearch={()=>setModal("search")} onAgent={()=>navigate("Assistente")} riskCount={risk.length}/>
        <div className="content-shell">
          {view==="Dashboard" ? <Dashboard events={events} risk={risk} overdue={overdue} inInspection={inInspection} onNavigate={navigate} onEvent={setSelectedEvent} notify={notify}/> : <PageHeader view={view} onNewAssociate={()=>setModal("associate")} onNewEvent={()=>setModal("event")}/>}          
          {view==="Esteira"&&<PipelineView events={filteredEvents} search={search} setSearch={setSearch} onEvent={setSelectedEvent}/>}          
          {view==="Associados"&&<AssociatesView associates={associates} onNew={()=>setModal("associate")}/>}          
          {view==="Rede"&&<ProvidersView notify={notify}/>}          
          {view==="Documentos"&&<DocumentsView notify={notify}/>}          
          {view==="Rotinas"&&<RoutinesView notify={notify} onAgent={()=>navigate("Assistente")}/>}          
          {view==="Assistente"&&<AgentView events={events} notify={notify}/>}          
        </div>
      </section>
    </div>
    <MobileNav view={view} onNavigate={navigate} onMore={()=>setNavOpen(true)}/>
    {selectedEvent&&<EventDrawer event={selectedEvent} onClose={()=>setSelectedEvent(null)} onMove={moveEvent}/>}    
    {modal==="associate"&&<AssociateModal onClose={()=>setModal(null)} onCreate={(item)=>{setAssociates(a=>[item,...a]);setModal(null);notify("Associado cadastrado.");}}/>}
    {modal==="event"&&<EventModal associates={associates} onClose={()=>setModal(null)} onCreate={(item)=>{setEvents(e=>[item,...e]);setModal(null);notify("Evento criado.");}}/>}
    {modal==="search"&&<SearchModal events={events} associates={associates} onClose={()=>setModal(null)} onEvent={(e)=>{setModal(null);setSelectedEvent(e);}} onNavigate={(v)=>{setModal(null);navigate(v);}}/>}
    {toast&&<div className="toast"><Icon name="check" size={17}/>{toast}</div>}
  </main>;
}

function Sidebar({view,onNavigate,open,onClose}:{view:View;onNavigate:(v:View)=>void;open:boolean;onClose:()=>void}){
  return <><aside className={`sidebar ${open?"is-open":""}`}>
    <div className="sidebar-brand"><span className="brand-mark"><img src="/veloce-mark.svg" alt=""/></span><span><strong>Veloce</strong><small>Central operacional</small></span><button className="sidebar-close" onClick={onClose}><Icon name="close"/></button></div>
    <nav className="sidebar-nav">
      {nav.map(item=><button key={item.view} className={view===item.view?"active":""} onClick={()=>onNavigate(item.view)}><span className="nav-icon"><Icon name={item.icon}/></span><span>{item.label}</span></button>)}
      <div className="nav-divider"/>
      <button className={view==="Assistente"?"active":""} onClick={()=>onNavigate("Assistente")}><span className="nav-icon"><Icon name="command"/></span><span>Agente</span></button>
    </nav>
    <div className="sidebar-bottom">
      <div className="sidebar-summary"><span>Hoje</span><strong>6 itens</strong><small>precisam de ação</small></div>
      <button className="profile-row"><img src="https://images.pexels.com/photos/8866777/pexels-photo-8866777.jpeg?auto=compress&cs=tinysrgb&w=240" alt="Profissional de atendimento"/><span><strong>Equipe Veloce</strong><small>Operação</small></span><Icon name="chevron" size={15}/></button>
    </div>
  </aside><button className={`scrim ${open?"is-visible":""}`} onClick={onClose} aria-label="Fechar menu"/></>;
}

function Topbar({onMenu,onSearch,onAgent,riskCount}:{onMenu:()=>void;onSearch:()=>void;onAgent:()=>void;riskCount:number}){
  return <header className="topbar">
    <button className="mobile-menu" onClick={onMenu}><Icon name="menu"/></button>
    <button className="top-search" onClick={onSearch}><Icon name="search"/><span>Buscar associado, evento ou placa</span><kbd>⌘ K</kbd></button>
    <div className="top-actions"><button className="icon-button" aria-label="Notificações"><Icon name="bell"/><b>{riskCount}</b></button><AppButton kind="primary" icon="command" onClick={onAgent}>Agente</AppButton><button className="top-avatar"><img src="https://images.pexels.com/photos/8866777/pexels-photo-8866777.jpeg?auto=compress&cs=tinysrgb&w=160" alt="Perfil"/></button></div>
  </header>;
}

function PageHeader({view,onNewAssociate,onNewEvent}:{view:View;onNewAssociate:()=>void;onNewEvent:()=>void}){
  const meta=viewMeta[view];
  const actions = view === "Associados"
    ? <AppButton kind="primary" icon="userPlus" onClick={onNewAssociate}>Novo associado</AppButton>
    : view === "Esteira"
      ? <AppButton kind="primary" icon="plus" onClick={onNewEvent}>Novo evento</AppButton>
      : null;
  return <header className="page-header"><div><span className="page-kicker">Veloce operacional</span><h1>{meta.title}</h1><p>{meta.subtitle}</p></div>{actions&&<div className="page-actions">{actions}</div>}</header>;
}

function Dashboard({events,risk,overdue,inInspection,onNavigate,onEvent,notify}:{events:EventItem[];risk:EventItem[];overdue:EventItem[];inInspection:EventItem[];onNavigate:(v:View)=>void;onEvent:(e:EventItem)=>void;notify:(s:string)=>void}){
  const stageCounts=stages.map(s=>({label:s.label,count:events.filter(e=>e.stage===s.key).length}));
  return <div className="dashboard">
    <header className="dashboard-intro">
      <div><span className="page-kicker">Central operacional</span><h1>Operação de hoje</h1><p>Veja o que precisa de ação agora.</p></div>
      <div className="intro-actions"><AppButton icon="flow" onClick={()=>onNavigate("Esteira")}>Abrir esteira</AppButton><AppButton kind="primary" icon="plus" onClick={()=>notify("Use “Novo evento” no topo para cadastrar.")}>Novo evento</AppButton></div>
    </header>

    <section className="priority-band">
      <div className="priority-message"><span className="priority-number">{risk.length}</span><div><strong>itens precisam de decisão</strong><span>Comece pelos atrasados e siga pelos riscos de SLA.</span></div></div>
      <div className="priority-items">
        {risk.slice(0,3).map((e,i)=><button key={e.id} onClick={()=>onEvent(e)}><span className="priority-index">0{i+1}</span><span><strong>{e.associate}</strong><small>{e.id} · {stages.find(s=>s.key===e.stage)?.label}</small></span><Status value={e.sla}/><Icon name="arrow" size={15}/></button>)}
      </div>
    </section>

    <section className="metric-grid">
      <MetricCard label="SLAs no prazo" value="57%" detail={`${risk.length} em atenção`} bars={[38,58,44,67,60,76,82]}/>
      <MetricCard label="Documentos pendentes" value="8" detail="retorno necessário" bars={[72,64,68,49,54,39,44]}/>
      <MetricCard label="Vistorias em fluxo" value={String(inInspection.length)} detail="na rede hoje" bars={[22,37,46,63,49,73,66]}/>
      <MetricCard label="Associados ativos" value="2.458" detail="base operacional" bars={[48,52,56,62,66,72,78]}/>
    </section>

    <section className="dashboard-bento">
      <article className="panel flow-panel">
        <SectionHead title="Fluxo operacional" action="Ver esteira" onAction={()=>onNavigate("Esteira")}/>
        <div className="stage-strip">{stageCounts.map((s,i)=><button key={s.label} onClick={()=>onNavigate("Esteira")}><span>{String(i+1).padStart(2,"0")}</span><strong>{s.count}</strong><small>{s.label}</small><i style={{width:`${Math.max(24,s.count*22)}%`}}/></button>)}</div>
        <div className="flow-note"><Icon name="activity"/><strong>Maior pressão agora:</strong><span>Documentos e Aprovação concentram os itens fora do SLA.</span></div>
      </article>

      <article className="panel focus-event">
        <div className="focus-media"><img src="https://images.unsplash.com/photo-1615504138936-5a3518f0f85c?auto=format&fit=crop&w=1200&q=82" alt="SUV preto em estrada"/><span><Status value="Risco"/></span></div>
        <div className="focus-copy"><span className="panel-kicker">Evento em foco</span><h2>Marina Costa</h2><p>Jeep Compass · RTA-8D21</p><dl><div><dt>Evento</dt><dd>EV-2848</dd></div><div><dt>Etapa</dt><dd>Documentos</dd></div><div><dt>Responsável</dt><dd>Larissa</dd></div></dl><AppButton kind="primary" icon="eye" onClick={()=>onEvent(events[0])}>Abrir evento</AppButton></div>
      </article>

      <article className="panel action-panel">
        <SectionHead title="Ações rápidas"/>
        <div className="action-grid">
          <button onClick={()=>notify("Pendências organizadas para cobrança.")}><span><Icon name="documentCheck"/></span><strong>Cobrar documentos</strong><small>8 pendências</small><Icon name="arrow" size={15}/></button>
          <button onClick={()=>onNavigate("Esteira")}><span><Icon name="clock"/></span><strong>Revisar SLAs</strong><small>{risk.length} em atenção</small><Icon name="arrow" size={15}/></button>
          <button onClick={()=>onNavigate("Rede")}><span><Icon name="route"/></span><strong>Distribuir rede</strong><small>4 prestadores</small><Icon name="arrow" size={15}/></button>
          <button onClick={()=>onNavigate("Rotinas")}><span><Icon name="report"/></span><strong>Gerar relatório</strong><small>Resumo da rodada</small><Icon name="arrow" size={15}/></button>
        </div>
      </article>

      <article className="panel activity-panel"><SectionHead title="Movimentos recentes" action="Ver esteira" onAction={()=>onNavigate("Esteira")}/><div className="activity-list">
        {[events[1],events[0],events[4],events[6]].map((e,i)=><button key={e.id} onClick={()=>onEvent(e)}><span className={`activity-mark m${i}`}/><span><strong>{i===0?`${e.id} enviado para vistoria`:i===1?`Documento recebido em ${e.id}`:i===2?`SLA revisado em ${e.id}`:`Cobrança registrada em ${e.id}`}</strong><small>{e.owner} · {e.updated}</small></span><span className="activity-avatar">{e.owner.slice(0,1)}</span></button>)}
      </div></article>

      <article className="panel agenda-panel"><SectionHead title="Agenda de hoje"/><div className="agenda-list">
        {["09:30","11:00","14:20","16:10"].map((time,i)=><button key={time} onClick={()=>onEvent(events[i])}><time>{time}</time><span><strong>{i===0?"Retorno de documentos":i===1?"Vistoria agendada":i===2?"Validação de reparo":"Contato com associado"}</strong><small>{events[i].associate} · {events[i].id}</small></span><Icon name="arrow" size={15}/></button>)}
      </div></article>
    </section>

    <section className="command-bar"><span className="command-icon"><Icon name="command" size={20}/></span><div><strong>Agente operacional</strong><span>Pergunte sobre SLA, documentos, associados ou rede.</span></div><button onClick={()=>onNavigate("Assistente")}><span>Abrir agente</span><Icon name="arrow" size={16}/></button></section>
  </div>;
}

function PipelineView({events,search,setSearch,onEvent}:{events:EventItem[];search:string;setSearch:(s:string)=>void;onEvent:(e:EventItem)=>void}){
  return <div className="workspace">
    <div className="stage-overview">{stages.map(stage=>{const count=events.filter(e=>e.stage===stage.key).length;return <button key={stage.key}><span>{stage.label}</span><strong>{count}</strong></button>})}</div>
    <article className="panel table-panel"><div className="table-toolbar"><div><h2>Eventos em andamento</h2><span>{events.length} registros visíveis</span></div><label className="inline-search"><Icon name="search"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar evento, nome ou placa"/></label><button className="filter-button"><Icon name="filter"/>Filtros</button></div>
      <div className="data-table"><div className="table-row table-head"><span>Evento</span><span>Associado</span><span>Veículo</span><span>Etapa</span><span>SLA</span><span>Responsável</span><span/></div>{events.map(e=><button className="table-row" key={e.id} onClick={()=>onEvent(e)}><span data-label="Evento"><strong>{e.id}</strong><small>{e.updated}</small></span><span data-label="Associado"><strong>{e.associate}</strong><small>{e.city}</small></span><span data-label="Veículo"><strong>{e.vehicle}</strong><small>{e.plate}</small></span><span data-label="Etapa">{stages.find(s=>s.key===e.stage)?.label}</span><span data-label="SLA"><Status value={e.sla}/></span><span data-label="Responsável">{e.owner}</span><span><Icon name="arrow" size={15}/></span></button>)}</div>
    </article>
  </div>;
}

function AssociatesView({associates,onNew}:{associates:AssociateItem[];onNew:()=>void}){
  return <div className="workspace"><section className="metric-grid compact-metrics"><MetricCard label="Ativos" value="2.458" detail="base total" bars={[48,52,60,65,72,78]}/><MetricCard label="Pendentes" value="36" detail="cadastros incompletos" bars={[75,66,58,49,42,36]}/><MetricCard label="Novos no mês" value="84" detail="entradas recentes" bars={[28,34,45,61,70,76]}/><MetricCard label="Atualizações" value="17" detail="hoje" bars={[32,42,36,62,55,68]}/></section>
    <article className="panel table-panel"><div className="table-toolbar"><div><h2>Base de associados</h2><span>Consulta rápida de cadastro e veículo</span></div><AppButton kind="primary" icon="userPlus" onClick={onNew}>Novo associado</AppButton></div><div className="associate-list">{associates.map(a=><button key={a.id}><span className="associate-avatar">{a.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</span><span><strong>{a.name}</strong><small>{a.id} · {a.city}</small></span><span><strong>{a.vehicle}</strong><small>{a.plate}</small></span><span>{a.phone}</span><Status value={a.status}/><Icon name="arrow" size={15}/></button>)}</div></article>
  </div>;
}

function ProvidersView({notify}:{notify:(s:string)=>void}){
  return <div className="workspace"><section className="provider-summary"><div><strong>4</strong><span>prestadores acompanhados</span></div><div><strong>54%</strong><span>ocupação média</span></div><div><strong>2 dias</strong><span>prazo médio</span></div></section><section className="provider-grid">{providers.map(p=><article className="provider-card" key={p.name}><div className="provider-head"><span className="provider-icon"><Icon name="building"/></span><Status value={p.load>70?"Risco":"Disponível"}/></div><h2>{p.name}</h2><p>{p.specialty}</p><dl><div><dt>Região</dt><dd>{p.city}</dd></div><div><dt>Prazo</dt><dd>{p.eta}</dd></div><div><dt>Nota</dt><dd>{p.score}</dd></div><div><dt>Serviços</dt><dd>{p.jobs}</dd></div></dl><div className="capacity"><span><strong>Ocupação</strong><b>{p.load}%</b></span><i><b style={{width:`${p.load}%`}}/></i></div><AppButton onClick={()=>notify(`Prestador ${p.name} selecionado.`)}>Ver disponibilidade</AppButton></article>)}</section></div>;
}

function DocumentsView({notify}:{notify:(s:string)=>void}){
  return <div className="workspace"><section className="document-summary"><div><span>Pendentes</span><strong>8</strong></div><div><span>Atrasados</span><strong>3</strong></div><div><span>Em análise</span><strong>5</strong></div><div><span>Recebidos hoje</span><strong>12</strong></div></section><article className="panel table-panel"><div className="table-toolbar"><div><h2>Fila documental</h2><span>Organizada por urgência</span></div><AppButton icon="upload" onClick={()=>notify("Envio de documento aberto.")}>Enviar arquivo</AppButton></div><div className="document-list">{documents.map(d=><button key={d.event} onClick={()=>notify(`${d.event}: ${d.item}`)}><span className="doc-icon"><Icon name="file"/></span><span><strong>{d.item}</strong><small>{d.event} · {d.associate}</small></span><span>{d.age}</span><Status value={d.status}/><Icon name="arrow" size={15}/></button>)}</div></article></div>;
}

function RoutinesView({notify,onAgent}:{notify:(s:string)=>void;onAgent:()=>void}){
  return <div className="workspace"><section className="routine-intro"><div><span className="panel-kicker">Execução assistida</span><h2>Escolha a tarefa. O sistema organiza a próxima ação.</h2></div><AppButton kind="primary" icon="command" onClick={onAgent}>Abrir agente</AppButton></section><section className="routine-grid">{routines.map((r,i)=><article key={r.title} className={i===1?"routine-card featured":"routine-card"}><span className="routine-icon"><Icon name={r.icon}/></span><div><h2>{r.title}</h2><p>{r.note}</p></div><button onClick={()=>notify(`${r.title}: execução iniciada.`)}>Executar<Icon name="arrow" size={15}/></button></article>)}</section></div>;
}

function AgentView({events,notify}:{events:EventItem[];notify:(s:string)=>void}){
  const [messages,setMessages]=useState<Message[]>([{id:"a1",role:"assistant",text:`A operação está com ${events.filter(e=>e.sla!=="Dentro").length} itens em atenção. Posso abrir a fila, revisar documentos ou localizar um associado.`}]);
  const [input,setInput]=useState("");
  function send(text=input){const t=text.trim();if(!t)return;setMessages(m=>[...m,{id:`u${Date.now()}`,role:"user",text:t},{id:`a${Date.now()+1}`,role:"assistant",text:"Consulta registrada. No protótipo, a ação fica pronta para confirmação da operadora."}]);setInput("");}
  return <div className="agent-workspace"><section className="agent-main panel"><div className="agent-header"><span className="agent-symbol"><Icon name="command" size={22}/></span><div><span className="panel-kicker">Contexto operacional ativo</span><h2>Converse com a operação</h2></div><span className="agent-state"><i/>Pronto</span></div><div className="message-list">{messages.map(m=><div key={m.id} className={`message ${m.role}`}><span>{m.text}</span></div>)}</div><form className="agent-input" onSubmit={(e)=>{e.preventDefault();send();}}><Icon name="message"/><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Digite uma ação ou pergunta operacional"/><button type="submit"><Icon name="send"/><span>Executar</span></button></form></section><aside className="agent-side"><article className="panel"><SectionHead title="Ações frequentes"/><div className="agent-actions">{["Quais SLAs exigem atenção?","Cobrar documentos pendentes","Localizar Marina Costa","Resumo da operação"].map((t,i)=><button key={t} onClick={()=>send(t)}><span><Icon name={i===0?"clock":i===1?"documentCheck":i===2?"search":"report"}/></span><strong>{t}</strong><Icon name="arrow" size={15}/></button>)}</div></article><article className="panel agent-context"><span className="panel-kicker">Leitura rápida</span><strong>{events.filter(e=>e.sla!=="Dentro").length}</strong><p>itens precisam de atenção agora.</p><button onClick={()=>notify("Fila crítica aberta.")}>Abrir fila crítica<Icon name="arrow" size={15}/></button></article></aside></div>;
}

function EventDrawer({event,onClose,onMove}:{event:EventItem;onClose:()=>void;onMove:(id:string,stage:Stage)=>void}){
  return <><button className="drawer-scrim" onClick={onClose}/><aside className="drawer"><div className="drawer-head"><div><span className="panel-kicker">Detalhe do evento</span><h2>{event.id}</h2><p>{event.associate} · {event.vehicle}</p></div><button className="icon-button" onClick={onClose}><Icon name="close"/></button></div><div className="drawer-summary"><div><span>Placa</span><strong>{event.plate}</strong></div><div><span>SLA</span><Status value={event.sla}/></div><div><span>Responsável</span><strong>{event.owner}</strong></div><div><span>Local</span><strong>{event.city}</strong></div></div><div className="drawer-section"><h3>Etapa atual</h3><div className="stage-select">{stages.map(s=><button key={s.key} className={event.stage===s.key?"active":""} onClick={()=>onMove(event.id,s.key)}><span>{s.label}</span>{event.stage===s.key&&<Icon name="check" size={15}/>}</button>)}</div></div><div className="drawer-section"><h3>Próximas ações</h3><button className="drawer-action"><Icon name="documentCheck"/><span><strong>Revisar documentos</strong><small>Conferir pendências do evento</small></span><Icon name="arrow" size={15}/></button><button className="drawer-action"><Icon name="message"/><span><strong>Registrar contato</strong><small>Adicionar atualização ao histórico</small></span><Icon name="arrow" size={15}/></button></div></aside></>;
}

function AssociateModal({onClose,onCreate}:{onClose:()=>void;onCreate:(a:AssociateItem)=>void}){
  const [form,setForm]=useState({name:"",phone:"",email:"",vehicle:"",plate:"",city:""});
  function submit(e:FormEvent){e.preventDefault();if(!form.name||!form.vehicle||!form.plate)return;onCreate({id:`AS-${1953+Math.floor(Math.random()*100)}`,name:form.name,cpf:"***.***.***-**",phone:form.phone,email:form.email,vehicle:form.vehicle,plate:form.plate,city:form.city,status:"Ativo",updated:"agora"});}
  return <Modal title="Novo associado" subtitle="Dados essenciais para iniciar o cadastro." onClose={onClose}><form className="form-grid" onSubmit={submit}><Field label="Nome" value={form.name} onChange={v=>setForm({...form,name:v})}/><Field label="Telefone" value={form.phone} onChange={v=>setForm({...form,phone:v})}/><Field label="E-mail" value={form.email} onChange={v=>setForm({...form,email:v})}/><Field label="Veículo" value={form.vehicle} onChange={v=>setForm({...form,vehicle:v})}/><Field label="Placa" value={form.plate} onChange={v=>setForm({...form,plate:v})}/><Field label="Cidade" value={form.city} onChange={v=>setForm({...form,city:v})}/><div className="form-actions"><AppButton onClick={onClose}>Cancelar</AppButton><button className="button button-primary" type="submit"><Icon name="check" size={17}/>Salvar associado</button></div></form></Modal>;
}

function EventModal({associates,onClose,onCreate}:{associates:AssociateItem[];onClose:()=>void;onCreate:(e:EventItem)=>void}){
  const first=associates[0];const [associate,setAssociate]=useState(first?.name||"");const selected=associates.find(a=>a.name===associate)||first;const [stage,setStage]=useState<Stage>("Entrada");const [owner,setOwner]=useState("Nina");
  function submit(e:FormEvent){e.preventDefault();if(!selected)return;onCreate({id:`EV-${2849+Math.floor(Math.random()*100)}`,associate:selected.name,vehicle:selected.vehicle,plate:selected.plate,city:selected.city,stage,sla:"Dentro",owner,updated:"agora"});}
  return <Modal title="Novo evento" subtitle="Abra um evento a partir de um associado existente." onClose={onClose}><form className="form-grid" onSubmit={submit}><label><span>Associado</span><select value={associate} onChange={e=>setAssociate(e.target.value)}>{associates.map(a=><option key={a.id}>{a.name}</option>)}</select></label><label><span>Etapa inicial</span><select value={stage} onChange={e=>setStage(e.target.value as Stage)}>{stages.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}</select></label><label><span>Responsável</span><select value={owner} onChange={e=>setOwner(e.target.value)}><option>Nina</option><option>Larissa</option><option>André</option></select></label><label><span>Veículo</span><input value={selected?.vehicle||""} readOnly/></label><div className="form-actions"><AppButton onClick={onClose}>Cancelar</AppButton><button className="button button-primary" type="submit"><Icon name="plus" size={17}/>Criar evento</button></div></form></Modal>;
}

function SearchModal({events,associates,onClose,onEvent,onNavigate}:{events:EventItem[];associates:AssociateItem[];onClose:()=>void;onEvent:(e:EventItem)=>void;onNavigate:(v:View)=>void}){
  const [q,setQ]=useState("");const term=q.trim().toLowerCase();const e=events.filter(x=>!term||[x.id,x.associate,x.vehicle,x.plate].some(v=>v.toLowerCase().includes(term))).slice(0,5);const a=associates.filter(x=>!term||[x.id,x.name,x.vehicle,x.plate].some(v=>v.toLowerCase().includes(term))).slice(0,4);
  return <Modal title="Busca global" subtitle="Localize eventos, associados e áreas do sistema." onClose={onClose}><label className="modal-search"><Icon name="search"/><input autoFocus value={q} onChange={ev=>setQ(ev.target.value)} placeholder="Digite nome, placa ou evento"/></label><div className="search-results"><span className="result-title">Eventos</span>{e.map(x=><button key={x.id} onClick={()=>onEvent(x)}><span><strong>{x.id}</strong><small>{x.associate} · {x.plate}</small></span><Icon name="arrow" size={15}/></button>)}<span className="result-title">Atalhos</span><button onClick={()=>onNavigate("Associados")}><span><strong>Associados</strong><small>Base de cadastros</small></span><Icon name="arrow" size={15}/></button>{a.length>0&&<button onClick={()=>onNavigate("Esteira")}><span><strong>Esteira</strong><small>Eventos e etapas</small></span><Icon name="arrow" size={15}/></button>}</div></Modal>;
}

function Modal({title,subtitle,onClose,children}:{title:string;subtitle:string;onClose:()=>void;children:ReactNode}){return <><button className="modal-scrim" onClick={onClose}/><section className="modal"><div className="modal-head"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="icon-button" onClick={onClose}><Icon name="close"/></button></div>{children}</section></>}
function Field({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){return <label><span>{label}</span><input value={value} onChange={e=>onChange(e.target.value)}/></label>}

function MobileNav({view,onNavigate,onMore}:{view:View;onNavigate:(v:View)=>void;onMore:()=>void}){
  const items:[View,string,IconName][]=[["Dashboard","Início","grid"],["Esteira","Esteira","flow"],["Rotinas","Rotinas","bolt"],["Assistente","Agente","command"]];
  return <nav className="mobile-nav">{items.map(([v,l,i])=><button key={v} className={view===v?"active":""} onClick={()=>onNavigate(v)}><Icon name={i}/><span>{l}</span></button>)}<button onClick={onMore}><Icon name="menu"/><span>Mais</span></button></nav>;
}
