extends Node2D

const START_WAVE := 1
const MAX_WAVE := 20

var wave := START_WAVE
var player_hp := 100
var player_max_hp := 100
var gold := 100
var arena_xp := 0
var enemy_hp := 0
var enemy_max_hp := 0
var enemy_name := ""
var in_combat := false
var weapon_level := 1
var weapon_damage := 18
var potion_count := 2
var last_loot := "Nenhum"

@onready var status: Label = $HUD/Status
@onready var stats: Label = $HUD/Stats
@onready var loot: Label = $HUD/Loot
@onready var enemy: Node2D = $Enemy

func _ready() -> void:
    _refresh_ui("Arena pronta — ESPAÇO inicia o combate")

func _process(_delta: float) -> void:
    if Input.is_action_just_pressed("attack"):
        attack()

func start_wave(next_wave: int = wave) -> void:
    if player_hp <= 0:
        player_hp = player_max_hp

    wave = clamp(next_wave, 1, MAX_WAVE)
    enemy_max_hp = 55 + (wave * 24)
    enemy_hp = enemy_max_hp
    enemy_name = _enemy_for_wave(wave)
    in_combat = true
    enemy.position = Vector2(640, 245)
    enemy.setup(enemy_name)
    _refresh_ui("Onda %d/%d — %s — pressione ESPAÇO para atacar" % [wave, MAX_WAVE, enemy_name])

func attack() -> void:
    if not in_combat:
        start_wave(wave)
        return

    var damage := weapon_damage + (wave / 2) + randi_range(0, 10)
    enemy_hp = max(0, enemy_hp - damage)

    if enemy_hp == 0:
        _win_wave()
        return

    var incoming := max(1, 4 + wave + randi_range(0, 4))
    player_hp = max(0, player_hp - incoming)

    if player_hp == 0:
        in_combat = false
        _refresh_ui("Você caiu na onda %d. Pressione ESPAÇO para tentar novamente." % wave)
        return

    _refresh_ui("Você causou %d de dano — %s: %d/%d HP" % [damage, enemy_name, enemy_hp, enemy_max_hp])

func _win_wave() -> void:
    var reward := 25 + (wave * 8)
    var xp_reward := 35 + (wave * 15)
    gold += reward
    arena_xp += xp_reward
    in_combat = false
    last_loot = _roll_loot()

    if wave >= MAX_WAVE:
        _refresh_ui("ARENA CONCLUÍDA! +%d Gold +%d XP — Loot: %s" % [reward, xp_reward, last_loot])
        return

    wave += 1
    _refresh_ui("VITÓRIA! +%d Gold +%d XP — Loot: %s — Espaço: próxima onda" % [reward, xp_reward, last_loot])

func _use_potion() -> void:
    if potion_count <= 0 or player_hp >= player_max_hp:
        return
    potion_count -= 1
    player_hp = min(player_max_hp, player_hp + 35)
    _refresh_ui("Poção usada: +35 HP")

func _upgrade_weapon() -> void:
    var cost := weapon_level * 75
    if gold < cost:
        _refresh_ui("Gold insuficiente para melhorar a arma. Custo: %d" % cost)
        return
    gold -= cost
    weapon_level += 1
    weapon_damage += 7
    _refresh_ui("Arma melhorada para +%d — dano base %d" % [weapon_level, weapon_damage])

func _roll_loot() -> String:
    var drops := ["Poção", "Cristal de Arena", "Lâmina Sombria", "Moeda Antiga", "Amuleto do Caçador"]
    return drops[randi_range(0, drops.size() - 1)]

func _unhandled_input(event: InputEvent) -> void:
    if event is InputEventKey and event.pressed and not event.echo:
        if event.keycode == KEY_SPACE and not in_combat:
            start_wave(wave)
        elif event.keycode == KEY_Q:
            _use_potion()
        elif event.keycode == KEY_U:
            _upgrade_weapon()

func _enemy_for_wave(current_wave: int) -> String:
    if current_wave == 20:
        return "Demon Lord"
    if current_wave % 5 == 0:
        return "Arena Boss"
    var pool := ["Rat", "Goblin", "Orc", "Scorpion", "Dragon", "Hellhound", "Demon"]
    return pool[(current_wave - 1) % pool.size()]

func _refresh_ui(message: String) -> void:
    status.text = message
    stats.text = "HP %d/%d   |   Gold %d   |   Arena XP %d\nArma +%d (dano %d)   |   Poções %d" % [player_hp, player_max_hp, gold, arena_xp, weapon_level, weapon_damage, potion_count]
    loot.text = "Último loot: %s\nU = melhorar arma   Q = poção" % last_loot
