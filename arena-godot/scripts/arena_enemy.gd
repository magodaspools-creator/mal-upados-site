extends Node2D

# Inimigos temporários usando pixel art que já está no projeto.
const EMBERGLEN_ROOT := "res://assets-importados/emberglen-starter-v2.0/"
const BOSS_PATH := EMBERGLEN_ROOT + "sampler/bosses/still.png"

const NORMAL_ENEMIES := {
    "Rat": "props/critters/mouse.png",
    "Goblin": "props/critters/raccoon.png",
    "Orc": "props/critters/fox_sleeping.png",
    "Scorpion": "props/critters/ladybug.png",
    "Dragon": "props/critters/owl_branch.png",
    "Hellhound": "props/critters/crow.png",
    "Demon": "props/critters/raccoon.png"
}

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

var monster_name := "Criatura de Treino"
var _base_scale := Vector2.ONE

func _ready() -> void:
    _load_enemy(monster_name)

func setup(name: String) -> void:
    monster_name = name
    _load_enemy(monster_name)
    sprite.modulate = Color.WHITE
    sprite.scale = _base_scale
    sprite.visible = true

func _load_enemy(name: String) -> void:
    var path := BOSS_PATH if name in ["Arena Boss", "Demon Lord"] else EMBERGLEN_ROOT + NORMAL_ENEMIES.get(name, "props/critters/mouse.png")
    var texture := load(path) as Texture2D

    if texture == null:
        push_warning("Sprite de inimigo não encontrado: " + path)
        return

    var frames := SpriteFrames.new()
    frames.remove_animation("default")
    frames.add_animation("idle")
    frames.set_animation_speed("idle", 1.0)
    frames.set_animation_loop("idle", true)
    frames.add_frame("idle", texture)

    sprite.sprite_frames = frames
    sprite.animation = "idle"
    sprite.centered = true
    sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
    sprite.modulate = Color.WHITE
    _base_scale = Vector2(1.0, 1.0) if name in ["Arena Boss", "Demon Lord"] else Vector2(2.0, 2.0)
    sprite.scale = _base_scale
    sprite.play("idle")

func hit_flash() -> void:
    if not is_instance_valid(sprite):
        return
    var original := position
    var tween := create_tween()
    tween.tween_property(sprite, "modulate", Color(1.0, 0.72, 0.72, 1.0), 0.05)
    tween.tween_property(sprite, "modulate", Color.WHITE, 0.09)
    tween.parallel().tween_property(self, "position", original + Vector2(7, 0), 0.04)
    tween.tween_property(self, "position", original, 0.08)

func die() -> void:
    if not is_instance_valid(sprite):
        return
    var tween := create_tween()
    tween.set_parallel(true)
    tween.tween_property(sprite, "modulate", Color(1, 1, 1, 0), 0.22)
    tween.tween_property(sprite, "scale", _base_scale * 1.18, 0.22)
    tween.set_parallel(false)
    tween.tween_callback(func(): sprite.visible = false)

func show_spawn() -> void:
    sprite.visible = true
    sprite.modulate = Color(1, 1, 1, 0)
    sprite.scale = _base_scale * 0.78
    var tween := create_tween()
    tween.set_parallel(true)
    tween.tween_property(sprite, "modulate", Color.WHITE, 0.18)
    tween.tween_property(sprite, "scale", _base_scale, 0.18).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
