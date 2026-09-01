"use client";

import { CSSProperties, KeyboardEvent, useState } from "react";
import { queueMetrics, QueueRecord } from "./chart-data";
import { EdgeLight, MotionIcon } from "./refinement";

export function OperationalCharts({events,stages,onStage}:{events:QueueRecord[];stages:{key:string;label:string}[];onStage:(stage:string)=>void}){
  const [tab,setTab]=useState("stages");
  const [hovered,setHovered]=useState<string|null>(null);
  const [deadline,setDeadline]=useState<string|null>(null);
  const data=queueMetrics(events,stages);
  const activeStage=data.distribution.find(s=>s.key===hovered);
  const activeDeadline=data.deadlines.find(s=>s.key===deadline);
  const a=data.total?data.deadlines[0].count/data.total*100:0;
  const b=data.total?(data.deadlines[0].count+data.deadlines[1].count)/data.total*100:0;
  function changeTab(event:KeyboardEvent<HTMLButtonElement>){
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
    event.preventDefault();
    const next=event.key==="Home"?"stages":event.key==="End"?"deadlines":tab==="stages"?"deadlines":"stages";
    setTab(next);document.getElementById(`chart-tab-${next}`)?.focus();
  }
  return <section className="operation-insights" aria-label="Gráficos da fila">
    <div className="chart-tabs" role="tablist" aria-label="Gráfico operacional">
      {[{key:"stages",label:"Etapas"},{key:"deadlines",label:"Prazos"}].map(item=><button key={item.key} id={`chart-tab-${item.key}`} type="button" role="tab" aria-selected={tab===item.key} aria-controls={`chart-${item.key}`} tabIndex={tab===item.key?0:-1} onKeyDown={changeTab} onClick={()=>setTab(item.key)}>{item.label}</button>)}
    </div>
    <article id="chart-stages" className={`panel telemetry-card ${tab==="stages"?"mobile-selected":""}`} data-parallax-card aria-label="Distribuição por etapa">
      <EdgeLight/>
      <header className="telemetry-head"><div><span className="panel-kicker">Pulso da operação</span><h2>Eventos por etapa</h2></div><MotionIcon name="flow"/></header>
      <div className="telemetry-total"><strong>{activeStage?.count??data.total}</strong><span>{activeStage?activeStage.label:"eventos na fila"}</span><span className="telemetry-signal" aria-hidden="true"><i/><i/><i/><i/><i/></span></div>
      <div className="stage-chart" onPointerLeave={()=>setHovered(null)}>
        {data.distribution.map((stage,index)=><button key={stage.key} className={hovered===stage.key?"is-inspected":""} onPointerEnter={()=>setHovered(stage.key)} onFocus={()=>setHovered(stage.key)} onBlur={()=>setHovered(null)} onClick={()=>onStage(stage.key)} aria-label={`${stage.label}: ${stage.count} ${stage.count===1?"evento":"eventos"}. Abrir etapa.`}>
          <span className="stage-chart-label">{stage.label}</span><span className="stage-chart-track"><i style={{"--bar-width":`${stage.count/data.max*100}%`,"--bar-order":index} as CSSProperties}/></span><strong>{stage.count}</strong><span className="chart-row-arrow" aria-hidden="true">↗</span>
        </button>)}
      </div>
    </article>
    <article id="chart-deadlines" className={`panel deadline-card ${tab==="deadlines"?"mobile-selected":""}`} aria-label="Situação dos prazos">
      <EdgeLight/>
      <header className="telemetry-head"><div><span className="panel-kicker">Saúde da fila</span><h2>Controle de prazos</h2></div><span className="svg-icon" style={{"--icon-url":"url(/icons/clock.svg)","--icon-size":"22px"} as CSSProperties} aria-hidden="true"/></header>
      <div className="deadline-ring" role="img" aria-label={data.total?`${data.within}% dos eventos dentro do prazo`:"Nenhum evento na fila"} style={{"--ring-a":`${a}%`,"--ring-b":`${b}%`} as CSSProperties} data-empty={!data.total}>
        <div><strong>{activeDeadline?activeDeadline.count:data.total?`${data.within}%`:"—"}</strong><span>{activeDeadline?activeDeadline.label:"dentro do prazo"}</span></div>
      </div>
      <div className="deadline-legend" onPointerLeave={()=>setDeadline(null)}>{data.deadlines.map((item,index)=><button type="button" key={item.key} aria-pressed={deadline===item.key} onPointerEnter={()=>setDeadline(item.key)} onFocus={()=>setDeadline(item.key)} onClick={()=>setDeadline(deadline===item.key?null:item.key)} onBlur={()=>setDeadline(null)}><i className={`deadline-dot tone-${index}`} aria-hidden="true"/><span>{item.label}</span><strong>{item.count}</strong></button>)}</div>
    </article>
  </section>;
}
