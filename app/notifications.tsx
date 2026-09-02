"use client";

import {useEffect, useMemo, useRef, useState} from "react";

type NoticeEvent={id:string;associate:string;stage:string;sla:string;updated:string};
export const noticeKey=(event:NoticeEvent)=>`${event.id}:${event.stage}:${event.sla}:${event.updated}`;
export const activeNotices=(events:NoticeEvent[])=>events.filter(event=>event.sla!=="Dentro"&&event.stage!=="Concluido").sort((a,b)=>Number(b.sla==="Atrasado")-Number(a.sla==="Atrasado"));

export function NotificationBell({events,onSelect}:{events:NoticeEvent[];onSelect:(id:string)=>void}){
  const [open,setOpen]=useState(false);
  const [read,setRead]=useState<string[]>([]);
  const [onlyUnread,setOnlyUnread]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null);
  const alerts=useMemo(()=>activeNotices(events),[events]);
  const unread=alerts.filter(event=>!read.includes(noticeKey(event)));
  const visible=onlyUnread?unread:alerts;
  useEffect(()=>{if(open&&!dialog.current?.open)dialog.current?.showModal();else if(!open&&dialog.current?.open)dialog.current.close();},[open]);
  function select(event:NoticeEvent){setRead(items=>[...new Set([...items,noticeKey(event)])]);setOpen(false);onSelect(event.id);}
  return <>
    <button type="button" className="notification-trigger" aria-label={`Notificações: ${unread.length} não lidas`} aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>
      {unread.length>0&&<b>{unread.length}</b>}
    </button>
    <dialog ref={dialog} className="notification-dialog" aria-labelledby="notice-title" onClose={()=>setOpen(false)} onCancel={()=>setOpen(false)} onClick={event=>{if(event.target===event.currentTarget)setOpen(false);}}>
      <div className="notification-content">
        <header><div><span className="panel-kicker">Central de alertas</span><h2 id="notice-title">Notificações</h2></div><button type="button" className="notice-close" aria-label="Fechar notificações" onClick={()=>setOpen(false)}>×</button></header>
        <div className="notification-toolbar"><button type="button" aria-pressed={onlyUnread} onClick={()=>setOnlyUnread(value=>!value)}>{onlyUnread?"Mostrar todas":`Não lidas (${unread.length})`}</button><button type="button" disabled={!unread.length} onClick={()=>setRead(items=>[...new Set([...items,...alerts.map(noticeKey)])])}>Marcar todas como lidas</button></div>
        <div className="notification-list">
          {visible.length?visible.map(event=><button type="button" key={noticeKey(event)} className={`notification-item ${read.includes(noticeKey(event))?"is-read":""}`} onClick={()=>select(event)}>
            <i className={event.sla==="Atrasado"?"notice-late":""} aria-hidden="true"/>
            <span><strong>{event.associate}</strong><span>{event.sla==="Atrasado"?"Prazo excedido":"Prazo em risco"} · {event.stage}</span><small>{event.id} · Atualizado {event.updated}</small></span><span aria-hidden="true">↗</span>
          </button>):<div className="notification-empty"><strong>{onlyUnread?"Tudo lido por aqui":"Nenhum alerta pendente"}</strong><p>{onlyUnread?"Os alertas continuam disponíveis em Mostrar todas.":"Eventos em risco ou atrasados aparecerão aqui."}</p></div>}
        </div>
        <footer>Alertas dos eventos desta sessão. Ler não resolve a pendência.</footer>
      </div>
    </dialog>
  </>;
}
