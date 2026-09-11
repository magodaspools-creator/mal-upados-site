#!/usr/bin/env python3
import io
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from PIL import Image
from bs4 import BeautifulSoup

ITEM_IDS_URL = "https://tibia.fandom.com/wiki/Item_IDs"
SPRITE_BASE = "https://item-images.ots.me/latest_otbr/"
OUT = Path("stash-sprites/manifest.json")
MAX_WORKERS = 24


def fingerprint(img: Image.Image) -> str:
    img = img.convert("RGBA").resize((32, 32), Image.Resampling.NEAREST)
    payload = bytearray()
    px = img.load()
    for y in range(32):
        for x in range(32):
            if y >= 27 or x >= 30:
                continue
            r, g, b, a = px[x, y]
            if a == 0:
                payload.extend((0, 0, 0, 0))
            else:
                payload.extend((r, g, b, 255))
    h = 2166136261
    for b in payload:
        h ^= b
        h = (h * 16777619) & 0xffffffff
    return f"{h:08x}"


def metrics(img: Image.Image):
    img = img.convert("RGBA").resize((32, 32), Image.Resampling.NEAREST)
    p = img.load()
    vals = []
    edge = 0.0
    for y in range(1, 31):
        for x in range(1, 31):
            r, g, b, _ = p[x, y]
            lum = .2126*r + .7152*g + .0722*b
            vals.append(lum)
            lr, lg, lb, _ = p[x-1, y]
            ur, ug, ub, _ = p[x, y-1]
            edge += abs(lum-(.2126*lr+.7152*lg+.0722*lb))
            edge += abs(lum-(.2126*ur+.7152*ug+.0722*ub))
    mean = sum(vals)/len(vals) if vals else 0
    variance = max(0, sum((v-mean)**2 for v in vals)/len(vals)) if vals else 0
    return round(mean, 4), round(variance, 4), round(edge, 4)


def parse_items(html):
    soup = BeautifulSoup(html, "html.parser")
    found = {}
    for tr in soup.select("tr"):
        cells = tr.find_all(["td", "th"])
        if len(cells) < 2:
            continue
        name = cells[0].get_text(" ", strip=True)
        raw_id = cells[1].get_text(" ", strip=True)
        if not name or not raw_id or name.lower() in {"item", "name"}:
            continue
        ids = [int(x) for x in re.findall(r"\d+", raw_id)]
        for item_id in ids:
            if 1 <= item_id <= 100000:
                found[item_id] = name
    return found


def fetch_one(item):
    item_id, name = item
    url = f"{SPRITE_BASE}{item_id}.png"
    try:
        r = requests.get(url, timeout=20, headers={"User-Agent": "MalUpados-Stash-Builder/1.0"})
        if r.status_code != 200 or not r.content:
            return None
        img = Image.open(io.BytesIO(r.content)).convert("RGBA")
        if img.width < 8 or img.height < 8:
            return None
        mean, variance, edge = metrics(img)
        return {
            "id": item_id,
            "name": name,
            "src": url,
            "fingerprint": fingerprint(img),
            "mean": mean,
            "variance": variance,
            "edge": edge,
            "marketable": True,
        }
    except Exception:
        return None


def main():
    print("Baixando lista atual de IDs do TibiaWiki/Fandom...")
    r = requests.get(ITEM_IDS_URL, timeout=30, headers={"User-Agent": "MalUpados-Stash-Builder/1.0"})
    r.raise_for_status()
    items = parse_items(r.text)
    print(f"IDs encontrados: {len(items)}")

    out = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = [pool.submit(fetch_one, item) for item in items.items()]
        for i, future in enumerate(as_completed(futures), 1):
            value = future.result()
            if value:
                out.append(value)
            if i % 250 == 0:
                print(f"Sprites processados: {i}/{len(futures)} · válidos: {len(out)}")

    out.sort(key=lambda x: x["id"])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "version": "2026.09.11-remote-15.10+",
        "source": "Tibia item image host + TibiaWiki/Fandom Item IDs",
        "baseUrl": SPRITE_BASE,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "items": out,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Manifest publicado: {OUT} · itens com sprite: {len(out)}")


if __name__ == "__main__":
    main()
