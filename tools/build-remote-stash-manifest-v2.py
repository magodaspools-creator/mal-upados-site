#!/usr/bin/env python3
import io
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from PIL import Image

ITEMS_API = "https://tibiadata.bytewizards.de/api/v1/items"
SPRITE_BASE = "https://item-images.ots.me/latest_otbr/"
OUT = Path("stash-sprites/manifest.json")
PAGE_SIZE = 100
MAX_WORKERS = 64
REQUEST_TIMEOUT = 10


def sprite_fingerprint(img):
    img = img.convert("RGBA").resize((32, 32), Image.Resampling.NEAREST)
    px = img.load()
    payload = bytearray()
    for y in range(32):
        for x in range(32):
            # Ignore the stash quantity area when the sprite is compared with a stash tile.
            if y >= 25 or x < 2 or x >= 30:
                payload.extend((0, 0, 0, 0))
                continue
            r, g, b, a = px[x, y]
            payload.extend((r, g, b, 255) if a > 0 else (0, 0, 0, 0))
    h = 2166136261
    for b in payload:
        h ^= b
        h = (h * 16777619) & 0xffffffff
    return f"{h:08x}"


def sprite_metrics(img):
    img = img.convert("RGBA").resize((32, 32), Image.Resampling.NEAREST)
    p = img.load()
    vals = []
    edge = 0.0
    for y in range(2, 25):
        for x in range(2, 30):
            r, g, b, a = p[x, y]
            if a == 0:
                continue
            lum = .2126 * r + .7152 * g + .0722 * b
            vals.append(lum)
            lr, lg, lb, la = p[x - 1, y]
            ur, ug, ub, ua = p[x, y - 1]
            if la:
                edge += abs(lum - (.2126 * lr + .7152 * lg + .0722 * lb))
            if ua:
                edge += abs(lum - (.2126 * ur + .7152 * ug + .0722 * ub))
    if not vals:
        return 0.0, 0.0, 0.0
    mean = sum(vals) / len(vals)
    variance = sum((v - mean) ** 2 for v in vals) / len(vals)
    return round(mean, 4), round(max(0, variance), 4), round(edge, 4)


def fetch_catalog():
    session = requests.Session()
    headers = {"User-Agent": "MalUpados-Stash-Builder/6.0 (+https://mal-upados.com.br)"}
    first = session.get(ITEMS_API, params={"page": 1, "pageSize": PAGE_SIZE, "sort": "name"}, timeout=REQUEST_TIMEOUT, headers=headers)
    first.raise_for_status()
    data = first.json()
    items = list(data.get("items") or data.get("data", {}).get("items") or [])
    total = int(data.get("totalCount") or data.get("data", {}).get("totalCount") or len(items))
    pages = max(1, (total + PAGE_SIZE - 1) // PAGE_SIZE)
    print(f"Catálogo TibiaData: {total} itens · {pages} páginas")

    def get_page(page):
        if page == 1:
            return items
        r = session.get(ITEMS_API, params={"page": page, "pageSize": PAGE_SIZE, "sort": "name"}, timeout=REQUEST_TIMEOUT, headers=headers)
        r.raise_for_status()
        d = r.json()
        return list(d.get("items") or d.get("data", {}).get("items") or [])

    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = {pool.submit(get_page, page): page for page in range(2, pages + 1)}
        for n, future in enumerate(as_completed(futures), 2):
            page_items = future.result()
            items.extend(page_items)
            if n % 10 == 0 or n == pages:
                print(f"Páginas carregadas: {n}/{pages} · itens: {len(items)}")
    return items


def fetch_one(item):
    item_id = int(item.get("id"))
    name = item.get("name") or ""
    url = f"{SPRITE_BASE}{item_id}.png"
    try:
        r = requests.get(url, timeout=REQUEST_TIMEOUT, headers={"User-Agent": "MalUpados-Stash-Builder/6.0"})
        if r.status_code != 200 or not r.content:
            return None
        img = Image.open(io.BytesIO(r.content)).convert("RGBA")
        if img.width < 8 or img.height < 8:
            return None
        mean, variance, edge = sprite_metrics(img)
        return {
            "id": item_id,
            "name": name,
            "src": url,
            "wikiUrl": item.get("wikiUrl"),
            "fingerprint": sprite_fingerprint(img),
            "mean": mean,
            "variance": variance,
            "edge": edge,
            "marketable": True,
        }
    except Exception:
        return None


def main():
    catalog = fetch_catalog()
    # Deduplicate IDs defensively; the API is the source of names and wiki URLs.
    by_id = {int(x["id"]): x for x in catalog if x.get("id") is not None}
    items = list(by_id.values())
    out = []
    print(f"Baixando sprites: {len(items)} IDs candidatos")
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = [pool.submit(fetch_one, item) for item in items]
        total = len(futures)
        for n, future in enumerate(as_completed(futures), 1):
            value = future.result()
            if value:
                out.append(value)
            if n % 500 == 0 or n == total:
                print(f"Sprites processados: {n}/{total} · válidos: {len(out)}")

    out.sort(key=lambda x: (x["name"].lower(), x["id"]))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "version": "2026.09.11-catalog-v3",
        "source": "TibiaData item catalog + item-images.ots.me/latest_otbr",
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(out),
        "items": out,
    }
    OUT.write_text(json.dumps(payload, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")
    print(f"Manifest publicado: {OUT} · sprites válidos: {len(out)}")


if __name__ == "__main__":
    main()
