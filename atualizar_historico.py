import datetime
import json
import os
import urllib.parse
import urllib.request

GUILD = "Mal Upados"
BASE = "https://api.tibiadata.com/v4"
HISTORICO_LEVEL = "historico.json"
HISTORICO_XP = "historico_xp.json"
MAX_PAGES = 10


def get_json(url):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mal-Upados/1.0 (fansite)"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


guild_url = f"{BASE}/guild/{urllib.parse.quote(GUILD)}"
data = get_json(guild_url)
guild = data["guild"]
membros = guild["members"]
world = guild["world"]
hoje = datetime.date.today().isoformat()

# Mantem o historico antigo de levels intacto.
historico = {}
if os.path.exists(HISTORICO_LEVEL):
    with open(HISTORICO_LEVEL, "r", encoding="utf-8") as f:
        historico = json.load(f)
historico[hoje] = {m["name"]: m["level"] for m in membros}
with open(HISTORICO_LEVEL, "w", encoding="utf-8") as f:
    json.dump(historico, f, ensure_ascii=False, indent=2)

# XP exata vem do highscore de Experience do mundo.
# O endpoint de personagem/guilda fornece level, mas nao a XP total.
# Procuramos ate 10 paginas (ate 3000 personagens) para cobrir a guilda.
experiencias = {}
for page in range(1, MAX_PAGES + 1):
    url = f"{BASE}/highscores/{urllib.parse.quote(world)}/experience/all/{page}"
    try:
        hs = get_json(url).get("highscores", {})
        for item in hs.get("highscore_list", []):
            nome = item.get("name")
            valor = item.get("value")
            if nome and isinstance(valor, int):
                experiencias[nome.casefold()] = valor
        pagina = hs.get("highscore_page", {})
        total = int(pagina.get("total_pages") or page)
        if page >= min(total, MAX_PAGES):
            break
    except Exception as exc:
        print(f"Falha ao consultar highscores pagina {page}: {exc}")
        break

xp_historico = {}
if os.path.exists(HISTORICO_XP):
    with open(HISTORICO_XP, "r", encoding="utf-8") as f:
        xp_historico = json.load(f)

xp_historico[hoje] = {
    m["name"]: {
        "level": m["level"],
        "experience": experiencias.get(m["name"].casefold()),
        "experience_exact": m["name"].casefold() in experiencias,
    }
    for m in membros
}

with open(HISTORICO_XP, "w", encoding="utf-8") as f:
    json.dump(xp_historico, f, ensure_ascii=False, indent=2)

exatos = sum(1 for v in xp_historico[hoje].values() if v["experience_exact"])
print(f"Historico atualizado: {hoje} | mundo: {world} | membros: {len(membros)} | XP exata: {exatos}/{len(membros)}")
