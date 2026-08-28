import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'app', 'page.tsx');
const cssPath = path.join(root, 'app', 'globals.css');
const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const iconTypeStart = page.indexOf('type IconName');
const iconTypeEnd = page.indexOf(';', iconTypeStart);
if (iconTypeStart < 0 || iconTypeEnd < 0) throw new Error('IconName type not found');
const iconSegment = page.slice(iconTypeStart, iconTypeEnd);
const icons = [...iconSegment.matchAll(/"([A-Za-z0-9]+)"/g)].map((m) => m[1]);
const missingIcons = icons.filter((name) => !fs.existsSync(path.join(root, 'public', 'icons', `${name}.svg`)));
if (missingIcons.length) throw new Error(`Missing SVG icons: ${missingIcons.join(', ')}`);
if (/<svg\b|<path\b|<circle\b|<rect\b/.test(page)) throw new Error('Inline SVG markup found in app/page.tsx');
if (/[\u{1F300}-\u{1FAFF}]/u.test(page)) throw new Error('Emoji found in app/page.tsx');

const requiredAssets = ['member-main.jpg', 'member-avatar.jpg', 'veloce-mark.svg', 'favicon.svg'];
const missingAssets = requiredAssets.filter((name) => !fs.existsSync(path.join(root, 'public', name)));
if (missingAssets.length) throw new Error(`Missing public assets: ${missingAssets.join(', ')}`);

let braces = 0;
let parens = 0;
for (const char of css) {
  if (char === '{') braces += 1;
  if (char === '}') braces -= 1;
  if (char === '(') parens += 1;
  if (char === ')') parens -= 1;
  if (braces < 0 || parens < 0) throw new Error('CSS delimiter imbalance detected');
}
if (braces !== 0 || parens !== 0) throw new Error(`CSS delimiter imbalance: braces=${braces}, parens=${parens}`);

console.log(`Validation OK: ${icons.length} physical SVG files, no inline SVG, required assets present, CSS balanced.`);
