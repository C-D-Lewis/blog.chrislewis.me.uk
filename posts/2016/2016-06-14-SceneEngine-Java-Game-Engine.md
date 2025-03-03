SceneEngine (Java Game Engine)
2016-06-14 16:55:39
Java,Releases
---

Contrary to popular belief, I do other programming stuff outside of Pebble apps (as well as my other hobby - ignoring app feature requests!). One of these things is a arcade game side project that's been on-for-a-few-weekends, off-for-a-few-months. Inspired by the sort of rapid-fire indie games my brother and his friends play (Duck Game, Samurai Gunn, Monaco, and recently Ultimate Chicken Horse), I embarked on a project to make a game similar to these that could be played by several friends around a single TV, much like local multiplayer games from my Youth (particularly Worms).

This effort saw me create a basic looping game prototype with Java2D, which began life as a top-down space-themed ship simulator, but didn't make it very far before switching to the arcade-multiplayer genre I wanted it to become. Soon enough, drawing lots of tiles hit its max potential and so I had to spend a lot of time tearing it apart and replacing Java2D with LWJGL OpenGL for speed. The results were worth the effort, but I'm still left with an incomplete game.

Like many of my programming projects, I work on it less constantly, and more in inspired fits and bursts. So far I have intro sequences, a menu system, a tiled world system with lighting based on a novel pathfinding algorithm, up to four XBox controller support, player sprite animation and collision, and other things. But it's still incomplete. Until I add weapons, NPCs, effects, and room generation, it'll stay that way.

But in the meantime, I created lots of very useful sub-components that I really don't want to have been for nothing, and will probably end up reusing in my own projects. So I decided to pull out the engine, and release it on GitHub as a standalone project that can be run independently of all the other fluff that makes up the game in progress. Importing the code into Eclipse and adding LWJGL.jar (with local libraries and binaries) will let you play around with it and build a game on top of it if you want.

Check out the <a href="https://github.com/C-D-Lewis/GLSceneEngine">GitHub repository README.md</a> for a full list of features and how to implement it. Once I have a working prototype of the game, I'll probably post about that as well. It's all about the journey, right?

![](/assets/import/media/2016/06/screenshot.png)
