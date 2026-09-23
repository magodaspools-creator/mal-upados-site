import datetime
import json
import os
import urllib.parse
import urllib.request

GUILD = "Mal Upados"
BASE = "https://api.tibiadata.com/v4"
HISTORICO_LEVEL = "historico.json"
HISTORICO_XP = "historico_xp.json"
MAX_SNAPSHOTS = 2
MAX_HIGHSCORE_ENTRIES = 1000


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
    return get_json(url)


def load_json(path, default):
    if not os.path.exists(path):
        return default
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def keep_last_snapshots(history):
    dates = sorted(
        key for key, value in history.items()
        if isinstance(value, dict) and "captured_at" in value
    )
    keep = set(dates[-MAX_SNAPSHOTS:])
    return {key: value for key, value in history.items() if key in keep}


guild_data = get_json(f"{BASE}/guild/{urllib.parse.quote(GUILD)}")
guild = guild_data["guild"]
membros = guild["members"]
world = guild["world"]

captured_at = datetime.datetime.now(datetime.timezone.utc)
hoje = captured_at.date().isoformat()
captured_at_iso = captured_at.isoformat().replace("+00:00", "Z")

nomes_guild = {m["name"].casefold() for m in membros}
experiencias = {}
fontes = {}

# TibiaData expõe o total de páginas do Highscore. Percorremos apenas
# o necessário para cobrir o Top 1000, sem consultar páginas adicionais.
first_page = 1
total_pages = 1
processed_entries = 0

try:
    first_data = get_highscore_page(world, first_page)
    total_pages = int(
        first_data.get("highscores", {})
        .get("highscore_page", {})
        .get("total_pages") or 1
    )
except Exception as exc:
    raise RuntimeError(
        f"Falha ao consultar TibiaData pagina 1: {exc}"
    ) from exc

for page in range(1, total_pages + 1):
    try:
        data = first_data if page == 1 else get_highscore_page(world, page)
        entries = data.get("highscores", {}).get("highscore_list", [])
    except Exception as exc:
        print(f"Falha ao consultar TibiaData pagina {page}/{total_pages}: {exc}")
        continue

    for item in entries:
        processed_entries += 1
        nome = str(item.get("name", "")).strip()
        if nome and nome.casefold() in nomes_guild:
            value = item.get("value")
            if isinstance(value, int) and value >= 0:
                experiencias[nome.casefold()] = value
                fontes[nome.casefold()] = "TibiaData/highscores"

        if processed_entries >= MAX_HIGHSCORE_ENTRIES:
            break

    if processed_entries >= MAX_HIGHSCORE_ENTRIES:
        break


# Level e XP usam o mesmo snapshot e o mesmo horario de coleta.
level_historico = load_json(HISTORICO_LEVEL, {})
level_historico[hoje] = {m["name"]: m["level"] for m in membros}
save_json(HISTORICO_LEVEL, level_historico)


xp_historico = load_json(HISTORICO_XP, {})

# Migração única do formato antigo (um dicionário de jogadores por data)
# para o formato com timestamp + members. O horário 10:00 UTC corresponde
# à coleta agendada das 07:00 no horário de Brasília.
migrated_xp = {}
for date, snapshot in xp_historico.items():
    if not isinstance(snapshot, dict):
        continue
    if isinstance(snapshot.get("members"), dict) and snapshot.get("captured_at"):
        migrated_xp[date] = snapshot
    elif date == str(date):
        migrated_xp[date] = {
            "captured_at": f"{date}T10:00:00Z",
            "world": world,
            "members": snapshot,
        }
xp_historico = migrated_xp

xp_historico[hoje] = {
    "captured_at": captured_at_iso,
    "world": world,
    "members": {
        m["name"]: {
            "level": m["level"],
            "experience": experiencias.get(m["name"].casefold()),
            "experience_exact": m["name"].casefold() in experiencias,
            "experience_source": fontes.get(m["name"].casefold()),
        }
        for m in membros
    },
}
xp_historico = keep_last_snapshots(xp_historico)
save_json(HISTORICO_XP, xp_historico)

exatos = sum(
    1
    for v in xp_historico[hoje]["members"].values()
    if v["experience_exact"]
)
print(
    f"Historico atualizado: {hoje} {captured_at_iso} | mundo: {world} | "
    f"membros: {len(membros)} | XP exata: {exatos}/{len(membros)} | "
    f"entradas processadas: {processed_entries}/{MAX_HIGHSCORE_ENTRIES} | "
    f"paginas consultadas: {min(total_pages, (processed_entries + 99) // 100)} | "
    f"fonte: TibiaData/highscores"
)
