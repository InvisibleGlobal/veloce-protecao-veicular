"use client";

import { CSSProperties, FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

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
  {title:"Cobrar documentos",note:"8 pendências",icon:"documentCheck" as IconName},
  {title:"Revisar SLAs",note:"6 em atenção",icon:"clock" as IconName},
  {title:"Distribuir rede",note:"4 prestadores",icon:"route" as IconName},
  {title:"Triar entradas",note:"2 novos eventos",icon:"scan" as IconName},
  {title:"Gerar relatório",note:"Resumo da rodada",icon:"report" as IconName},
  {title:"Revisar cadastros",note:"3 incompletos",icon:"users" as IconName}
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
  Dashboard:{title:"Visão geral",subtitle:"Prioridades, fila e próximos passos da operação."},
  Esteira:{title:"Esteira operacional",subtitle:"Acompanhe cada evento até a conclusão, sem perder o SLA."},
  Associados:{title:"Associados",subtitle:"Cadastros, veículos e situação de cada associado."},
  Rede:{title:"Rede credenciada",subtitle:"Capacidade, prazo e distribuição entre prestadores."},
  Documentos:{title:"Documentos",subtitle:"Pendências e conferências organizadas por evento."},
  Rotinas:{title:"Rotinas operacionais",subtitle:"Ações recorrentes prontas para executar com segurança."},
  Assistente:{title:"Agente operacional",subtitle:"Consulte a operação e execute ações sem trocar de tela."}
};

const vehiclePhoto = "https://images.pexels.com/photos/6649925/pexels-photo-6649925.jpeg?auto=compress&cs=tinysrgb&w=1200";
const operatorPhoto = "https://images.pexels.com/photos/8866777/pexels-photo-8866777.jpeg?auto=compress&cs=tinysrgb&w=600";
const jeepPromoPhoto = "/jeep-compass-premium-banner.png";

function Icon({name,size=18}:{name:IconName;size?:number}) {
  const style = {"--icon-url":`url(/icons/${name}.svg)`,"--icon-size":`${size}px`} as CSSProperties;
  return <span className="svg-icon" style={style} aria-hidden="true"/>;
}

function Status({value}:{value:string}) {
  const tone = value === "Atrasado" ? "danger" : value === "Risco" || value === "Pendente" ? "warning" : "neutral";
  return <span className={`status status-${tone}`}>{value}</span>;
}

function AppButton({children,icon,onClick,kind="secondary",className="",type="button"}:{children:ReactNode;icon?:IconName;onClick?:()=>void;kind?:"primary"|"secondary"|"dark"|"ghost";className?:string;type?:"button"|"submit"}) {
  return <button type={type} className={`button button-${kind} ${className}`} onClick={onClick}>{icon&&<Icon name={icon} size={18}/>}<span>{children}</span></button>;
}

function SectionHead({title,action,onAction}:{title:string;action?:string;onAction?:()=>void}) {
  return <div className="section-head"><h2>{title}</h2>{action&&<button className="text-action" onClick={onAction}>{action}<Icon name="arrow" size={16}/></button>}</div>;
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
  const filteredEvents = useMemo(()=>{
    const q=search.trim().toLowerCase();
    if(!q) return events;
    return events.filter(e=>[e.id,e.associate,e.vehicle,e.plate,e.city,e.owner,e.stage].some(v=>v.toLowerCase().includes(q)));
  },[events,search]);

  function notify(text:string){setToast(text);window.setTimeout(()=>setToast(""),2200);}
  function navigate(next:View){
    if(next===view){window.scrollTo({top:0,behavior:"smooth"});setNavOpen(false);return;}
    setView(next);
    setNavOpen(false);
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function moveEvent(id:string,stage:Stage){setEvents(items=>items.map(item=>item.id===id?{...item,stage,updated:"agora"}:item));setSelectedEvent(item=>item?{...item,stage,updated:"agora"}:item);notify("Etapa atualizada.");}

  useEffect(()=>{
    const selector=[
      ".view-transition .panel",
      ".view-transition .command-center",
      ".view-transition .routine-hero",
      ".view-transition .routine-card",
      ".view-transition .provider-card",
      ".view-transition .stage-overview button",
      ".view-transition .summary-strip > div",
      ".view-transition .document-summary > div",
      ".view-transition .provider-summary > div",
      ".view-transition .associate-focus"
    ].join(",");
    const nodes=Array.from(document.querySelectorAll<HTMLElement>(selector));
    nodes.forEach((node,index)=>{
      node.classList.add("scroll-reveal");
      node.style.setProperty("--reveal-delay",`${Math.min(index%6,5)*42}ms`);
    });
    if(!("IntersectionObserver" in window)){nodes.forEach(node=>node.classList.add("is-visible"));return;}
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});
    },{threshold:.08,rootMargin:"0px 0px -5% 0px"});
    nodes.forEach(node=>observer.observe(node));
    return()=>observer.disconnect();
  },[view]);

  return <main className="app-stage">
    <AppHeader view={view} onNavigate={navigate} onSearch={()=>setModal("search")} onAgent={()=>navigate("Assistente")} onMenu={()=>setNavOpen(true)} riskCount={risk.length}/>
    <section className="app-shell">
      <div className="content-shell">
        <div key={view} className="view-transition">
          {view==="Dashboard" ? <Dashboard events={events} risk={risk} overdue={overdue} onNavigate={navigate} onEvent={setSelectedEvent} onNewEvent={()=>setModal("event")}/>
          : <><PageHeader view={view} onNewAssociate={()=>setModal("associate")} onNewEvent={()=>setModal("event")}/>
            {view==="Esteira"&&<PipelineView events={filteredEvents} search={search} setSearch={setSearch} onEvent={setSelectedEvent}/>} 
            {view==="Associados"&&<AssociatesView associates={associates} onNew={()=>setModal("associate")}/>} 
            {view==="Rede"&&<ProvidersView notify={notify}/>} 
            {view==="Documentos"&&<DocumentsView notify={notify}/>} 
            {view==="Rotinas"&&<RoutinesView notify={notify} onAgent={()=>navigate("Assistente")}/>} 
            {view==="Assistente"&&<AgentView events={events} onEvent={setSelectedEvent} notify={notify}/>} 
          </>}
        </div>
      </div>
    </section>
    <MobileDrawer open={navOpen} view={view} onNavigate={navigate} onClose={()=>setNavOpen(false)}/>
    <MobileNav view={view} onNavigate={navigate} onMore={()=>setNavOpen(true)}/>
    {selectedEvent&&<EventDrawer event={selectedEvent} onClose={()=>setSelectedEvent(null)} onMove={moveEvent}/>}    
    {modal==="associate"&&<AssociateModal onClose={()=>setModal(null)} onCreate={(item)=>{setAssociates(a=>[item,...a]);setModal(null);notify("Associado cadastrado.");}}/>}
    {modal==="event"&&<EventModal associates={associates} onClose={()=>setModal(null)} onCreate={(item)=>{setEvents(e=>[item,...e]);setModal(null);notify("Evento criado.");}}/>}
    {modal==="search"&&<SearchModal events={events} associates={associates} onClose={()=>setModal(null)} onEvent={(e)=>{setModal(null);setSelectedEvent(e);}} onNavigate={(v)=>{setModal(null);navigate(v);}}/>}
    {toast&&<div className="toast"><Icon name="check" size={18}/>{toast}</div>}
  </main>;
}

function AppHeader({view,onNavigate,onSearch,onAgent,onMenu,riskCount}:{view:View;onNavigate:(v:View)=>void;onSearch:()=>void;onAgent:()=>void;onMenu:()=>void;riskCount:number}){
  return <header className="app-header"><div className="header-inner">
    <button className="mobile-menu" onClick={onMenu} aria-label="Abrir menu"><Icon name="menu" size={21}/></button>
    <button className="brand" onClick={()=>onNavigate("Dashboard")}><span className="brand-mark"><img src="/veloce-mark.svg" alt=""/></span><span><strong>Veloce</strong><small>Central operacional</small></span></button>
    <nav className="desktop-nav">{nav.map(item=><button key={item.view} className={view===item.view?"active":""} onClick={()=>onNavigate(item.view)}><Icon name={item.icon} size={17}/><span>{item.label}</span></button>)}</nav>
    <div className="header-actions">
      <button className="header-search" onClick={onSearch}><Icon name="search" size={18}/><span>Buscar</span><kbd>⌘K</kbd></button>
      <button className="header-icon" aria-label="Notificações"><Icon name="bell" size={19}/><b>{riskCount}</b></button>
      <button className={`agent-header-button ${view==="Assistente"?"active":""}`} onClick={onAgent}><span className="agent-header-icon"><Icon name="command" size={17}/></span><span>Agente</span></button>
      <button className="profile-button" aria-label="Perfil"><img src={operatorPhoto} alt="Profissional da central operacional"/></button>
    </div>
  </div></header>;
}

function MobileDrawer({open,view,onNavigate,onClose}:{open:boolean;view:View;onNavigate:(v:View)=>void;onClose:()=>void}){
  return <><button className={`mobile-scrim ${open?"visible":""}`} onClick={onClose} aria-label="Fechar menu"/><aside className={`mobile-drawer ${open?"open":""}`}>
    <div className="drawer-brand"><span className="brand-mark"><img src="/veloce-mark.svg" alt=""/></span><div><strong>Veloce</strong><small>Central operacional</small></div><button onClick={onClose}><Icon name="close" size={20}/></button></div>
    <nav>{[...nav,{view:"Assistente" as View,label:"Agente",icon:"command" as IconName}].map(item=><button key={item.view} className={view===item.view?"active":""} onClick={()=>onNavigate(item.view)}><span><Icon name={item.icon}/></span><strong>{item.label}</strong><Icon name="arrow" size={16}/></button>)}</nav>
  </aside></>;
}

function PageHeader({view,onNewAssociate,onNewEvent}:{view:View;onNewAssociate:()=>void;onNewEvent:()=>void}){
  const meta=viewMeta[view];
  const actions = view === "Associados" ? <AppButton kind="primary" icon="userPlus" onClick={onNewAssociate}>Novo associado</AppButton>
    : view === "Esteira" ? <AppButton kind="primary" icon="plus" onClick={onNewEvent}>Novo evento</AppButton> : null;
  return <header className="page-header"><div><span className="page-kicker">Veloce operacional</span><h1>{meta.title}</h1><p>{meta.subtitle}</p></div>{actions&&<div className="page-actions">{actions}</div>}</header>;
}

function Dashboard({events,risk,overdue,onNavigate,onEvent,onNewEvent}:{events:EventItem[];risk:EventItem[];overdue:EventItem[];onNavigate:(v:View)=>void;onEvent:(e:EventItem)=>void;onNewEvent:()=>void}){
  const atRisk = risk.filter(e=>e.sla==="Risco");
  const pendingDocuments = documents.filter(d=>d.status!=="Recebido").length;
  const priorities = [...overdue,...atRisk.filter(e=>!overdue.some(o=>o.id===e.id))].slice(0,3);

  return <div className="dashboard overview-dashboard">
    <header className="dashboard-intro overview-intro">
      <div>
        <span className="page-kicker">Central operacional</span>
        <h1>Visão geral</h1>
        <p>Somente o que precisa da sua atenção agora.</p>
      </div>
      <div className="intro-actions">
        <AppButton icon="flow" onClick={()=>onNavigate("Esteira")}>Abrir esteira</AppButton>
        <AppButton kind="primary" icon="plus" onClick={onNewEvent}>Novo evento</AppButton>
      </div>
    </header>

    <section className="overview-alerts" aria-label="Indicadores prioritários">
      <button className="panel overview-alert overview-alert-danger" onClick={()=>onNavigate("Esteira")}>
        <span className="overview-alert-icon"><Icon name="alert" size={18}/></span>
        <span className="overview-alert-copy"><small>Atrasados</small><strong>{overdue.length}</strong></span>
        <Icon name="arrow" size={16}/>
      </button>
      <button className="panel overview-alert overview-alert-warning" onClick={()=>onNavigate("Esteira")}>
        <span className="overview-alert-icon"><Icon name="clock" size={18}/></span>
        <span className="overview-alert-copy"><small>Em risco</small><strong>{atRisk.length}</strong></span>
        <Icon name="arrow" size={16}/>
      </button>
      <button className="panel overview-alert" onClick={()=>onNavigate("Documentos")}>
        <span className="overview-alert-icon"><Icon name="documentCheck" size={18}/></span>
        <span className="overview-alert-copy"><small>Docs pendentes</small><strong>{pendingDocuments}</strong></span>
        <Icon name="arrow" size={16}/>
      </button>
    </section>

    <section className="panel overview-priorities">
      <div className="overview-priorities-head">
        <div>
          <span className="panel-kicker">Atenção imediata</span>
          <h2>Prioridades agora</h2>
        </div>
        <button className="text-action" onClick={()=>onNavigate("Esteira")}>Ver esteira<Icon name="arrow" size={16}/></button>
      </div>

      <div className="overview-priority-list">
        {priorities.map((e,i)=><button key={e.id} onClick={()=>onEvent(e)}>
          <span className={`overview-priority-rank ${e.sla==="Atrasado"?"critical":""}`}>{String(i+1).padStart(2,"0")}</span>
          <span className="overview-priority-main">
            <strong>{e.associate}</strong>
            <small>{e.id} · {e.vehicle} · {e.plate}</small>
          </span>
          <span className="overview-priority-stage">{stages.find(s=>s.key===e.stage)?.label}</span>
          <Status value={e.sla}/>
          <Icon name="arrow" size={16}/>
        </button>)}
        {priorities.length===0&&<div className="overview-empty"><Icon name="check" size={20}/><span>Nenhuma prioridade crítica agora.</span></div>}
      </div>
    </section>

    <section className="overview-cta-banner reveal-on-scroll" aria-label="Chamada principal para proteção veicular">
      <div className="overview-cta-media">
        <img src={jeepPromoPhoto} alt="Jeep em destaque"/>
      </div>
      <div className="overview-cta-content">
        <span className="panel-kicker">Proteção veicular</span>
        <h2><span>PROTEJA O SEU</span><span>VEÍCULO AGORA</span></h2>
        <p>Fale com o Agente e avance para a próxima etapa sem sair da central.</p>
        <AppButton kind="primary" icon="command" onClick={()=>onNavigate("Assistente")} className="overview-cta-button">Ir para o agente</AppButton>
      </div>
    </section>
  </div>;
}

function PipelineView({events,search,setSearch,onEvent}:{events:EventItem[];search:string;setSearch:(s:string)=>void;onEvent:(e:EventItem)=>void}){
  return <div className="workspace">
    <section className="stage-overview">{stages.map(stage=>{const count=events.filter(e=>e.stage===stage.key).length;return <button key={stage.key}><span>{stage.label}</span><strong>{count}</strong><i style={{width:`${Math.max(28,count*30)}%`}}/></button>})}</section>
    <article className="panel table-panel"><div className="table-toolbar"><div><h2>Eventos em andamento</h2><span>{events.length} registros</span></div><label className="inline-search"><Icon name="search" size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar evento, nome ou placa"/></label><button className="filter-button"><Icon name="filter" size={17}/>Filtros</button></div>
      <div className="data-table"><div className="table-row table-head"><span>Evento</span><span>Associado</span><span>Veículo</span><span>Etapa</span><span>SLA</span><span>Responsável</span><span/></div>{events.map(e=><button className="table-row" key={e.id} onClick={()=>onEvent(e)}><span data-label="Evento"><strong>{e.id}</strong><small>{e.updated}</small></span><span data-label="Associado"><strong>{e.associate}</strong><small>{e.city}</small></span><span data-label="Veículo"><strong>{e.vehicle}</strong><small>{e.plate}</small></span><span data-label="Etapa">{stages.find(s=>s.key===e.stage)?.label}</span><span data-label="SLA"><Status value={e.sla}/></span><span data-label="Responsável">{e.owner}</span><span><Icon name="arrow" size={16}/></span></button>)}</div>
    </article>
  </div>;
}

function AssociatesView({associates,onNew}:{associates:AssociateItem[];onNew:()=>void}){
  const focus=associates[0];
  return <div className="workspace"><section className="summary-strip"><div><span>Ativos</span><strong>2.458</strong></div><div><span>Pendentes</span><strong>36</strong></div><div><span>Novos no mês</span><strong>84</strong></div><div><span>Atualizações hoje</span><strong>17</strong></div></section>
    <section className="associate-focus-grid"><article className="panel associate-focus"><div className="associate-focus-avatar">MC</div><div><span className="panel-kicker">Associada em acompanhamento</span><h2>{focus.name}</h2><p>{focus.city}</p><div className="associate-focus-meta"><span><Icon name="car" size={17}/>{focus.vehicle} · {focus.plate}</span><span><Icon name="phone" size={17}/>{focus.phone}</span></div></div><Status value={focus.status}/></article><article className="panel associate-quick"><span className="panel-kicker">Gestão da base</span><h2>Cadastro direto, sem etapas escondidas.</h2><AppButton kind="primary" icon="userPlus" onClick={onNew}>Novo associado</AppButton></article></section>
    <article className="panel list-panel"><SectionHead title="Base de associados"/><div className="associate-list">{associates.map(a=><button key={a.id}><span className="associate-avatar">{a.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</span><span><strong>{a.name}</strong><small>{a.id} · {a.city}</small></span><span><strong>{a.vehicle}</strong><small>{a.plate}</small></span><span>{a.phone}</span><Status value={a.status}/><Icon name="arrow" size={16}/></button>)}</div></article></div>;
}

function ProvidersView({notify}:{notify:(s:string)=>void}){
  return <div className="workspace"><section className="provider-summary"><div><span>Prestadores ativos</span><strong>24</strong></div><div><span>Vagas hoje</span><strong>11</strong></div><div><span>Prazo médio</span><strong>2,1 dias</strong></div></section><section className="provider-grid">{providers.map(p=><article key={p.name} className="provider-card"><div className="provider-head"><span className="provider-icon"><Icon name="building" size={20}/></span><Status value={p.load>70?"Risco":"Dentro"}/></div><h2>{p.name}</h2><p>{p.specialty} · {p.city}</p><dl><div><dt>Carga</dt><dd>{p.load}%</dd></div><div><dt>Prazo</dt><dd>{p.eta}</dd></div><div><dt>Nota</dt><dd>{p.score}</dd></div><div><dt>Ativos</dt><dd>{p.jobs}</dd></div></dl><div className="capacity"><span><b>Capacidade</b><b>{100-p.load}% livre</b></span><i><b style={{width:`${p.load}%`}}/></i></div><AppButton onClick={()=>notify(`${p.name}: distribuição aberta.`)} icon="route">Distribuir evento</AppButton></article>)}</section></div>;
}

function DocumentsView({notify}:{notify:(s:string)=>void}){
  return <div className="workspace"><section className="document-summary"><div><span>Pendentes</span><strong>8</strong></div><div><span>Atrasados</span><strong>3</strong></div><div><span>Em análise</span><strong>12</strong></div><div><span>Recebidos hoje</span><strong>19</strong></div></section><article className="panel list-panel"><SectionHead title="Pendências por evento"/><div className="document-list">{documents.map(d=><button key={d.event+d.item} onClick={()=>notify(`${d.event}: documento aberto.`)}><span className="doc-icon"><Icon name="file" size={19}/></span><span><strong>{d.item}</strong><small>{d.associate} · {d.event}</small></span><span>{d.age}</span><Status value={d.status}/><Icon name="arrow" size={16}/></button>)}</div></article></div>;
}

function RoutinesView({notify,onAgent}:{notify:(s:string)=>void;onAgent:()=>void}){
  return <div className="workspace"><section className="routine-hero"><div><span className="panel-kicker">Execução recorrente</span><h2>Escolha a tarefa e avance direto para a ação.</h2></div><AppButton kind="dark" icon="command" onClick={onAgent}>Abrir agente</AppButton></section><section className="routine-grid">{routines.map((r,i)=><article key={r.title} className={`routine-card ${i===1?"featured":""}`}><span className="routine-icon"><Icon name={r.icon} size={20}/></span><div><h2>{r.title}</h2><p>{r.note}</p></div><button onClick={()=>notify(`${r.title}: execução iniciada.`)}><span>Executar</span><Icon name="arrow" size={16}/></button></article>)}</section></div>;
}

function AgentView({events,onEvent,notify}:{events:EventItem[];onEvent:(e:EventItem)=>void;notify:(s:string)=>void}){
  const [messages,setMessages]=useState<Message[]>([{id:"a1",role:"assistant",text:`Há ${events.filter(e=>e.sla!=="Dentro").length} itens em atenção. Posso abrir a fila, localizar um associado ou organizar documentos.`}]);
  const [input,setInput]=useState("");
  function send(text=input){const t=text.trim();if(!t)return;setMessages(m=>[...m,{id:`u${Date.now()}`,role:"user",text:t},{id:`a${Date.now()+1}`,role:"assistant",text:"Consulta registrada. A próxima ação está pronta para confirmação."}]);setInput("");}
  const critical=events.filter(e=>e.sla!=="Dentro").slice(0,3);
  return <div className="agent-layout"><section className="panel agent-main"><header className="agent-top"><span className="agent-symbol"><Icon name="command" size={21}/></span><div><span className="panel-kicker">Agente Veloce</span><h2>Comandos operacionais</h2></div><span className="agent-ready"><i/>Pronto</span></header><div className="prompt-row">{["Revisar SLAs","Cobrar documentos","Localizar associado"].map((t,i)=><button key={t} onClick={()=>send(t)}><Icon name={i===0?"clock":i===1?"documentCheck":"search"} size={17}/>{t}</button>)}</div><div className="message-list">{messages.map(m=><div key={m.id} className={`message ${m.role}`}><span>{m.text}</span></div>)}</div><form className="agent-input" onSubmit={(e)=>{e.preventDefault();send();}}><span className="agent-input-icon" aria-hidden="true"><img src="/icons/message.svg" alt=""/></span><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Digite uma ação ou pergunta"/><button type="submit"><span>Executar</span><Icon name="send" size={17}/></button></form></section><aside className="agent-side"><article className="critical-panel"><span className="panel-kicker">Fila crítica</span><strong>{critical.length}</strong><p>itens para decisão imediata</p><div>{critical.map(e=><button key={e.id} onClick={()=>onEvent(e)}><span><strong>{e.associate}</strong><small>{e.id} · {stages.find(s=>s.key===e.stage)?.label}</small></span><Status value={e.sla}/></button>)}</div></article><article className="panel agent-actions-card"><SectionHead title="Atalhos"/><button onClick={()=>notify("Relatório preparado.")}><Icon name="report" size={18}/><span>Gerar resumo da rodada</span><Icon name="arrow" size={16}/></button><button onClick={()=>notify("Documentos organizados.")}><Icon name="documentCheck" size={18}/><span>Organizar documentos</span><Icon name="arrow" size={16}/></button><button onClick={()=>notify("Rede consultada.")}><Icon name="route" size={18}/><span>Consultar capacidade da rede</span><Icon name="arrow" size={16}/></button></article></aside></div>;
}

function EventDrawer({event,onClose,onMove}:{event:EventItem;onClose:()=>void;onMove:(id:string,stage:Stage)=>void}){
  return <><button className="overlay" onClick={onClose}/><aside className="event-drawer"><div className="event-drawer-head"><div><span className="panel-kicker">Detalhe do evento</span><h2>{event.id}</h2><p>{event.associate} · {event.vehicle}</p></div><button className="header-icon" onClick={onClose}><Icon name="close" size={19}/></button></div><div className="event-summary"><div><span>Placa</span><strong>{event.plate}</strong></div><div><span>SLA</span><Status value={event.sla}/></div><div><span>Responsável</span><strong>{event.owner}</strong></div><div><span>Local</span><strong>{event.city}</strong></div></div><section><h3>Etapa atual</h3><div className="stage-select">{stages.map(s=><button key={s.key} className={event.stage===s.key?"active":""} onClick={()=>onMove(event.id,s.key)}><span>{s.label}</span>{event.stage===s.key&&<Icon name="check" size={16}/>}</button>)}</div></section><section><h3>Próximas ações</h3><button className="drawer-action"><Icon name="documentCheck" size={18}/><span><strong>Revisar documentos</strong><small>Conferir pendências</small></span><Icon name="arrow" size={16}/></button><button className="drawer-action"><Icon name="message" size={18}/><span><strong>Registrar contato</strong><small>Adicionar atualização</small></span><Icon name="arrow" size={16}/></button></section></aside></>;
}

function AssociateModal({onClose,onCreate}:{onClose:()=>void;onCreate:(a:AssociateItem)=>void}){
  const [form,setForm]=useState({name:"",phone:"",email:"",vehicle:"",plate:"",city:""});
  function submit(e:FormEvent){e.preventDefault();if(!form.name||!form.vehicle||!form.plate)return;onCreate({id:`AS-${1953+Math.floor(Math.random()*100)}`,name:form.name,cpf:"***.***.***-**",phone:form.phone,email:form.email,vehicle:form.vehicle,plate:form.plate,city:form.city,status:"Ativo",updated:"agora"});}
  return <Modal title="Novo associado" subtitle="Dados essenciais para iniciar o cadastro." onClose={onClose}><form className="form-grid" onSubmit={submit}><Field label="Nome" value={form.name} onChange={v=>setForm({...form,name:v})}/><Field label="Telefone" value={form.phone} onChange={v=>setForm({...form,phone:v})}/><Field label="E-mail" value={form.email} onChange={v=>setForm({...form,email:v})}/><Field label="Veículo" value={form.vehicle} onChange={v=>setForm({...form,vehicle:v})}/><Field label="Placa" value={form.plate} onChange={v=>setForm({...form,plate:v})}/><Field label="Cidade" value={form.city} onChange={v=>setForm({...form,city:v})}/><div className="form-actions"><AppButton onClick={onClose}>Cancelar</AppButton><AppButton type="submit" kind="primary" icon="check">Salvar associado</AppButton></div></form></Modal>;
}

function EventModal({associates,onClose,onCreate}:{associates:AssociateItem[];onClose:()=>void;onCreate:(e:EventItem)=>void}){
  const first=associates[0];const [associate,setAssociate]=useState(first?.name||"");const selected=associates.find(a=>a.name===associate)||first;const [stage,setStage]=useState<Stage>("Entrada");const [owner,setOwner]=useState("Nina");
  function submit(e:FormEvent){e.preventDefault();if(!selected)return;onCreate({id:`EV-${2849+Math.floor(Math.random()*100)}`,associate:selected.name,vehicle:selected.vehicle,plate:selected.plate,city:selected.city,stage,sla:"Dentro",owner,updated:"agora"});}
  return <Modal title="Novo evento" subtitle="Abra um evento a partir de um associado existente." onClose={onClose}><form className="form-grid" onSubmit={submit}><label><span>Associado</span><select value={associate} onChange={e=>setAssociate(e.target.value)}>{associates.map(a=><option key={a.id}>{a.name}</option>)}</select></label><label><span>Etapa inicial</span><select value={stage} onChange={e=>setStage(e.target.value as Stage)}>{stages.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}</select></label><label><span>Responsável</span><select value={owner} onChange={e=>setOwner(e.target.value)}><option>Nina</option><option>Larissa</option><option>André</option></select></label><label><span>Veículo</span><input value={selected?.vehicle||""} readOnly/></label><div className="form-actions"><AppButton onClick={onClose}>Cancelar</AppButton><AppButton type="submit" kind="primary" icon="plus">Criar evento</AppButton></div></form></Modal>;
}

function SearchModal({events,associates,onClose,onEvent,onNavigate}:{events:EventItem[];associates:AssociateItem[];onClose:()=>void;onEvent:(e:EventItem)=>void;onNavigate:(v:View)=>void}){
  const [q,setQ]=useState("");const term=q.trim().toLowerCase();const e=events.filter(x=>!term||[x.id,x.associate,x.vehicle,x.plate].some(v=>v.toLowerCase().includes(term))).slice(0,5);const a=associates.filter(x=>!term||[x.id,x.name,x.vehicle,x.plate].some(v=>v.toLowerCase().includes(term))).slice(0,4);
  return <Modal title="Busca global" subtitle="Localize eventos, associados e áreas do sistema." onClose={onClose}><label className="modal-search"><Icon name="search" size={18}/><input autoFocus value={q} onChange={ev=>setQ(ev.target.value)} placeholder="Digite nome, placa ou evento"/></label><div className="search-results"><span className="result-title">Eventos</span>{e.map(x=><button key={x.id} onClick={()=>onEvent(x)}><span><strong>{x.id}</strong><small>{x.associate} · {x.plate}</small></span><Icon name="arrow" size={16}/></button>)}<span className="result-title">Atalhos</span><button onClick={()=>onNavigate("Associados")}><span><strong>Associados</strong><small>Base de cadastros</small></span><Icon name="arrow" size={16}/></button>{a.length>0&&<button onClick={()=>onNavigate("Esteira")}><span><strong>Esteira</strong><small>Eventos e etapas</small></span><Icon name="arrow" size={16}/></button>}</div></Modal>;
}

function Modal({title,subtitle,onClose,children}:{title:string;subtitle:string;onClose:()=>void;children:ReactNode}){return <><button className="overlay" onClick={onClose}/><section className="modal"><div className="modal-head"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="header-icon" onClick={onClose}><Icon name="close" size={19}/></button></div>{children}</section></>}
function Field({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){return <label><span>{label}</span><input value={value} onChange={e=>onChange(e.target.value)}/></label>}

function MobileNav({view,onNavigate,onMore}:{view:View;onNavigate:(v:View)=>void;onMore:()=>void}){
  const items:[View,string,IconName][]=[["Dashboard","Início","grid"],["Esteira","Esteira","flow"],["Rotinas","Rotinas","bolt"],["Assistente","Agente","command"]];
  return <nav className="mobile-nav">{items.map(([v,l,i])=><button key={v} className={view===v?"active":""} onClick={()=>onNavigate(v)}><Icon name={i} size={19}/><span>{l}</span></button>)}<button onClick={onMore}><Icon name="menu" size={19}/><span>Mais</span></button></nav>;
}
