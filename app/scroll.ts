/** A navigation can be interrupted without unexpectedly switching workspaces. */
export function scrollToWorkspace(commit:()=>void){
  window.dispatchEvent(new Event("veloce:navigate"));
  const start=window.scrollY;
  const root=document.documentElement;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){window.scrollTo({top:0,behavior:"instant"});commit();return()=>{};}
  const duration=start<2?180:Math.min(1000,600+Math.sqrt(start)*7);
  const began=performance.now();
  let frame=0,done=false;
  root.dataset.navigation="changing";
  const cleanup=()=>{cancelAnimationFrame(frame);delete root.dataset.navigation;window.removeEventListener("wheel",cancel);window.removeEventListener("touchstart",cancel);window.removeEventListener("keydown",key);};
  const cancel=()=>{done=true;cleanup();};
  const key=(event:KeyboardEvent)=>{if(["PageDown","PageUp","ArrowDown","ArrowUp","Home","End"," ","Escape"].includes(event.key))cancel();};
  const tick=(now:number)=>{
    if(done)return;
    const t=Math.min(1,(now-began)/duration);
    const eased=t*t*(3-2*t);
    if(start>1)window.scrollTo({top:start*(1-eased),behavior:"instant"});
    if(t<1)frame=requestAnimationFrame(tick);else{done=true;cleanup();commit();}
  };
  window.addEventListener("wheel",cancel,{passive:true});
  window.addEventListener("touchstart",cancel,{passive:true});
  window.addEventListener("keydown",key);
  frame=requestAnimationFrame(tick);
  return cancel;
}

/** Smooth coarse mouse-wheel steps; preserve touch, trackpad, nested scroll and zoom. */
export function installWheelSmoothing(){
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const fine=matchMedia("(hover: hover) and (pointer: fine)");
  let frame=0,target=window.scrollY,position=window.scrollY,last=0;
  const stop=()=>{cancelAnimationFrame(frame);frame=0;target=position=window.scrollY;};
  const maxScroll=()=>Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
  const tick=(time:number)=>{
    const dt=Math.min(32,last?time-last:16);last=time;
    const remaining=target-position;
    if(Math.abs(remaining)<.6){window.scrollTo({top:target,behavior:"instant"});frame=0;return;}
    position+=remaining*(1-Math.exp(-dt/105));
    window.scrollTo({top:position,behavior:"instant"});
    target=Math.min(target,maxScroll());
    frame=requestAnimationFrame(tick);
  };
  const wheel=(event:WheelEvent)=>{
    if(event.defaultPrevented||!event.cancelable||event.ctrlKey||event.metaKey||event.shiftKey||!fine.matches||reduced.matches||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
    const element=event.target instanceof Element?event.target:null;
    if(element?.closest('dialog,[role="dialog"],input,textarea,select,[contenteditable="true"],.modal,.event-drawer,.mobile-drawer')){stop();return;}
    for(let parent=element;parent&&parent!==document.body;parent=parent.parentElement){
      if(parent.scrollHeight>parent.clientHeight+1&&/(auto|scroll)/.test(getComputedStyle(parent).overflowY)){stop();return;}
    }
    if(event.deltaMode===0&&Math.abs(event.deltaY)<50){stop();return;}
    const delta=event.deltaY*(event.deltaMode===1?18:event.deltaMode===2?window.innerHeight*.8:1);
    if(!frame)target=position=window.scrollY;
    const next=Math.max(0,Math.min(maxScroll(),target+delta));
    if(next===target)return;
    event.preventDefault();target=next;
    if(!frame){last=0;frame=requestAnimationFrame(tick);}
  };
  window.addEventListener("wheel",wheel,{passive:false});
  window.addEventListener("touchstart",stop,{passive:true});
  window.addEventListener("pointerdown",stop,{passive:true});
  window.addEventListener("keydown",stop);
  window.addEventListener("veloce:navigate",stop);
  reduced.addEventListener("change",stop);
  return()=>{stop();window.removeEventListener("wheel",wheel);window.removeEventListener("touchstart",stop);window.removeEventListener("pointerdown",stop);window.removeEventListener("keydown",stop);window.removeEventListener("veloce:navigate",stop);reduced.removeEventListener("change",stop);};
}
