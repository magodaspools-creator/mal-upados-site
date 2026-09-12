extends Node2D

# O pack de monstros GegX ainda não está presente no repositório remoto.
# Enquanto isso, usamos sprites pixel-art que já foram enviados no projeto:
# inimigos normais usam critters do Emberglen e bosses usam o sprite de boss.
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

func _ready() -> void:
    _load_enemy(monster_name)

func setup(name: String) -> void:
    monster_name = name
    _load_enemy(monster_name)

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
    sprite.scale = Vector2(1.0, 1.0) if name in ["Arena Boss", "Demon Lord"] else Vector2(2.0, 2.0)
    sprite.play("idle")
