#!/usr/bin/env python3
import io
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import requests
from PIL import Image

SPRITE_BASE = "https://item-images.ots.me/latest_otbr/"
OUT = Path("stash-sprites/manifest.json")
MAX_WORKERS = 48
MIN_ID = 1
MAX_ID = 60000


def fingerprint(img):
    img = img.convert("RGBA").resize((32, 32), Image.Resampling.NEAREST)
    payload = bytearray(); px = img.load()
    for y in range(32):
        for x in range(32):
            if y >= 27 or x >= 30: continue
            r,g,b,a = px[x,y]
            payload.extend((0,0,0,0) if a == 0 else (r,g,b,255))
    h=2166136261
    for b in payload:
        h ^= b; h=(h*16777619)&0xffffffff
    return f"{h:08x}"


def metrics(img):
    img=img.convert("RGBA").resize((32,32),Image.Resampling.NEAREST); p=img.load(); vals=[]; edge=0.0
    for y in range(1,31):
        for x in range(1,31):
            r,g,b,_=p[x,y]; lum=.2126*r+.7152*g+.0722*b; vals.append(lum)
            lr,lg,lb,_=p[x-1,y]; ur,ug,ub,_=p[x,y-1]
            edge += abs(lum-(.2126*lr+.7152*lg+.0722*lb)); edge += abs(lum-(.2126*ur+.7152*ug+.0722*ub))
    mean=sum(vals)/len(vals); variance=sum((v-mean)**2 for v in vals)/len(vals)
    return round(mean,4),round(max(0,variance),4),round(edge,4)


def fetch_one(item_id):
    url=f"{SPRITE_BASE}{item_id}.png"
    try:
        r=requests.get(url,timeout=12,headers={"User-Agent":"MalUpados-Stash-Builder/5.0"})
        if r.status_code != 200 or not r.content: return None
        img=Image.open(io.BytesIO(r.content)).convert("RGBA")
        if img.width < 8 or img.height < 8: return None
        mean,var,edge=metrics(img)
        return {"id":item_id,"name":None,"src":url,"fingerprint":fingerprint(img),"mean":mean,"variance":var,"edge":edge,"marketable":True}
    except Exception:
        return None


def main():
    ids=range(MIN_ID,MAX_ID+1); out=[]
    print(f"Varredura direta de sprites: IDs {MIN_ID}..{MAX_ID}")
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures=[pool.submit(fetch_one,i) for i in ids]
        total=len(futures)
        for n,f in enumerate(as_completed(futures),1):
            v=f.result()
            if v: out.append(v)
            if n%1000==0 or n==total: print(f"IDs testados: {n}/{total} · sprites válidos: {len(out)}")
    out.sort(key=lambda x:x["id"])
    OUT.parent.mkdir(parents=True,exist_ok=True)
    payload={"version":"2026.09.11-direct-id-scan","source":"item-images.ots.me/latest_otbr","generatedAt":time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime()),"range":[MIN_ID,MAX_ID],"items":out}
    OUT.write_text(json.dumps(payload,separators=(",",":")),encoding="utf-8")
    print(f"Manifest publicado: {OUT} · sprites válidos: {len(out)}")

if __name__ == "__main__": main()
