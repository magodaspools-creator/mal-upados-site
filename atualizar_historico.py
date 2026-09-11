import datetime
import html
import json
import os
import re
import urllib.parse
import urllib.request
from html.parser import HTMLParser

GUILD = "Mal Upados"
TIBIADATA_BASE = "https://api.tibiadata.com/v4"
TIBIA_BASE = "https://www.tibia.com/community/"
HISTORICO_LEVEL = "historico.json"
HISTORICO_XP = "historico_xp.json"

# Tibia.com mostra 50 jogadores por pagina.
TOP_PAGES = 20
VOCATION_IDS = {
    "knight": 2,
    "paladin": 3,
    "sorcerer": 4,
    "druid": 5,
    "monk": 6,
}


def get_json(url):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mal-Upados/1.0 (fansite)"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []
        self.current_row = None
        self.current_cell = None

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.current_row = []
        elif tag == "td" and self.current_row is not None:
            self.current_cell = []

    def handle_data(self, data):
        if self.current_cell is not None:
            self.current_cell.append(data)

    def handle_endtag(self, tag):
        if tag == "td" and self.current_row is not None and self.current_cell is not None:
            text = html.unescape("".join(self.current_cell)).replace("\xa0", " ").strip()
            text = re.sub(r"\s+", " ", text)
            self.current_row.append(text)
            self.current_cell = None
        elif tag == "tr" and self.current_row is not None:
            self.rows.append(self.current_row)
            self.current_row = None
            self.current_cell = None


def get_tibia_highscore_page(world, profession, page):
    params = urllib.parse.urlencode({
        "subtopic": "highscores",
        "world": world,
        "category": 6,
        "profession": profession,
        "currentpage": page,
    })
    url = f"{TIBIA_BASE}?{params}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mal-Upados/1.0 (fansite; XP ranking)"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        content = r.read().decode("utf-8", errors="replace")

    parser = TableParser()
    parser.feed(content)

    entries = {}
    for row in parser.rows:
        if len(row) < 6:
            continue
        if not row[0].isdigit():
            continue
        value_text = re.sub(r"[^0-9-]", "", row[-1])
        level_text = re.sub(r"[^0-9]", "", row[-2])
        if not value_text or not level_text:
            continue
        name = row[1].strip()
        if not name:
            continue
        try:
            entries[name.casefold()] = {
                "name": name,
                "level": int(level_text),
                "experience": int(value_text),
            }
        except ValueError:
            continue

    return entries


guild_url = f"{TIBIADATA_BASE}/guild/{urllib.parse.quote(GUILD)}"
data = get_json(guild_url)
guild = data["guild"]
membros = guild["members"]
world = guild["world"]
hoje = datetime.date.today().isoformat()

# Historico antigo de levels.
historico = {}
if os.path.exists(HISTORICO_LEVEL):
    with open(HISTORICO_LEVEL, "r", encoding="utf-8") as f:
        historico = json.load(f)
historico[hoje] = {m["name"]: m["level"] for m in membros}
with open(HISTORICO_LEVEL, "w", encoding="utf-8") as f:
    json.dump(historico, f, ensure_ascii=False, indent=2)

# XP exata vem diretamente dos highscores do Tibia.com.
# Consultamos somente as vocacoes que existem na guild e guardamos apenas os membros.
experiencias = {}
fontes = {}

vocacoes_necessarias = set()
for membro in membros:
    voc = str(membro.get("vocation", "")).casefold()
    for chave in VOCATION_IDS:
        if chave in voc:
            vocacoes_necessarias.add(chave)
            break

# Se a API da guild nao informar a vocacao, consulta todas.
if not vocacoes_necessarias:
    vocacoes_necessarias = set(VOCATION_IDS)

nomes_guild = {m["name"].casefold() for m in membros}

for vocacao in sorted(vocacoes_necessarias):
    profession = VOCATION_IDS[vocacao]
    for page in range(1, TOP_PAGES + 1):
        try:
            entries = get_tibia_highscore_page(world, profession, page)
            encontrados = 0
            for chave, item in entries.items():
                if chave in nomes_guild:
                    experiencias[chave] = item["experience"]
                    fontes[chave] = vocacao
                    encontrados += 1

            # Se ja encontramos todos os membros, nao precisamos de mais paginas.
            if len(experiencias) >= len(nomes_guild):
                break

            # Pagina sem resultados encerra a vocacao.
            if not entries:
                break
        except Exception as exc:
            print(f"Falha ao consultar Tibia.com {vocacao} pagina {page}: {exc}")
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
    f"fonte: Tibia.com | vocacoes: {', '.join(sorted(vocacoes_necessarias))}"
)
