import datetime
import json
import os
import urllib.parse
import urllib.request

GUILD = "Mal Upados"
BASE = "https://api.tibiadata.com/v4"
HISTORICO_LEVEL = "historico.json"
HISTORICO_XP = "historico_xp.json"
TOP_PAGES = 20


def get_json(url):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mal-Upados/1.0 (fansite)"},
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def get_highscore_page(world, page):
    url = (
        f"{BASE}/highscores/"
        f"{urllib.parse.quote(world)}/experience/all/{page}"
    )
    data = get_json(url)
    return data.get("highscores", {}).get("highscore_list", [])


guild_data = get_json(f"{BASE}/guild/{urllib.parse.quote(GUILD)}")
guild = guild_data["guild"]
membros = guild["members"]
world = guild["world"]
hoje = datetime.date.today().isoformat()

historico = {}
if os.path.exists(HISTORICO_LEVEL):
    with open(HISTORICO_LEVEL, "r", encoding="utf-8") as f:
        historico = json.load(f)

historico[hoje] = {m["name"]: m["level"] for m in membros}
with open(HISTORICO_LEVEL, "w", encoding="utf-8") as f:
    json.dump(historico, f, ensure_ascii=False, indent=2)

nomes_guild = {m["name"].casefold() for m in membros}
experiencias = {}
fontes = {}

for page in range(1, TOP_PAGES + 1):
    try:
        entries = get_highscore_page(world, page)
    except Exception as exc:
        print(f"Falha ao consultar TibiaData pagina {page}: {exc}")
        continue

    if not entries:
        break

    for item in entries:
        nome = str(item.get("name", "")).strip()
        if not nome or nome.casefold() not in nomes_guild:
            continue

        value = item.get("value")
        if isinstance(value, int):
            experiencias[nome.casefold()] = value
            fontes[nome.casefold()] = "TibiaData/highscores"

    if len(experiencias) == len(nomes_guild):
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
        "experience_vocation": fontes.get(m["name"].casefold()),
    }
    for m in membros
}

with open(HISTORICO_XP, "w", encoding="utf-8") as f:
    json.dump(xp_historico, f, ensure_ascii=False, indent=2)

exatos = sum(1 for v in xp_historico[hoje].values() if v["experience_exact"])
print(
    f"Historico atualizado: {hoje} | mundo: {world} | "
    f"membros: {len(membros)} | XP exata: {exatos}/{len(membros)} | "
    f"fonte: TibiaData/all"
)
