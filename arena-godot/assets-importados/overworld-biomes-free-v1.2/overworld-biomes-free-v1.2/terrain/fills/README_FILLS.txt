MATCHING FILL TILES
===================

Read this before you fill a large area.

THE PROBLEM
-----------

Two things can bite you when you fill a large area:

1. The VARIANT tiles (_v1, _v2, _v3) are not all in the same tone as their own
   _v0 - scatter them randomly and you get visible patches.
2. Grass exists in TWO tones across the pack, and seven blend sets use one that
   no base tile matches.

The _v0 tile of every biome is fine. We measured all of it rather than guessing;
the numbers are at the end of this file.

THE FIX
-------

Every blend set already contains its own matching fill: cell 00 is its pure
first side, cell 15 its pure second side. They are colour-identical to that
set's transitions by construction.

This folder collects them under readable names. Use the fill that belongs to the
blend set you are using, not the tile from terrain/base/.

WHICH FILL GOES WITH WHICH BLEND SET
------------------------------------


  blend_tiles/biome_desert_water           -> desert.png + water.png
  blend_tiles/biome_forest_water           -> forest.png + water.png
  blend_tiles/biome_grass_desert           -> desert.png + grass_a.png
  blend_tiles/biome_grass_desert_b         -> desert.png + grass_a.png
  blend_tiles/biome_grass_desert_b_warm    -> desert.png + grass_b.png
  blend_tiles/biome_grass_desert_warm      -> desert.png + grass_b.png
  blend_tiles/biome_grass_forest           -> forest.png + grass_a.png
  blend_tiles/biome_grass_forest_b         -> forest.png + grass_a.png
  blend_tiles/biome_grass_forest_b_warm    -> forest.png + grass_b.png
  blend_tiles/biome_grass_forest_warm      -> forest.png + grass_b.png
  blend_tiles/biome_grass_water            -> grass_b.png + water.png
  blend_tiles/biome_grass_water_b          -> grass_b.png + water.png
  blend_tiles/biome_grass_water_b_cool     -> grass_a.png + water.png
  blend_tiles/biome_grass_water_cool       -> grass_a.png + water.png


THE FILL TILES IN THIS FOLDER
-----------------------------

  desert.png     (239, 190, 99)     used by 5 blend set(s)
  forest.png     (62, 58, 29)       used by 5 blend set(s)
  grass_a.png    (66, 134, 99)      used by 6 blend set(s)   <- NO base tile matches this one
  grass_b.png    (103, 138, 86)     used by 6 blend set(s)
  water.png      (73, 131, 179)     used by 6 blend set(s)


WHAT WE MEASURED
----------------

For every biome we took its pure side (cell 00 or 15) out of every blend set it
appears in, plus the base tile, and looked for outliers. Sum of channel
distance, threshold 25:

THE GOOD NEWS: EVERY _v0 BASE TILE IS FINE. Measured against its fill:

  desert_v0  3     forest_v0  0     grass_v0  2     ice_v0    1
  rocky_v0   1     snow_v0    0     swamp_v0  0     water_v0  3

If you fill with the _v0 tile of a biome, it matches the transitions. Nothing
to do.

THE VARIANTS ARE WHERE IT DRIFTS. v1 to v3 exist for visual variety, but several
were baked in a different tone:

  rocky_v1   162 away      swamp_v1   115 away
  desert_v2  125 away      snow_v2     85 away
  swamp_v2    67 away      snow_v3     34 away
  forest_v1   28 away

Scatter those into a field and you get visible patches. Use them deliberately
(a darker rocky area, a dried-out patch of swamp) rather than as random variety.
grass_v0 to grass_v3 are all consistent - scatter those freely.

THE TWO GRASS TONES - SOLVED IN v1.2
------------------------------------

Grass exists here in two tones: a COOL blue-green (grass_a, 66/134/99) and a
WARM yellow-green (grass_b, 103/138/86). Different blend sets were drawn with
different ones, so in v1.1 a meadow that bordered BOTH a forest and a path
could not be made seamless - the forest set expected the cool grass, the path
set the warm one.

Every grass transition now ships in BOTH tones. Look for the same set name with
a _warm or _cool suffix:

    biome_grass_forest        the original (cool)
    biome_grass_forest_warm   the same set with the warm grass

Pick one tone, use it across the whole map, and every grass border matches.
Only the grass pixels differ between the two - forest, path, water, ice, rock,
sand and snow are pixel for pixel identical.

The same was done for the few sets that sat on a side tone of forest, path or
rocky; those are suffixed _matched. Nothing was removed or redrawn: if you are
already using the originals, they are exactly where they were.

Two tones are still on purpose. Cool grass suits northern and forest maps, warm
grass suits meadows and farmland. The point is that you now choose, instead of
the pack choosing for you set by set.
