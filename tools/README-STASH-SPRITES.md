# Base de sprites do Stash

O site agora procura automaticamente `stash-sprites/manifest.json`.

A base precisa ser gerada a partir dos assets do cliente Tibia correspondente à versão do print. O pacote comunitário `tibia-assets` consegue renderizar PNGs de itens usando `appearances.dat` + `catalog-content.json`; isso evita usar nomes ou sprites aproximados. Fontes atuais desse pipeline: `phacUFPE/npm-tibia-assets` e `tilaven/tibia-sprites-exporter`.

## Gerar

Na máquina que possui os assets do Tibia:

```bash
npm install tibia-assets
node tools/build-stash-sprite-base.mjs \
  --appearances /caminho/appearances.dat \
  --catalog /caminho/catalog-content.json \
  --ranges 1-50000 \
  --output ./stash-sprites
```

Para uma base menor durante o teste:

```bash
node tools/build-stash-sprite-base.mjs \
  --appearances /caminho/appearances.dat \
  --catalog /caminho/catalog-content.json \
  --ids 3031,3043,3050 \
  --output ./stash-sprites
```

Depois, publique a pasta `stash-sprites/` no mesmo diretório do `stash.html`. O navegador carrega `manifest.json` sozinho.

## Metadados

Opcionalmente use `--metadata arquivo.json` para incluir nomes e preços no manifesto:

```json
[
  {"id":3031,"name":"gold coin","npcPrice":1,"marketPrice":0}
]
```

O matcher não deve transformar um candidato visual em nome por IA. Sem sprite compatível, o resultado correto é `unknown`; com sprites idênticos, o resultado deve ser `ambiguous`.
