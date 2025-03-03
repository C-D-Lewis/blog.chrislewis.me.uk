Update on posts
2013-08-20 21:51:37
Java
---

The last couple of weeks I haven't been posting anything interesting, mainly due to a new project I'm spending a lot of time on, which is very exciting. I'm working with a friend to create an open-world RPG basically from scratch, and working on it has given me lots of opportunity to problem-solve, develop my coding practices and go to new places I wouldn't have gone otherwise.

A summary of highlights so far, which I may cover in separate detail posts are:

• Triple threaded engine (Logic, Renderer, Occlusion) using Java2D

• Tile based maps with three layers loaded by a tile sheet parser that splits up a single image of tiles into single sprites for use by each map tile.

• Any-size maps with aggressive occlusion (drawing only those tiles that need to be), enabling smooth 60 FPS motion even at 1920 x 1080.

• Animated Player and NPCs that similarly have their animation frames dynamically loaded from external sprite sheets composed of individual frames.

• Thread driven scripts and events using a bespoke language that are interpreted and acted upon at run-time.

• Map files are read into a bundle that then exposes it's data to the game, ensuring only the correct data is available, and the game cannot accidentally corrupt a map file.

• A dedicated map maker package that enables creation of these maps, adding events, NPCs and map-to-map jumps.

Stay tuned for more information!
