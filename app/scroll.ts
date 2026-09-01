/** Keep the current workspace mounted until the scroll finishes; avoid height-collapse jumps. */
export function scrollToWorkspace(commit:()=>void){
  const start=window.scrollY;
  if(start<2||matchMedia("(prefers-reduced-motion: reduce)").matches){window.scrollTo({top:0,behavior:"instant"});commit();return()=>{};}
  const duration=Math.min(640,380+start*.12);
  const began=performance.now();
  let frame=0,done=false;
  const cleanup=()=>{cancelAnimationFrame(frame);window.removeEventListener("wheel",interrupt);window.removeEventListener("touchstart",interrupt);window.removeEventListener("keydown",key);};
  const finish=()=>{if(done)return;done=true;cleanup();commit();};
  const interrupt=()=>finish();
  const key=(e:KeyboardEvent)=>{if(["PageDown","PageUp","ArrowDown","ArrowUp","Home","End"," "].includes(e.key))interrupt();};
  const tick=(now:number)=>{
    if(done)return;
    const t=Math.min(1,(now-began)/duration);
    const eased=1-Math.pow(1-t,3);
    window.scrollTo({top:start*(1-eased),behavior:"instant"});
    if(t<1)frame=requestAnimationFrame(tick);else finish();
  };
  window.addEventListener("wheel",interrupt,{passive:true});
  window.addEventListener("touchstart",interrupt,{passive:true});
  window.addEventListener("keydown",key);
  frame=requestAnimationFrame(tick);
  return()=>{done=true;cleanup();};
}
