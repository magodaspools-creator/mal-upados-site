extends Node2D

const MONSTER_ROOTS := [
    "res://monsters/",
    "res://creatures/",
    "res://characters/"
]

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

var monster_name := "Goblin"
var _loaded := false

func setup(name: String) -> void:
    monster_name = name
    _load_monster(name)

func _load_monster(name: String) -> void:
    var clean := name.to_lower().replace(" ", "-")
    var candidates := [
        "res://monsters/%s" % clean,
        "res://monsters/%s-128" % clean,
        "res://creatures/%s" % clean,
        "res://creatures/%s-128" % clean
    ]

    for root in candidates:
        if _load_frames_from_root(root):
            _loaded = true
            return

    # Development fallback: use a real GegX hero sprite until the monster pack
    # is present in the repository. It keeps the scene pixel-art based.
    _load_frames_from_root("res://characters/rogue-hero-128/rogue-hero-128")
    sprite.modulate = Color(0.72, 0.28, 0.28, 1.0)

func _load_frames_from_root(root: String) -> bool:
    var directory := DirAccess.open(root)
    if directory == null:
        return false

    var frames := SpriteFrames.new()
    frames.remove_animation("default")
    var loaded_any := false

    for animation_name in ["idle_south", "idle_north", "idle_east", "idle_west"]:
        var path := root + "/" + animation_name
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
                    loaded_any = true

    if not loaded_any:
        return false

    sprite.sprite_frames = frames
    sprite.scale = Vector2(0.7, 0.7)
    sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
    sprite.play("idle_south")
    return true
