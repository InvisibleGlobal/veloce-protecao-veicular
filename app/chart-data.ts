export type QueueRecord={stage:string;sla:string};
export function queueMetrics(events:QueueRecord[],stages:{key:string;label:string}[]){
  const distribution=stages.map(stage=>({...stage,count:events.filter(e=>e.stage===stage.key).length}));
  const deadlines=[
    {key:"Dentro",label:"Dentro do prazo",count:events.filter(e=>e.sla==="Dentro").length},
    {key:"Risco",label:"Em risco",count:events.filter(e=>e.sla==="Risco").length},
    {key:"Atrasado",label:"Atrasados",count:events.filter(e=>e.sla==="Atrasado").length}
  ];
  return {distribution,deadlines,total:events.length,max:Math.max(1,...distribution.map(s=>s.count)),within:events.length?Math.round(deadlines[0].count/events.length*100):0};
}
