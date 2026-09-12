extends Node2D

const START_WAVE := 1
const MAX_WAVE := 20

var wave := START_WAVE
var player_hp := 100
var player_max_hp := 100
var gold := 0
var arena_xp := 0
var enemy_hp := 0
var enemy_max_hp := 0
var enemy_name := ""
var in_combat := false

@onready var player: CharacterBody2D = $Player
@onready var status: Label = $HUD/Status

func _ready() -> void:
    _refresh_status("Arena pronta")

func _physics_process(_delta: float) -> void:
    var direction := Input.get_vector("move_left", "move_right", "move_up", "move_down")
    player.velocity = direction * 220.0
    player.move_and_slide()
    player.position.x = clamp(player.position.x, 64.0, 1216.0)
    player.position.y = clamp(player.position.y, 128.0, 520.0)
    if Input.is_action_just_pressed("attack"):
        attack()

func start_wave(next_wave: int = wave) -> void:
    wave = clamp(next_wave, 1, MAX_WAVE)
    enemy_max_hp = 55 + (wave * 24)
    enemy_hp = enemy_max_hp
    enemy_name = _enemy_for_wave(wave)
    in_combat = true
    _refresh_status("Onda %d/%d — %s — HP %d/%d" % [wave, MAX_WAVE, enemy_name, enemy_hp, enemy_max_hp])

func attack() -> void:
    if not in_combat:
        start_wave(wave)
    var damage := 18 + (wave * 2) + randi_range(0, 10)
    enemy_hp = max(0, enemy_hp - damage)
    if enemy_hp == 0:
        var reward := 25 + (wave * 8)
        gold += reward
        arena_xp += 35 + (wave * 15)
        in_combat = false
        if wave >= MAX_WAVE:
            _refresh_status("ARENA CONCLUÍDA — Gold %d — Arena XP %d" % [gold, arena_xp])
        else:
            wave += 1
            _refresh_status("Vitória! +%d gold — pressione ESPAÇO para a próxima onda" % reward)
        return
    var incoming := max(1, 4 + wave + randi_range(0, 4))
    player_hp = max(0, player_hp - incoming)
    if player_hp == 0:
        in_combat = false
        _refresh_status("Você caiu na onda %d. O personagem não perde a progressão." % wave)
        return
    _refresh_status("Onda %d/%d — %s — inimigo %d/%d — seu HP %d/%d" % [wave, MAX_WAVE, enemy_name, enemy_hp, enemy_max_hp, player_hp, player_max_hp])

func _unhandled_input(event: InputEvent) -> void:
    if event is InputEventKey and event.pressed and event.keycode == KEY_SPACE and not in_combat and player_hp > 0:
        start_wave(wave)

func _enemy_for_wave(current_wave: int) -> String:
    if current_wave == 20:
        return "Demon Lord"
    if current_wave % 5 == 0:
        return "Arena Boss"
    var pool := ["Rat", "Goblin", "Orc", "Scorpion", "Dragon", "Hellhound", "Demon"]
    return pool[(current_wave - 1) % pool.size()]

func _refresh_status(message: String) -> void:
    status.text = message
