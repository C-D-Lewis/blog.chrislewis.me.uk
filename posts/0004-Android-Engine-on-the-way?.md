Android Engine on the way?
2013-03-28 17:56:48
Android
---

For a while I've wanted to make a simple game in Android. I've done simple apps before, such as a scalable test app for A* Pathfinding (which I will write about later) and silly soundboards, but nothing that can actually be played like a game.

The main element any game needs is a 2D canvas on which all the graphics are drawn. It is understanding how to make one, update the contents and render it that kept me back. I've also created a few simple Live Wallpapers, but with these all the hard work is done for you by extending an existing class, <code>android.service.wallpaper.WallpaperService</code> (and in-turn extending <code>WallpaperService.Engine</code>).

In order to create an interactive graphical experience outside a pre-built Live Wallpaper Engine, I had to understand how Android handles Canvases, drawing calls and how these are displayed. I had tried doing a similar <code>update() -> render() -> fpsDelay()</code> approach as in my Java games, but an endless loop such as this created in the Constructor of an Android app halts everything.

And I mean everything.

You can't do any other work in an Android app until the Constructor is done, unlike Java. This is because all the drawing activity is done asynchronously AFTER the application has been created (that is, <code>onCreate()</code> has completed).

To get round this, I found out I could extend <code>SurfaceView</code> and call my <code>update()</code> function in the <code>onDraw()</code> call to keep a cycle going. After some attempts at this, I am pleased to discover it works! Maybe I could make a port of 'dungeons' or something similar...

Here is a screenshot from my AVD (Android 2.3.3 Gingerbread), next to a screenshot from my Galaxy S (Android 4.1.2 Jelly Bean, thanks to <a title="Cyanogenmod" href="http://www.cyanogenmod.org/">Cyanogenmod</a>) running the engine:

<a href="http://ninedof.files.wordpress.com/2013/03/enginetestfpsemu.png">![](http://ninedof.files.wordpress.com/2013/03/enginetestfpsemu.png?w=545)</a>

You can see that performance is much greater on actual hardware!

In the end, the line that gave me most trouble was <em>not</em> including this:

<code>setWillNotDraw(false);</code>

Huh.

I also found that after I'd 'closed' the app, my phone was extremely unresponsive until I re-opened it and killed it manually. Hence, this is needed for now:

<code>
@Override
public void onPause() {
    finish();
}
</code>

Which causes a Force Close but I can live with that for now. 
