---
id: 663
title: Android Engine Update
postDate: 2013-07-08 11:50:28
original: https://ninedof.wordpress.com/2013/07/08/android-engine-update/
---

So,  [a while ago now](http://ninedof.wordpress.com/2013/03/28/android-engine-on-the-way/) I created an iterative Android game engine, and used it to  [port Raiders](http://ninedof.wordpress.com/2013/03/31/raiders-for-android/). It went pretty well, and I got good performance out of it. But an almost inevitable truth I have come to accept in starting a new project based off an old (This time being porting Railways to Android) is that by the time I revisit the old code, I've learned so much more that it makes me wince to even read it.

There have been occasions where I've reduced the size of a source file by three times or more, simply by applying much more precise implementation conventions. It ends up faster, more memory efficient and easier to read and tweak. This is all good!

While I was contemplating this new port, it occurred to me I could make things a lot simpler for myself by creating a general <code>Engine</code> class, and simply extending it whenever I wanted a specific game implemented.

The general philosophy I've adopted for making games on Java and Android has been an iterative game loop and render loop. This means that for each frame, every in-game object gets one <code>update()</code> call (so move once etc), then one <code>render()</code> call to draw it. When the Java engine was made threaded, performance increased even more, but the same could not be applied to my Android phone, which is only single core. After an attempted implementation, performance was pretty inconsistent, which I chalked up to perhaps the constant changing of Thread context. We may never know.

Getting back to the new ideas, I've cleaned up my Android engine to the point where the state machine is internalised along with all the touch IO. To implement a new 'menu &lt;-&gt; in-game' style game all I have to do now is extend the engine and override six functions:


	- <code>loadMenuMembers()</code> - Allocate all objects that appear in the menu
	- <code>loadGameMembers()</code> - Allocate all objects that appear in-game
	- <code>menuUpdateLoop()</code> - Update all interactive objects in the menu
	- <code>gameUpdateLoop()</code> - Update all the interactive objects in-game
	- <code>menuRenderLoop()</code> - Render all the menu objects
	- <code>gameRenderLoop()</code> - Render all the in-game objects


These functions are called at the appropriate times by the superclass engine, and so the rest can be ignored by the coder, leaving them to focus on only the elements of their game.

Much simpler!
