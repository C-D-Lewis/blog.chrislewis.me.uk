---
id: 2161
title: New Pebble Library: PGE (formerly PGame)
postDate: 2014-10-25 19:48:24
original: https://ninedof.wordpress.com/2014/10/25/new-pebble-library-pgame/
---

For a couple of my existing  [watchapps](https://apps.getpebble.com/applications/529e8742d7894b189c000012) and  [watchfaces](https://apps.getpebble.com/applications/52cd48ecc296577c6c00002f) I have implemented a smooth animation using an <code>AppTimer</code>. This involves something like the snippet below:

[code language="c"]
static void some_layer_update_proc(Layer *layer, GContext *ctx) {
  // Graphics calls

}

static void timer_handler(void *context) {
  // Update frame
  layer_mark_dirty(some_layer);

  // Finally schedule next frame
  app_timer_register(34, timer_handler, NULL);
}

...

static void start_animation() {
  // Schedule first frame to start loop
  layer_set_update_proc(some_layer, some_layer_update_proc);
  app_timer_register(34, timer_handler, NULL);
}
[/code]

As you can see, after the first frame is scheduled with an <code>AppTimer</code>, the timer's handler schedules the next, and so an infinite loop is born. After implementing this multiple times, it occurred to me that I could make this process easier to set up, even if it was just for myself. 

The result of this is a new library called  [pge](https://github.com/C-D-Lewis/pge), which creates an object that handles this looping of game logic and rendering per-frame for you, similar to STL. It also handles button clicks with an easier abstraction for the developer. Here's a quick example of usage, from the GitHub README file:

[code language="c"]
#include &quot;pge.h&quot;

static PGE *s_game;

void loop() {

}

void draw(GContext *ctx) {

}

void click(int button_id) {

}

...

s_game = pge_begin(s_window, loop, draw, click);
[/code]

This will start a 30 FPS loop that calls the developer's implementation of <code>draw()</code> and <code>loop()</code> every frame, and <code>click()</code> when a button is clicked. The developer can then check the button ID as usual using the Pebble SDK constants, such as <code>BUTTON_ID_UP</code>. The loop will end and the <code>PGE</code> can be destroyed as part of a normal <code>Window</code>'s lifecycle:

[code language="c"]
static void main_window_unload(Window *window) {
  // Destroy all game resources
  pge_finish(s_game);
}
[/code]

The GitHub repo also includes a sample app where I implemented a simple 'game' of controlling a 'robot', using select to start/stop the robot and the up and down buttons to rotate its direction of travel. 

<img src="https://raw.githubusercontent.com/C-D-Lewis/pge/master/screenshots/screenshot1.png" alt="Robot game" />

I'm currently working on implementing an <code>Entity</code> object that can be added to a list for automatic looping and rendering by the <code>PGE</code>. This will eventually also allow collision, as well as couple of other useful features.

If you are thinking of creating such a game, this library can hopefully help get you started. Let me know when you end up creating! The repo can be  [found here](https://github.com/C-D-Lewis/pge).
