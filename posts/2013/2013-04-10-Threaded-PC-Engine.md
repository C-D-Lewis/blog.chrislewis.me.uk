Threaded PC Engine
2013-04-10 13:40:44
Java
---

After a misadventure into making my Android game engine threaded for higher performance, (A two threaded app on a single core phone was destined to fail!), I decided to do the same on PC, where multi-core processors are the norm nowadays.

There are two threads: a renderer and a worker. The worker does all the calculations for the next frame, and the renderer draws all the game objects to the window. The worker starts the renderer at the same time as it starts itself, then waits for the renderer to complete before starting the cycle again.

On Android with a single core, the switching between threads contained so much overhead that the performance suffered greatly. However, on PC, it still seems to be good, at least for a simple scene. I'll see how things pan out as the scene gets more complicated.

Here is a screenshot, with the worker thread limited to 65 FPS, for good measure.

![](/assets/import/media/2013/04/threadedpcenginetest1.png?w=545)
