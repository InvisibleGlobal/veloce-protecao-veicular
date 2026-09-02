"use client";

import { CSSProperties, RefObject, useEffect, useState } from "react";

export function EdgeLight(){return <span className="glass-reflection" aria-hidden="true"><i className="light-top"/><i className="light-right"/><i className="light-bottom"/><i className="light-left"/></span>;}

/** Decorative instrument loop, independent from the real values in the charts. */
export function InstrumentLoop({kind="flow"}:{kind?:"flow"|"clock"}){
  return <span className={`instrument-loop instrument-${kind}`} aria-hidden="true">
    <svg viewBox="0 0 80 80" fill="none" focusable="false">
      <circle cx="40" cy="40" r="31" className="instrument-track"/>
      <circle cx="40" cy="40" r="31" className="instrument-orbit"/>
      {kind==="clock"?<g className="instrument-hand"><path d="M40 21v19l13 8"/></g>:<g className="instrument-bars"><path d="M25 48V35M35 52V26M45 49V31M55 45V36"/></g>}
      <circle cx="40" cy="40" r="2" className="instrument-core"/>
    </svg>
  </span>;
}

export function MotionIcon({name}:{name:string}){
  return <span className="motion-icon" aria-hidden="true"><span className="motion-icon-plane"><span className="svg-icon" style={{"--icon-url":`url(/icons/${name}.svg)`,"--icon-size":"24px"} as CSSProperties}/></span></span>;
}

export function ThemeSwitch(){
  const [dark,setDark]=useState(false);
  useEffect(()=>{setDark(document.documentElement.dataset.theme==="dark");},[]);
  function toggle(){
    const next=!dark;
    setDark(next);
    document.documentElement.dataset.theme=next?"dark":"light";
    try{localStorage.setItem("veloce-theme",next?"dark":"light");}catch{/* Preference is optional. */}
  }
  return <button type="button" className="theme-switch" role="switch" aria-checked={dark} aria-label="Modo escuro" title={dark?"Trocar para modo claro":"Trocar para modo escuro"} onClick={toggle}>
    <span className="theme-switch-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M9 17h6m-5 3h4M8.5 13.5a5.5 5.5 0 1 1 7 0c-.9.7-1.5 1.6-1.5 3h-4c0-1.4-.6-2.3-1.5-3Z"/><path d="M12 1v1M3 6l1 .5M20 6l1-.5M2 12h1M21 12h1"/></svg></span>
    <span className="theme-switch-dot" aria-hidden="true"/>
  </button>;
}

/** One observer and one throttled pointer listener per workspace, never a React render per frame. */
export function useSurfaceMotion(root:RefObject<HTMLElement|null>,view:string){
  useEffect(()=>{
    const host=root.current;
    if(!host)return;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    const fine=matchMedia("(hover: hover) and (pointer: fine)");
    const visibility=()=>{host.dataset.motion=(!document.hidden&&!reduced.matches)?"on":"off";};
    visibility();
    document.addEventListener("visibilitychange",visibility);
    reduced.addEventListener("change",visibility);
    const surfaces=host.querySelectorAll<HTMLElement>(".panel,.provider-card,.routine-card,.overview-cta-banner");
    const observer="IntersectionObserver" in window?new IntersectionObserver(entries=>{
      entries.forEach(entry=>(entry.target as HTMLElement).dataset.inView=String(entry.isIntersecting));
    },{rootMargin:"40px",threshold:0}):null;
    surfaces.forEach(surface=>{surface.dataset.inView="true";observer?.observe(surface);});
    let frame=0;
    let active:HTMLElement|null=null;
    let rect:DOMRect|null=null;
    const reset=()=>{cancelAnimationFrame(frame);active?.style.removeProperty("--pointer-x");active?.style.removeProperty("--pointer-y");active=null;rect=null;};
    const pointer=(event:PointerEvent)=>{
      if(event.pointerType!=="mouse"||!fine.matches||reduced.matches||document.hidden)return;
      const card=(event.target as HTMLElement).closest<HTMLElement>("[data-parallax-card]");
      if(card!==active){reset();active=card;rect=card?.getBoundingClientRect()??null;}
      if(!active||!rect)return;
      const x=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));
      const y=Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1));
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{active?.style.setProperty("--pointer-x",`${x*6}px`);active?.style.setProperty("--pointer-y",`${y*6}px`);});
    };
    host.addEventListener("pointermove",pointer,{passive:true});
    host.addEventListener("pointerleave",reset);
    window.addEventListener("scroll",reset,{passive:true});
    return()=>{reset();observer?.disconnect();document.removeEventListener("visibilitychange",visibility);reduced.removeEventListener("change",visibility);host.removeEventListener("pointermove",pointer);host.removeEventListener("pointerleave",reset);window.removeEventListener("scroll",reset);};
  },[root,view]);
}
