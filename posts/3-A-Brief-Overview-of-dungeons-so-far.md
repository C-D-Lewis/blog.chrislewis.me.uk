---
id: 75
title: A Brief Overview of 'dungeons' so far
postDate: 2013-03-27 01:11:21
original: https://ninedof.wordpress.com/2013/03/27/a-brief-overview-of-dungeons-so-far/
---

'dungeons' is the 2D dungeon crawler I [mentioned earlier](http://ninedof.wordpress.com/2013/03/24/current-projects/). The main focus is on procedural generation of 'levels' with a number of randomly scattered features; rooms, keys, gold and enemies, for the moment.

At the moment, when a level is generated, the following events occur:
<ol>
	- <span style="line-height:12px;">Rooms are generated with a random size in random locations. Each room has a random number of doors cut into the walls. ![](http://ninedof.files.wordpress.com/2013/03/doors1.png)</span>
	- The each door is randomly connected to another randomly chosen door using a simple implementation of A* Pathfinding ( [inspired from this helpful article](http://www.policyalmanac.org/games/aStarTutorial.htm)). After being connected, the door is marked as such, so that it cannot be chosen again. This has two downsides: 1 - There will always be a door that is the last one standing and permanently unconnected. This could be a room with one door. 2 - Paths cannot currently overlap, so it is somewhat messy.![](http://ninedof.files.wordpress.com/2013/03/connected-doors1.png)
	- The middle start area of each level is created at the center. This contains the up and downstairs to the previous or next level. The top most level never has an upstairs, for obvious reasons.![](http://ninedof.files.wordpress.com/2013/03/stairs.png?w=300)
	- Gold is scattered around for points, keys are scattered around to unlock the trapdoor leading down to the next level. Both are spawned only within rooms, and having more than one key (currently up to five) combats the first disadvantage mentioned in point 2 above.![](http://ninedof.files.wordpress.com/2013/03/keysandgold.png?w=300)
	- The corridors and room walls are decorated, sort of  [Dungeon Keeper style](http://image.com.com/gamespot/images/screenshots/8/176198/dkeeper2_screen006.jpg). This is done by recognizing the 'passability' of tiles surrounding each tile and deciding on which type of layout it is. An example is a right hand corner.![](http://ninedof.files.wordpress.com/2013/03/decor.png?w=300)
	- Finally, monsters are spawned. These are passed the current level tile data to decide where they can move, and move with a bias towards their current directions rather than turning, so are decorated like zombies for now.![](http://ninedof.files.wordpress.com/2013/03/zombs.png?w=300)
</ol>
When the player plays the level, all tiles are hidden except those they have just passed. These are revealed with a cardinal line of sight of 5, then forgotten on a tile by tile basis after five seconds, unless a torch item is placed down. ![](http://ninedof.files.wordpress.com/2013/03/visibility.png?w=300)

That's all for now. I'll release a playable version as soon as its a bit less buggy and a bit more interesting to play. If you want to play it now anyway, send me a tweet and I'll get back to you soon.
