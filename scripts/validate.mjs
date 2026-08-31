import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const css = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');
const page = fs.readFileSync(path.join(root, 'app/page.tsx'), 'utf8');
const layout = fs.readFileSync(path.join(root, 'app/layout.tsx'), 'utf8');
const buildId = fs.readFileSync(path.join(root, 'public/build-id.txt'), 'utf8').trim();
const commandSvg = fs.readFileSync(path.join(root, 'public/icons/command.svg'), 'utf8');

const failures = [];
const pass = (condition, message) => { if (!condition) failures.push(message); };

pass(buildId === 'veloce-visao-geral-limpa-v14-2026-08-31', 'build-id incorreto');
pass(css.includes('--title:48px') && css.includes('--subtitle:18px') && css.includes('--legend:15px'), 'escala desktop 48/18/15 ausente');
pass(/@media\(max-width:720px\)[\s\S]*--title:29px;--subtitle:15px;--legend:13px/.test(css), 'escala mobile 29/15/13 ausente');
pass(!css.includes('!important'), 'CSS contém !important');
pass(!/<svg\b/i.test(page), 'TSX contém SVG inline');
pass(page.includes('className="view-transition"') && page.includes('IntersectionObserver'), 'transições de categoria/scroll ausentes');
pass(page.includes('/icons/message.svg') && css.includes('.agent-input-icon'), 'ícone físico do composer ausente');
pass(!/\b(blue|navy|cyan|teal|magenta|purple|green)\b/i.test(css + '\n' + page), 'cor/termo fora da identidade encontrado');
pass(!/\b(copiloto|beta|intelig[eê]ncia|sparkle|glow|m[aá]gico)\b/i.test(page), 'linguagem/estética genérica de IA encontrada');
pass(!/backdrop-filter|radial-gradient/i.test(css), 'efeito glass/glow encontrado');
pass(page.includes('https://images.pexels.com/photos/8866777/'), 'foto real de operação Pexels não configurada');
pass(page.includes('overview-alerts') && page.includes('overview-priorities'), 'nova visão geral essencial ausente');
pass(!page.includes('dashboard-bento') && !page.includes('metrics-cluster') && !page.includes('dashboard-bottom-grid') && !page.includes('activity-card') && !page.includes('vehicle-highlight') && !page.includes('agenda-card'), 'visão geral ainda contém blocos redundantes');
pass(commandSvg.match(/<rect\b/g)?.length === 4 && !/<path\b/.test(commandSvg), 'command.svg não está na geometria física aprovada');
pass(/grid-template-columns:[^;]*minmax\(0,1fr\)/.test(css), 'Auto Layout/grid minmax ausente');
pass(css.includes('@media(max-width:1280px)') && css.includes('@media(max-width:1040px)') && css.includes('@media(max-width:720px)'), 'breakpoints responsivos incompletos');
pass(css.includes('.mobile-nav') && css.includes('.mobile-drawer'), 'navegação mobile incompleta');
pass(page.includes('Dashboard') && page.includes('Esteira') && page.includes('Associados') && page.includes('Rede') && page.includes('Documentos') && page.includes('Rotinas') && page.includes('Assistente'), 'workspaces do produto incompletos');
pass(page.includes('Novo associado') && page.includes('Novo evento') && page.includes('EventDrawer') && page.includes('moveEvent'), 'ações operacionais principais ausentes');
pass(layout.includes('pt-BR') && layout.includes('globals.css'), 'layout raiz incompleto');

// Nenhum pixel explícito abaixo do piso fora do breakpoint mobile.
const mobileMarker = '/* Mobile — hierarchy fixed: 29 / 15 / 13 */';
const [desktopCss, mobileCss = ''] = css.split(mobileMarker);
const desktopSizes = [...desktopCss.matchAll(/font-size:\s*([0-9.]+)px/g)].map(m => Number(m[1]));
const mobileSizes = [...mobileCss.matchAll(/font-size:\s*([0-9.]+)px/g)].map(m => Number(m[1]));
pass(desktopSizes.every(n => n >= 15), `microtexto desktop encontrado: ${Math.min(...desktopSizes)}px`);
pass(mobileSizes.every(n => n >= 13), `microtexto mobile encontrado: ${Math.min(...mobileSizes)}px`);

const svgFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.svg')) svgFiles.push(full);
  }
}
walk(path.join(root, 'public'));
pass(svgFiles.length >= 46, `quantidade de SVGs físicos abaixo do esperado: ${svgFiles.length}`);
pass(fs.readdirSync(path.join(root, 'public/charts')).filter(f => f.endsWith('.svg')).length === 4, 'micrográficos físicos incompletos');

if (failures.length) {
  console.error('VALIDACAO FALHOU');
  failures.forEach(x => console.error(`- ${x}`));
  process.exit(1);
}

console.log('VALIDACAO PASSOU');
console.log(`build-id: ${buildId}`);
console.log(`SVGs fisicos: ${svgFiles.length}`);
console.log(`menor font-size explicito desktop: ${Math.min(...desktopSizes)}px`);
console.log(`menor font-size explicito mobile: ${Math.min(...mobileSizes)}px`);
