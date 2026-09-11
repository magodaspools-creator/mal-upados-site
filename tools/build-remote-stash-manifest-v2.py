#!/usr/bin/env python3
import io
import json
import re
import time
import zipfile
from pathlib import Path
from urllib.parse import quote
import xml.etree.ElementTree as ET

import requests
from PIL import Image

XML_URL = "https://raw.githubusercontent.com/opentibiabr/canary/main/data/items/items.xml"
ZIP_URL = "https://downloads.ots.me/data/item-images/latest_otbr.zip"
OUT = Path("stash-sprites/manifest.json")
REQUEST_TIMEOUT = 60


def sprite_fingerprint(img):
    img = img.convert("RGBA").resize((32, 32), Image.Resampling.NEAREST)
    px = img.load()
    payload = bytearray()
    for y in range(32):
        for x in range(32):
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


def load_item_names(session):
    print("Baixando catálogo de nomes/IDs do Canary...")
    r = session.get(XML_URL, timeout=REQUEST_TIMEOUT, headers={"User-Agent": "MalUpados-Stash-Builder/7.0"})
    r.raise_for_status()
    root = ET.fromstring(r.content.decode("ISO-8859-1"))
    names = {}
    for item in root.findall("item"):
        name = (item.get("name") or "").strip()
        if not name or name.upper() == "RESERVED SPRITE":
            continue
        if item.get("id") is not None:
            try:
                names[int(item.get("id"))] = name
            except ValueError:
                pass
        if item.get("fromid") is not None and item.get("toid") is not None:
            try:
                lo, hi = int(item.get("fromid")), int(item.get("toid"))
                if hi - lo <= 500:
                    for item_id in range(lo, hi + 1):
                        names.setdefault(item_id, name)
            except ValueError:
                pass
    print(f"IDs nomeados: {len(names)}")
    return names


def wiki_url(name):
    return "https://tibia.fandom.com/wiki/" + quote(name.replace(" ", "_"), safe="()_-")


def build_manifest(session, names):
    print("Baixando pacote completo latest_otbr...")
    r = session.get(ZIP_URL, timeout=REQUEST_TIMEOUT, headers={"User-Agent": "MalUpados-Stash-Builder/7.0"})
    r.raise_for_status()
    print(f"Pacote: {len(r.content) / 1024 / 1024:.1f} MB")
    out = []
    with zipfile.ZipFile(io.BytesIO(r.content)) as zf:
        files = [n for n in zf.namelist() if n.lower().endswith(".png")]
        print(f"Sprites PNG encontrados: {len(files)}")
        for n, member in enumerate(files, 1):
            base = Path(member).stem
            if not re.fullmatch(r"\d+", base):
                continue
            item_id = int(base)
            name = names.get(item_id, f"Item ID {item_id}")
            try:
                raw = zf.read(member)
                img = Image.open(io.BytesIO(raw)).convert("RGBA")
                if img.width < 8 or img.height < 8:
                    continue
                mean, variance, edge = sprite_metrics(img)
                out.append({
                    "id": item_id,
                    "name": name,
                    "src": f"https://item-images.ots.me/latest_otbr/{item_id}.png",
                    "wikiUrl": wiki_url(name),
                    "fingerprint": sprite_fingerprint(img),
                    "mean": mean,
                    "variance": variance,
                    "edge": edge,
                    "marketable": True,
                })
            except Exception:
                continue
            if n % 1000 == 0:
                print(f"Sprites processados: {n}/{len(files)}")
    by_id = {x["id"]: x for x in out}
    out = sorted(by_id.values(), key=lambda x: (x["name"].lower(), x["id"]))
    return out


def main():
    session = requests.Session()
    names = load_item_names(session)
    out = build_manifest(session, names)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "version": "2026.09.11-catalog-v4",
        "source": "Canary items.xml + OTS.ME latest_otbr sprite pack",
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(out),
        "items": out,
    }
    OUT.write_text(json.dumps(payload, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")
    print(f"Manifest publicado: {OUT} · sprites válidos: {len(out)}")


if __name__ == "__main__":
    main()
