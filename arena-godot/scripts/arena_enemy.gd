extends Node2D

# Inimigo visual provisório do modo de waves.
# Usamos um sprite GegX que já existe no projeto para conseguirmos testar o jogo
# imediatamente, sem depender do pack de monstros.
const DEMO_ENEMY_ROOT := "res://characters/rogue-hero-128/rogue-hero-128"

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

var monster_name := "Criatura de Treino"

func _ready() -> void:
    _load_demo_enemy()

func setup(name: String) -> void:
    monster_name = name
    # Por enquanto o visual permanece fixo. O nome/HP continuam mudando por onda.
    _load_demo_enemy()

func _load_demo_enemy() -> void:
    var frames := SpriteFrames.new()
    frames.remove_animation("default")

    for animation_name in ["idle_south", "idle_north", "idle_east", "idle_west"]:
        var path := DEMO_ENEMY_ROOT + "/" + animation_name
        if not DirAccess.dir_exists_absolute(ProjectSettings.globalize_path(path)):
            continue

        frames.add_animation(animation_name)
        frames.set_animation_speed(animation_name, 7.0)
        frames.set_animation_loop(animation_name, true)

        var files := DirAccess.get_files_at(path)
        files.sort()
        for file_name in files:
            if file_name.to_lower().ends_with(".png"):
                var texture := load(path + "/" + file_name) as Texture2D
                if texture:
                    frames.add_frame(animation_name, texture)

    sprite.sprite_frames = frames
    sprite.scale = Vector2(0.7, 0.7)
    sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
    sprite.modulate = Color(0.72, 0.28, 0.28, 1.0)
    sprite.play("idle_south")
