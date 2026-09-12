extends Node2D

const MOCKUP_PATH := "res://tilesets/Foozle_2DT0003_Lucifer_Dungeon_Tileset_Pixel_Art/Foozle_2DT0003_Lucifer_Dungeon_Tileset_Pixel_Art/DungeonTileset Mockup.png"

@onready var background: Sprite2D = $ArenaBackground

func _ready() -> void:
    var texture := load(MOCKUP_PATH) as Texture2D
    if texture == null:
        # The Godot project root is arena-godot, so the asset path above is correct
        # when the project is opened from that folder.
        push_warning("Mockup do tileset não encontrado: " + MOCKUP_PATH)
        return

    background.texture = texture
    background.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
    background.centered = true
    background.position = Vector2(640, 360)
    background.z_index = -20

    var viewport_size := Vector2(1280, 720)
    var source_size := texture.get_size()
    if source_size.x > 0.0 and source_size.y > 0.0:
        var scale_factor := max(viewport_size.x / source_size.x, viewport_size.y / source_size.y)
        background.scale = Vector2(scale_factor, scale_factor)
