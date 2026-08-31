import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
const tsx=fs.readFileSync(path.join(root,'app/page.tsx'),'utf8');
const failures=[];
for(const term of ['blue','navy','green']) if(new RegExp(term,'i').test(css+'\n'+tsx)) failures.push(`cor proibida/termo encontrado: ${term}`);
if(css.includes('!important')) failures.push('!important encontrado');
if(/<svg\b/i.test(tsx)) failures.push('SVG inline encontrado');
for(const required of ['--title:54px','--subtitle:19px','--legend:15px','--title:33px','--subtitle:15px','--legend:13px']) if(!css.includes(required)) failures.push(`token ausente: ${required}`);
const iconDir=path.join(root,'public/icons');
const icons=fs.readdirSync(iconDir).filter(f=>f.endsWith('.svg'));
if(icons.length<30) failures.push(`poucos SVGs físicos: ${icons.length}`);
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`PASS — ${icons.length} SVGs físicos; tokens tipográficos presentes; sem !important/blue/navy/green/SVG inline.`);
