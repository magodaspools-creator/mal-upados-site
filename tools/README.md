# Stash Analyzer — base de sprites

A base visual precisa ser gerada a partir do cliente Tibia instalado localmente. O site não baixa nem distribui os assets proprietários do cliente.

## Linux

O gerador procura automaticamente por:

`~/.local/share/CipSoft GmbH/Tibia/packages/Tibia/assets`

Depois:

```bash
cd tools
npm install
npm run build-stash-base -- --ranges 1-52000
```

A saída será criada em:

`../stash-sprites/`

com `manifest.json` e os PNGs dos itens encontrados.

Se o Tibia estiver em outro local:

```bash
npm run build-stash-base -- \
  --appearances /caminho/appearances-XXXX.dat \
  --catalog /caminho/catalog-content.json \
  --ranges 1-52000
```

O intervalo cobre IDs atuais conhecidos acima de 50 mil; a base pode ser ampliada depois sem refazer os arquivos já gerados.

## Próxima integração

Depois que `stash-sprites/manifest.json` existir, o próximo passo é ligar a base ao matcher do `stash-recognition.js` para transformar os 220 recortes em `item ID → nome → quantidade → preço`.
