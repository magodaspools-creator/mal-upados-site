#!/usr/bin/env node
/**
 * Gera a base de sprites do Stash Analyzer a partir dos assets do cliente Tibia.
 *
 * O resultado é otimizado para o navegador: cada item recebe fingerprint e
 * métricas visuais no manifest, permitindo match exato sem carregar milhares
 * de PNGs. As imagens só são carregadas quando um candidato precisa de
 * comparação pixel a pixel.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { Generator } from 'tibia-assets';

const TILE = 32;
const MASK_BOTTOM = 5;
const MASK_RIGHT = 2;

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

function hashBytes(data) {
  let h = 2166136261;
  for (let i = 0; i < data.length; i++) {
    h ^= data[i];
    h = Math.imul(h, 16777619);
  }
  return ('00000000' + (h >>> 0).toString(16)).slice(-8);
}

function fingerprint(raw) {
  const { data, info } = raw;
  const bytes = [];
  for (let y = 0; y < TILE; y++) {
    for (let x = 0; x < TILE; x++) {
      if (y >= TILE - MASK_BOTTOM || x >= TILE - MASK_RIGHT) continue;
      const i = (y * info.width + x) * 4;
      const a = data[i + 3];
      if (a === 0) bytes.push(0, 0, 0, 0);
      else bytes.push(data[i], data[i + 1], data[i + 2], 255);
    }
  }
  return hashBytes(bytes);
}

function visualStats(raw) {
  const { data, info } = raw;
  let sum = 0, sumSq = 0, count = 0, edge = 0;
  for (let y = 1; y < TILE - 1; y++) {
    for (let x = 1; x < TILE - 1; x++) {
      const i = (y * info.width + x) * 4;
      const lum = .2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2];
      sum += lum;
      sumSq += lum * lum;
      count++;
      const left = (y * info.width + x - 1) * 4;
      const up = ((y - 1) * info.width + x) * 4;
      const ll = .2126 * data[left] + .7152 * data[left + 1] + .0722 * data[left + 2];
      const ul = .2126 * data[up] + .7152 * data[up + 1] + .0722 * data[up + 2];
      edge += Math.abs(lum - ll) + Math.abs(lum - ul);
    }
  }
  const mean = count ? sum / count : 0;
  const variance = count ? Math.max(0, sumSq / count - mean * mean) : 0;
  return { mean, variance, edge };
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

      const raw = await sharp(target).ensureAlpha().resize(TILE, TILE, { fit: 'fill', kernel: 'nearest' }).raw().toBuffer({ resolveWithObject: true });
      const meta = byId.get(id) || {};
      const stats = visualStats(raw);
      items.push({
        id,
        name: meta.name || '',
        npcPrice: Number(meta.npcPrice || 0) || 0,
        marketPrice: Number(meta.marketPrice || 0) || 0,
        fingerprint: fingerprint(raw),
        mean: Number(stats.mean.toFixed(4)),
        variance: Number(stats.variance.toFixed(4)),
        edge: Number(stats.edge.toFixed(4)),
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
  version: 3,
  generatedAt: new Date().toISOString(),
  source: 'local Tibia client assets via tibia-assets',
  sourceAssets: { appearances, catalog },
  baseUrl: './',
  total: items.length,
  items
};
await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Concluído: ${items.length} sprites válidos em ${output}`);
console.log('Manifest otimizado: fingerprints e métricas primeiro; PNGs serão carregados sob demanda.');
