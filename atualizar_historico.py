import json, urllib.request, urllib.parse, datetime, os

GUILD = "Mal Upados"
URL = f"https://api.tibiadata.com/v4/guild/{urllib.parse.quote(GUILD)}"
ARQUIVO = "historico.json"

with urllib.request.urlopen(URL) as r:
    data = json.load(r)

membros = data["guild"]["members"]
hoje = datetime.date.today().isoformat()

historico = {}
if os.path.exists(ARQUIVO):
    with open(ARQUIVO, "r", encoding="utf-8") as f:
        historico = json.load(f)

historico[hoje] = {m["name"]: m["level"] for m in membros}

with open(ARQUIVO, "w", encoding="utf-8") as f:
    json.dump(historico, f, ensure_ascii=False, indent=2)

print("Historico atualizado:", hoje)
