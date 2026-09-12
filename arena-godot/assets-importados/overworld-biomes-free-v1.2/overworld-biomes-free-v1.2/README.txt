OVERWORLD BIOMES - FREE STARTER v1.2
Four complete biomes with every blend between them. 266 files.

This is a real sample, not a teaser: everything here is the same quality
and the same system as the full pack. You can build a finished map with it.

--------------------------------------------------------------------------
WHAT'S INSIDE
--------------------------------------------------------------------------

    12  base tiles        terrain/base/
        grass, forest, desert and water, with their variants.

    14  blend sheets      terrain/blend_sheets/
        grass-water, grass-forest, grass-desert, desert-water and
        forest-water. Each is a complete 16-shape corner-Wang set.

   224  individual tiles  terrain/blend_tiles/
        The same sheets pre-cut and named by the corners they cover.
        Sets ending in _warm or _cool are the same transition with the
        other grass tone - see BOTH GRASS TONES below.

     5  matching fills    terrain/fills/
        The tile to fill a large area with, taken from the blend set's
        own pure cell, so the fill and its edges are the same colour by
        construction. Read README_FILLS.txt before you fill a big area.

    10  nature props      props/nature/
        Trees, bushes, flowers, a cactus and small scatter.

--------------------------------------------------------------------------
BOTH GRASS TONES
--------------------------------------------------------------------------

Grass comes in two tones here - a cool blue-green and a warm yellow-green -
and the blend sets were originally drawn with different ones. A meadow that
bordered both a forest and a water edge could end up with a visible seam
through the middle.

Every grass transition now exists in both tones. Pick one, use it across the
whole map, and every grass border matches:

    biome_grass_forest        the original
    biome_grass_forest_warm   the same set, warm grass

Only the grass pixels differ; forest, water and sand are identical.

--------------------------------------------------------------------------
HOW THE BLEND SHEETS WORK
--------------------------------------------------------------------------

Open WANG_REFERENCE.png - it shows all sixteen shapes with their masks.

Give every corner point of your map a biome. For each cell, read its four
corners into a 4-bit mask:

    bit 0 (1) = NW    bit 1 (2) = NE    bit 2 (4) = SE    bit 3 (8) = SW

A set bit means that corner belongs to the SECOND biome in the filename.
Then take the tile at column = mask % 4, row = mask // 4, and draw it over
the first biome's base tile. All sixteen cases exist, so there is no
fallback to write.

Note: three biomes cannot meet at one corner - that is how corner-Wang
works, not a gap in this pack. Design so that at most two biomes touch any
corner.

--------------------------------------------------------------------------
WHAT THE FULL PACK ADDS
--------------------------------------------------------------------------

Overworld Biomes has twelve biomes instead of four. Snow, ice, swamp,
rocky and path join the four here, and v1.2 adds three that were made for
the pack rather than lifted from the game:

    cobblestone   town squares and streets, with a mossy second variant
    farmland      ploughed fields for the land around a village
    lava          for the endgame zone

That turns 5 blend sheets into 41 pairs, plus 21 variant chains for
blending within a biome, the tone variants for every grass border, four
dungeon tilesets (keep, cave, ice, lava) and 30 nature props.

  1,600 files in total.  Link on the store page.

There is also Overworld Village & Landmarks: 15 buildings, 13 landmarks,
city walls and village props, in the same style and scale, to put on top
of this terrain.

--------------------------------------------------------------------------
LICENSE
--------------------------------------------------------------------------

Free, including for commercial projects. Modify freely. Credit welcome,
not required. Do not resell or redistribute the assets themselves.

Full text in LICENSE.txt.

--------------------------------------------------------------------------
AI DISCLOSURE
--------------------------------------------------------------------------

Generated with PixelLab (an AI pixel art tool), then curated and corrected
by hand. See AI_DISCLOSURE.txt.
