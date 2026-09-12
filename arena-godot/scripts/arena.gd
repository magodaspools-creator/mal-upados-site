extends Node2D

const START_WAVE := 1
const MAX_WAVE := 20
const LOOT_ROOT := "res://assets-importados/16x16 Weapons RPG Icons/"

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
var _player_origin := Vector2.ZERO
var _loot_item: Node2D = null
var _loot_kind := ""
var _loot_value := 0

@onready var status: Label = $HUD/Status
@onready var stats: Label = $HUD/Stats
@onready var loot: Label = $HUD/Loot
@onready var enemy: Node2D = $Enemy
@onready var player: CharacterBody2D = $Player

func _ready() -> void:
    _player_origin = player.position
    enemy.setup("Criatura de Treino")
    _refresh_ui("Arena pronta — ESPAÇO inicia o combate")

func _process(_delta: float) -> void:
    if Input.is_action_just_pressed("attack"):
        attack()
    if _loot_item != null and is_instance_valid(_loot_item):
        if player.position.distance_to(_loot_item.position) < 58.0:
            _collect_loot()

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
    if enemy.has_method("show_spawn"):
        enemy.show_spawn()
    _refresh_ui("Onda %d/%d — %s — pressione ESPAÇO para atacar" % [wave, MAX_WAVE, enemy_name])

func attack() -> void:
    if not in_combat:
        start_wave(wave)
        return

    var damage := weapon_damage + (wave / 2) + randi_range(0, 10)
    enemy_hp = max(0, enemy_hp - damage)
    _animate_attack(damage)

    if enemy_hp == 0:
        if enemy.has_method("die"):
            enemy.die()
        _win_wave()
        return

    if enemy.has_method("hit_flash"):
        enemy.hit_flash()

    var incoming := max(1, 4 + wave + randi_range(0, 4))
    player_hp = max(0, player_hp - incoming)

    if player_hp == 0:
        in_combat = false
        _refresh_ui("Você caiu na onda %d. Pressione ESPAÇO para tentar novamente." % wave)
        return

    _refresh_ui("Você causou %d de dano — %s: %d/%d HP" % [damage, enemy_name, enemy_hp, enemy_max_hp])

func _animate_attack(damage: int) -> void:
    var origin := _player_origin
    var direction := (enemy.position - player.position).normalized()
    if direction.length() < 0.1:
        direction = Vector2.UP

    var tween := create_tween()
    tween.tween_property(player, "position", origin + direction * 26.0, 0.07).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
    tween.tween_property(player, "position", origin, 0.12).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
    _show_damage_number(damage)

func _show_damage_number(damage: int) -> void:
    var label := Label.new()
    label.text = "-%d" % damage
    label.position = enemy.position + Vector2(-22, -55)
    label.add_theme_font_size_override("font_size", 22)
    label.modulate = Color(1.0, 0.86, 0.28, 1.0)
    add_child(label)

    var tween := create_tween()
    tween.set_parallel(true)
    tween.tween_property(label, "position", label.position + Vector2(0, -38), 0.45)
    tween.tween_property(label, "modulate", Color(1, 0.86, 0.28, 0), 0.45)
    tween.set_parallel(false)
    tween.tween_callback(label.queue_free)

func _win_wave() -> void:
    var reward := 25 + (wave * 8)
    var xp_reward := 35 + (wave * 15)
    gold += reward
    arena_xp += xp_reward
    in_combat = false
    _spawn_loot()
    _refresh_ui("VITÓRIA! +%d Gold +%d XP — Loot apareceu no chão" % [reward, xp_reward])

func _spawn_loot() -> void:
    if _loot_item != null and is_instance_valid(_loot_item):
        _loot_item.queue_free()

    var item := Node2D.new()
    item.position = enemy.position + Vector2(0, 28)
    item.z_index = 5
    add_child(item)
    _loot_item = item

    var icon := Sprite2D.new()
    icon.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
    icon.texture = _load_loot_icon()
    icon.scale = Vector2(2.0, 2.0)
    item.add_child(icon)

    var label := Label.new()
    label.text = _loot_kind
    label.position = Vector2(-55, 16)
    label.add_theme_font_size_override("font_size", 14)
    item.add_child(label)

    var tween := create_tween()
    tween.set_loops()
    tween.tween_property(item, "position:y", item.position.y - 7.0, 0.45).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
    tween.tween_property(item, "position:y", item.position.y, 0.45).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)

func _load_loot_icon() -> Texture2D:
    var files := [
        LOOT_ROOT + "Sword.png",
        LOOT_ROOT + "sword.png",
        LOOT_ROOT + "weapon_sword.png"
    ]
    for path in files:
        var texture := load(path) as Texture2D
        if texture != null:
            return texture
    return null

func _collect_loot() -> void:
    if _loot_item == null or not is_instance_valid(_loot_item):
        return

    _loot_item.queue_free()
    _loot_item = null

    if _loot_kind == "Poção":
        potion_count += 1
        last_loot = "Poção (+1)"
    elif _loot_kind == "Cristal de Arena":
        arena_xp += _loot_value
        last_loot = "Cristal de Arena (+%d XP)" % _loot_value
    elif _loot_kind == "Lâmina Sombria":
        weapon_damage += _loot_value
        last_loot = "Lâmina Sombria (+%d dano)" % _loot_value
    else:
        gold += _loot_value
        last_loot = "%s (+%d Gold)" % [_loot_kind, _loot_value]

    _refresh_ui("LOOT COLETADO: %s" % last_loot)

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

func _setup_loot_reward() -> void:
    _loot_kind = _roll_loot()
    _loot_value = randi_range(15, 45)
    if _loot_kind == "Cristal de Arena":
        _loot_value = 50 + wave * 5
    elif _loot_kind == "Lâmina Sombria":
        _loot_value = 2 + int(wave / 5)

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
