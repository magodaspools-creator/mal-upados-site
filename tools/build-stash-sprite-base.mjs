#!/usr/bin/env node
/**
 * Gera a base real de sprites do Stash Analyzer a partir dos assets do cliente Tibia.
 *
 * No Linux, se nenhum caminho for informado, tenta automaticamente:
 *   ~/.local/share/CipSoft GmbH/Tibia/packages/Tibia/assets
 *
 * Uso rápido:
 *   cd tools
 *   npm install
 *   npm run build-stash-base -- --ranges 1-52000
 *
 * Uso explícito:
 *   node build-stash-sprite-base.mjs --appearances /caminho/appearances.dat --catalog /caminho/catalog-content.json --output ../stash-sprites --ranges 1-52000
 *
 * Metadados opcionais:
 *   --metadata ./stash-items.json
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { Generator } from 'tibia-assets';

function arg(name, fallback = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

async function exists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}

async function findAssets() {
  const home = os.homedir();
  const candidates = [
    path.join(home, '.local/share/CipSoft GmbH/Tibia/packages/Tibia/assets'),
    path.join(home, '.local/share/CipSoft GmbH/Tibia/packages/Tibia'),
    path.join(home, 'Games/Tibia/assets')
  ];
  for (const dir of candidates) {
    if (await exists(path.join(dir, 'catalog-content.json'))) return dir;
  }
  return null;
}

const assetsDir = await findAssets();
const appearancesArg = arg('--appearances');
const catalogArg = arg('--catalog');
let appearances = appearancesArg;
if (!appearances && assetsDir) {
  const files = await fs.readdir(assetsDir);
  const dat = files.find(f => /^appearances.*\.dat$/i.test(f));
  if (dat) appearances = path.join(assetsDir, dat);
}
const catalog = catalogArg || (assetsDir ? path.join(assetsDir, 'catalog-content.json') : null);
const output = arg('--output', '../stash-sprites');
const metadataPath = arg('--metadata');
const idsArg = arg('--ids');
const rangesArg = arg('--ranges', '1-52000');
const concurrency = Math.max(1, Number(arg('--concurrency', '6')) || 6);

if (!appearances || !catalog || !(await exists(appearances)) || !(await exists(catalog))) {
  console.error('Não encontrei os assets do Tibia. Informe --appearances e --catalog.');
  console.error('Linux padrão: ~/.local/share/CipSoft GmbH/Tibia/packages/Tibia/assets');
  process.exit(1);
}

await fs.mkdir(output, { recursive: true });
const metadata = metadataPath ? JSON.parse(await fs.readFile(metadataPath, 'utf8')) : [];
const byId = new Map((Array.isArray(metadata) ? metadata : []).map(x => [Number(x.id ?? x.itemId), x]));

const generator = new Generator(appearances, catalog, true);
await generator.init();

function expandRanges(text) {
  const ids = new Set();
  for (const part of String(text || '').split(',')) {
    const [a, b] = part.split('-').map(Number);
    if (!Number.isFinite(a)) continue;
    const end = Number.isFinite(b) ? b : a;
    for (let id = a; id <= end; id++) ids.add(id);
  }
  return [...ids].sort((a, b) => a - b);
}

const ids = expandRanges(idsArg || rangesArg);
const items = [];
let cursor = 0;
let ok = 0;

async function worker() {
  while (true) {
    const index = cursor++;
    if (index >= ids.length) return;
    const id = ids[index];
    try {
      const filename = `${id}.png`;
      const target = path.join(output, filename);
      if (!(await exists(target))) {
        const buffer = await generator.getItem(id);
        if (!buffer?.length) continue;
        await fs.writeFile(target, Buffer.from(buffer));
      }
      const meta = byId.get(id) || {};
      items.push({
        id,
        name: meta.name || '',
        npcPrice: Number(meta.npcPrice || 0) || 0,
        marketPrice: Number(meta.marketPrice || 0) || 0,
        src: filename
      });
      ok++;
      if (ok % 250 === 0) console.log(`Gerados/reutilizados: ${ok}/${ids.length}`);
    } catch (error) {
      console.warn(`Ignorado ${id}: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, ids.length) }, worker));
items.sort((a, b) => a.id - b.id);

const manifest = {
  version: 2,
  generatedAt: new Date().toISOString(),
  source: 'local Tibia client assets via tibia-assets',
  sourceAssets: { appearances, catalog },
  baseUrl: './',
  total: items.length,
  items
};
await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Concluído: ${items.length} sprites válidos em ${output}`);
console.log('Agora publique a pasta stash-sprites junto do site para o matcher carregar a base.');
