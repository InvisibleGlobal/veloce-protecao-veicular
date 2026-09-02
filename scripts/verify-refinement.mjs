import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const source=fs.readFileSync(path.join(root,'app/page.tsx'),'utf8');
const views=['Dashboard','Esteira','Associados','Rede','Documentos','Rotinas','Assistente'];
const load=(entry,replacement,context={},cache=new Map())=>{
  const file=path.resolve(root,entry);
  if(cache.has(file))return cache.get(file).exports;
  let input=fs.readFileSync(file,'utf8');
  if(replacement&&file.endsWith('/app/page.tsx')) input=input.replace('useState<View>("Dashboard")',`useState<View>("${replacement}")`);
  const output=ts.transpileModule(input,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;
  const module={exports:{}};cache.set(file,module);
  const localRequire=(specifier)=>{
    if(context.__modules?.[specifier])return context.__modules[specifier];
    if(!specifier.startsWith('.'))return require(specifier);
    const base=path.resolve(path.dirname(file),specifier);
    const target=['.ts','.tsx'].map(ext=>base+ext).find(p=>fs.existsSync(p));
    assert(target,`Missing local module ${specifier}`);
    return load(target,replacement,context,cache);
  };
  vm.runInNewContext(output,{module,exports:module.exports,require:localRequire,console,...context},{filename:file});
  return module.exports;
};

for(const view of views){
  const Page=load('app/page.tsx',view).default;
  const html=renderToStaticMarkup(React.createElement(Page));
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${view}: one primary title`);
  assert(html.includes('role="switch"'),`${view}: theme switch`);
  assert(!/NaN|undefined|Infinity/.test(html),`${view}: invalid values`);
  assert(html.includes('mobile-nav'),`${view}: mobile navigation`);
  if(view==='Dashboard'){
    assert(html.includes('Eventos por etapa')&&html.includes('Controle de prazos'));
    assert(html.includes('58% dos eventos dentro do prazo'));
    assert.equal((html.match(/Abrir etapa\./g)||[]).length,7);
    assert(html.includes('role="tablist"'));
  }
  if(view==='Esteira')assert.equal((html.match(/class="table-row"/g)||[]).length,12);
}

// The new charts must represent the actual session records, including empty and changed states.
const initial=source.match(/const initialEvents: EventItem\[\] = (\[[\s\S]*?\n\]);/)[1];
const events=vm.runInNewContext(initial);
const stages=JSON.parse(JSON.stringify(vm.runInNewContext(source.match(/const stages: [^=]+ = (\[[\s\S]*?\n\]);/)[1])));
const {queueMetrics}=load('app/chart-data.ts');
for(const records of [events,[],[{stage:'Entrada',sla:'Dentro'}],events.map(e=>({...e,stage:'Concluido'})),[...events,{stage:'Entrada',sla:'Dentro'}]]){
  const metrics=queueMetrics(records,stages);
  assert.equal(metrics.distribution.reduce((a,b)=>a+b.count,0),records.length);
  assert.equal(metrics.deadlines.reduce((a,b)=>a+b.count,0),records.length);
  assert(Number.isFinite(metrics.within)&&metrics.within>=0&&metrics.within<=100);
  assert(metrics.distribution.every(s=>s.count/metrics.max<=1));
}
assert.equal(queueMetrics(events,stages).within,58);

function scrollHarness({reduced=false,y=1200}={}){
  const frames=new Map(),listeners=new Map(),trace=[];let id=0,time=0,commits=0;
  const window={scrollY:y,scrollTo:({top})=>{window.scrollY=top;trace.push(top);},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:(name)=>listeners.delete(name),dispatchEvent:event=>listeners.get(event.type)?.(event)};
  const context={window,document:{documentElement:{dataset:{}}},Event,matchMedia:()=>({matches:reduced}),performance:{now:()=>time},requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)};
  const cancel=load('app/scroll.ts',null,context).scrollToWorkspace(()=>commits++);
  const step=()=>{time+=16;const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn(time));};
  return {cancel,step,frames,listeners,trace,get commits(){return commits;}};
}
const scroll=scrollHarness();assert.equal(scroll.commits,0);
while(scroll.frames.size)scroll.step();
assert.equal(scroll.commits,1);assert(scroll.trace.length>15);assert.equal(scroll.trace.at(-1),0);
assert(scroll.trace.every((y,i)=>i===0||y<=scroll.trace[i-1]));assert.equal(scroll.listeners.size,0);
const reduced=scrollHarness({reduced:true});assert.equal(reduced.commits,1);assert.equal(reduced.frames.size,0);
const cancelled=scrollHarness();cancelled.step();cancelled.cancel();assert.equal(cancelled.commits,0);assert.equal(cancelled.frames.size,0);assert.equal(cancelled.listeners.size,0);
const interrupted=scrollHarness();interrupted.step();interrupted.listeners.get('touchstart')();assert.equal(interrupted.commits,0);assert.equal(interrupted.frames.size,0);
const atTop=scrollHarness({y:0});assert.equal(atTop.commits,0);while(atTop.frames.size)atTop.step();assert.equal(atTop.commits,1);

// Coarse wheel is eased; touch/trackpad, zoom, dialogs and nested scrolling stay native.
function wheelHarness({reduced=false,fine=true}={}){
 const frames=new Map(),listeners=new Map();let id=0,time=0;
 class Element {constructor(nested=false,dialog=false){this.scrollHeight=nested?800:0;this.clientHeight=nested?200:0;this.parentElement=null;this.dialog=dialog;}closest(){return this.dialog?this:null;}}
 const window={scrollY:0,innerHeight:800,scrollTo:({top})=>window.scrollY=Math.round(top),addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
 const context={window,Element,document:{body:{},documentElement:{scrollHeight:2800}},getComputedStyle:()=>({overflowY:'auto'}),matchMedia:q=>({matches:q.includes('reduced')?reduced:fine,addEventListener(){},removeEventListener(){}}),requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)};
 const cleanup=load('app/scroll.ts',null,context).installWheelSmoothing();
 const wheel=(extra={})=>{let prevented=false;listeners.get('wheel')({defaultPrevented:false,cancelable:true,ctrlKey:false,metaKey:false,shiftKey:false,deltaX:0,deltaY:120,deltaMode:0,target:new Element(),preventDefault:()=>prevented=true,...extra});return prevented;};
 const flush=()=>{let steps=0;while(frames.size&&steps++<250){time+=16;const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn(time));}assert(steps<250,'wheel easing terminates with rounded scroll positions');};
 return {window,frames,listeners,wheel,flush,cleanup,Element};
}
const wheel=wheelHarness();assert(wheel.wheel());assert.equal(wheel.window.scrollY,0);wheel.flush();assert.equal(wheel.window.scrollY,120);
assert(!wheel.wheel({deltaY:12}));assert(!wheel.wheel({ctrlKey:true}));assert(!wheel.wheel({target:new wheel.Element(true)}));assert(!wheel.wheel({target:new wheel.Element(false,true)}));
wheel.wheel({deltaY:9000});wheel.flush();assert.equal(wheel.window.scrollY,2000);wheel.wheel({deltaY:-9000});wheel.flush();assert.equal(wheel.window.scrollY,0);
wheel.wheel();wheel.listeners.get('veloce:navigate')();assert.equal(wheel.frames.size,0);wheel.cleanup();assert.equal(wheel.listeners.size,0);
assert(!wheelHarness({reduced:true}).wheel());assert(!wheelHarness({fine:false}).wheel());

const motion=fs.readFileSync(path.join(root,'app/refinement.tsx'),'utf8');
const refinements=fs.readFileSync(path.join(root,'app/refinement.css'),'utf8');
const baseStyles=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
assert(motion.includes('glass-reflection'), 'Glass reflection replaces travelling border');
assert(!motion.includes('className="edge-light"'), 'No travelling border is rendered');
assert(!refinements.includes('mask-composite'), 'No composite mask dependency for edge lights');
assert(refinements.includes('.header-search>.svg-icon{display:inline-block'), 'Search icon remains visible');
assert(!/\.header-search span/.test(refinements), 'Search label rules cannot hide icon');
assert(refinements.includes('.app-header{background:var(--surface)'), 'Opaque sticky header');
assert(refinements.includes('.critical-panel button>.status{display:flex'), 'Status dot and label stay on one line');
assert(!/\.critical-panel button:hover\{[^}]*padding/.test(baseStyles), 'Hover preserves row geometry');
const finish=fs.readFileSync(path.join(root,'app/interface.css'),'utf8');
assert(finish.includes('.header-inner .desktop-nav button:hover {background:linear-gradient(145deg,#292B28,#111411)'), 'Approved black hover must remain');
assert(finish.includes('.header-inner .desktop-nav button.active,.header-inner .desktop-nav button.active:hover {background:linear-gradient(145deg,#292B28,#111411)'), 'Approved black active state must remain');
assert(source.includes('<span>Buscar</span><kbd>⌘K</kbd>'), 'Compact search label fits the reserved header track');
assert(finish.includes('@media(prefers-reduced-motion:reduce){.glass-reflection,.glass-reflection>i'), 'Reduced motion includes glass and instruments');

const {activeNotices,noticeKey}=load('app/notifications.tsx');
assert.equal(activeNotices([]).length,0);
assert.equal(activeNotices(events).length,5);
assert.equal(activeNotices(events)[0].sla,'Atrasado');
assert.equal(activeNotices([{...events[0],stage:'Concluido'}]).length,0);
assert.notEqual(noticeKey(events[0]),noticeKey({...events[0],updated:'agora'}));
let hooks=[],cursor=0,effects=[],selectedId=null;
const nativeDialog={open:false,showModal(){this.open=true;},close(){this.open=false;}};
const hookReact={...React,useState:(initial)=>{const index=cursor++;if(!(index in hooks))hooks[index]=initial;return [hooks[index],value=>{hooks[index]=typeof value==='function'?value(hooks[index]):value;}];},useRef:()=>({current:nativeDialog}),useEffect:fn=>effects.push(fn),useMemo:fn=>fn()};
const {NotificationBell}=load('app/notifications.tsx',null,{__modules:{react:hookReact}});
const elements=node=>!React.isValidElement(node)?Array.isArray(node)?node.flatMap(elements):[]:[node,...elements(node.props.children)];
function notificationRender(){cursor=0;effects=[];const tree=NotificationBell({events,onSelect:id=>selectedId=id});effects.forEach(fn=>fn());return elements(tree);}
let nodes=notificationRender();
let trigger=nodes.find(node=>node.props.className==='notification-trigger');
assert.equal(trigger.props['aria-expanded'],false);
trigger.props.onClick();nodes=notificationRender();assert.equal(nativeDialog.open,true);
const markAll=nodes.find(node=>node.type==='button'&&node.props.children==='Marcar todas como lidas');
markAll.props.onClick();nodes=notificationRender();assert(nodes.find(node=>node.props.className==='notification-trigger').props['aria-label'].includes('0 não lidas'));
const onlyUnread=nodes.find(node=>node.type==='button'&&typeof node.props['aria-pressed']==='boolean');
onlyUnread.props.onClick();nodes=notificationRender();assert(nodes.some(node=>node.props.className==='notification-empty'));
nodes.find(node=>node.type==='button'&&typeof node.props['aria-pressed']==='boolean').props.onClick();nodes=notificationRender();
nodes.find(node=>typeof node.props.className==='string'&&node.props.className.startsWith('notification-item')).props.onClick();notificationRender();assert(selectedId);assert.equal(nativeDialog.open,false);
console.log('PASS: notification open, mark all, unread filter, empty state, event selection and close.');
assert(motion.includes('document.hidden')&&motion.includes('IntersectionObserver')&&motion.includes('prefers-reduced-motion'));
assert(motion.includes('event.pointerType!=="mouse"'));
assert(!motion.includes('setState('));
for(const font of ['regular','medium','semibold'])assert(fs.statSync(path.join(root,`public/fonts/poppins-${font}.woff`)).size>1000);
console.log('PASS: 7 workspace server renders; 5 chart data states; scroll easing, cancellation and reduced motion; local fonts and motion guards.');
console.log('Scope: structural and unit tests only; no real-device/browser visual verification.');
