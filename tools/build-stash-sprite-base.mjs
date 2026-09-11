#!/usr/bin/env node
/**
 * Gera a base usada pelo Stash Analyzer a partir dos assets do cliente Tibia.
 *
 * Requisitos:
 *   npm install tibia-assets
 *
 * Uso:
 *   node tools/build-stash-sprite-base.mjs \
 *     --appearances /caminho/appearances.dat \
 *     --catalog /caminho/catalog-content.json \
 *     --output ./stash-sprites
 *
 * Opcionalmente, um JSON de metadados pode ser informado com --metadata.
 * Formato aceito: [{"id":3031,"name":"gold coin","npcPrice":1,"marketPrice":0}]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { Generator } from 'tibia-assets';

function arg(name, fallback = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const appearances = arg('--appearances');
const catalog = arg('--catalog');
const output = arg('--output', './stash-sprites');
const metadataPath = arg('--metadata');

if (!appearances || !catalog) {
  console.error('Uso: --appearances <appearances.dat> --catalog <catalog-content.json> [--output <dir>] [--metadata <json>]');
  process.exit(1);
}

await fs.mkdir(output, { recursive: true });
const metadata = metadataPath ? JSON.parse(await fs.readFile(metadataPath, 'utf8')) : [];
const byId = new Map((Array.isArray(metadata) ? metadata : []).map(x => [Number(x.id ?? x.itemId), x]));

const generator = new Generator(appearances, catalog, true);
await generator.init();

// A lista de IDs vem das appearances carregadas pelo pacote.
// O gerador não expõe uma API pública estável para enumerá-las em todas as versões,
// então aceitamos --ids para bases seletivas e usamos ranges quando fornecidos.
const idsArg = arg('--ids');
const rangesArg = arg('--ranges');

function expandRanges(text) {
  if (!text) return [];
  const ids = new Set();
  for (const part of text.split(',')) {
    const [a, b] = part.split('-').map(Number);
    if (!Number.isFinite(a)) continue;
    const end = Number.isFinite(b) ? b : a;
    for (let id = a; id <= end; id++) ids.add(id);
  }
  return [...ids].sort((a, b) => a - b);
}

const ids = idsArg ? expandRanges(idsArg) : expandRanges(rangesArg);
if (!ids.length) {
  console.error('Informe --ids 3031,3043,3050 ou --ranges 1-5000.');
  process.exit(1);
}

const items = [];
let ok = 0;
for (const id of ids) {
  try {
    const buffer = await generator.getItem(id);
    if (!buffer?.length) continue;
    const filename = `${id}.png`;
    await fs.writeFile(path.join(output, filename), Buffer.from(buffer));
    const meta = byId.get(id) || {};
    items.push({
      id,
      name: meta.name || '',
      npcPrice: Number(meta.npcPrice || 0) || 0,
      marketPrice: Number(meta.marketPrice || 0) || 0,
      src: filename
    });
    ok++;
    if (ok % 100 === 0) console.log(`Gerados: ${ok}`);
  } catch (error) {
    console.warn(`Ignorado ${id}: ${error.message}`);
  }
}

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: 'Tibia client assets via tibia-assets',
  baseUrl: './',
  total: items.length,
  items
};
await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Concluído: ${items.length} sprites em ${output}`);
