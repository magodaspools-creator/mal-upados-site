extends CharacterBody2D

const CHARACTER_ROOT := "res://characters/"
const CHARACTER_SCALE := Vector2(0.5, 0.5)
const WALK_SPEED := 220.0

@export_enum("knight", "mage", "archer", "rogue") var vocation := "knight"

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

var facing := "south"
var _loaded_vocation := ""

func _ready() -> void:
    sprite.scale = CHARACTER_SCALE
    sprite.centered = true
    sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
    _load_vocation(vocation)
    _play_animation("idle_south")

func _physics_process(_delta: float) -> void:
    var direction := Input.get_vector("move_left", "move_right", "move_up", "move_down")
    velocity = direction * WALK_SPEED
    move_and_slide()

    position.x = clamp(position.x, 96.0, 1184.0)
    position.y = clamp(position.y, 160.0, 500.0)

    if direction.length() > 0.01:
        _update_facing(direction)
        _play_animation("walk_" + facing)
    else:
        _play_animation("idle_" + facing)

func set_vocation(value: String) -> void:
    var clean := value.to_lower()
    if clean not in ["knight", "mage", "archer", "rogue"]:
        clean = "knight"
    vocation = clean
    _load_vocation(vocation)
    _play_animation("idle_" + facing)

func _load_vocation(name: String) -> void:
    if _loaded_vocation == name and sprite.sprite_frames != null:
        return

    var root := CHARACTER_ROOT + name + "-hero-128/" + name + "-hero-128/"
    var directory := DirAccess.open(root)
    if directory == null:
        push_warning("Personagem não encontrado: " + root)
        return

    var frames := SpriteFrames.new()
    frames.remove_animation("default")

    var animations := [
        "idle_south", "idle_north", "idle_east", "idle_west",
        "idle_southeast", "idle_southwest", "idle_northeast", "idle_northwest",
        "walk_south", "walk_north", "walk_east", "walk_west",
        "walk_southeast", "walk_southwest", "walk_northeast", "walk_northwest"
    ]

    for animation_name in animations:
        var path := root + animation_name
        if DirAccess.dir_exists_absolute(ProjectSettings.globalize_path(path)):
            frames.add_animation(animation_name)
            frames.set_animation_speed(animation_name, 10.0 if animation_name.begins_with("walk_") else 7.0)
            frames.set_animation_loop(animation_name, true)
            var files := DirAccess.get_files_at(path)
            files.sort()
            for file_name in files:
                if file_name.to_lower().ends_with(".png"):
                    var texture := load(path + "/" + file_name) as Texture2D
                    if texture:
                        frames.add_frame(animation_name, texture)

    sprite.sprite_frames = frames
    _loaded_vocation = name

func _update_facing(direction: Vector2) -> void:
    var angle := direction.angle()
    var octant := int(round(angle / (PI / 4.0)))
    match octant:
        -4, 4:
            facing = "west"
        -3:
            facing = "northwest"
        -2:
            facing = "north"
        -1:
            facing = "northeast"
        0:
            facing = "east"
        1:
            facing = "southeast"
        2:
            facing = "south"
        3:
            facing = "southwest"

func _play_animation(animation_name: String) -> void:
    if sprite.sprite_frames == null:
        return
    if not sprite.sprite_frames.has_animation(animation_name):
        return
    if sprite.animation != animation_name:
        sprite.play(animation_name)
