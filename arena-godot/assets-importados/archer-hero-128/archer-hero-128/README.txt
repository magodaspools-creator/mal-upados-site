ARCHER — Animated Hero Sprite

A classic hooded archer with bow and quiver.
128x128 pixel art, transparent PNG, 8 directions, ready to drop into any engine.


WHAT IS IN THIS PACK
--------------------
  static/<direction>.png        one still image per direction (8 files)
  idle_<direction>/00.png ...   idle loop, 12 frames, per direction
  walk_<direction>/00.png ...   walk loop, 11-14 frames, per direction

  <direction> is one of:
    south  south-east  east  north-east  north  north-west  west  south-west

  "south" means the character faces the camera (walking toward the viewer).
  Directions go clockwise from south.


HOW TO USE IT
-------------
1. Every animation is a LOOP. Play the frames in order (00, 01, 02 ...) and
   jump straight back to 00. There is no separate start or end frame.

2. Recommended playback speed: 10-14 frames per second. At 12 fps a walk
   cycle takes about one second, which matches a normal walking pace.

3. Every frame in a direction has the same canvas size and the same ground
   line, so you can draw them at a fixed position without the sprite jumping.
   Anchor the sprite at the BOTTOM CENTER of the image.

4. Pick the direction from your movement vector: if the character moves right,
   use "east"; up-right, use "north-east"; and so on.

5. The walk cycle contains exactly two steps (left foot, then right foot), so
   it stays in sync if you loop it continuously.


FOR AI ASSISTANTS AND SCRIPTS
-----------------------------
The same facts are in asset_info.json next to this file, machine readable.
Short version:

  frame files are zero padded, two digits, in play order
  no sprite sheets — one PNG per frame, so you can pack them your own way
  no baked-in shadows, no background, straight alpha
  no effects baked into the frames (no glow, no motion trails)
  palette: fewer than 256 colours per frame, indexed PNG

If you generate an atlas, keep frames of one direction in one row and do not
reorder them.


MORE FOR THIS HERO (same character, same 128 px, same 8 directions)
----------------------------------------------------------------------
  Part 2 - ATTACK PACK   8-frame attack, 8 directions, hit frame marked
                         https://gegx.itch.io/archer-attack-128
  Part 3 - COMBAT PACK   hurt, guard and death, 8 directions each
                         https://gegx.itch.io/archer-combat-128

  The other heroes of the party, built to the same recipe:
  https://gegx.itch.io/knight-hero-128
  https://gegx.itch.io/mage-hero-128

  This free pack is Part 1. If it is useful to you, the two paid parts
  are how it keeps getting made.


LICENCE
-------
Use in any project, commercial or free, no credit required.
Do not resell the assets themselves as an asset pack.
