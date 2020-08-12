Pebble SDK 2.0 Tutorial #5: Buttons and Vibrations
2014-01-11 00:14:47
Pebble
---

<strong>Required Reading

<a title="Pebble SDK 2.0 Tutorial #1: Your First Watchapp" href="http://ninedof.wordpress.com/2013/12/02/pebble-sdk-2-0-tutorial-1-your-first-watchapp/">Pebble SDK 2.0 Tutorial #1: Your First Watchapp</a>

<a title="Pebble SDK 2.0 Tutorial #2: Telling the Time." href="http://ninedof.wordpress.com/2013/12/18/pebble-sdk-2-0-tutorial-2-telling-the-time/">Pebble SDK 2.0 Tutorial #2: Telling the Time</a>

<a title="Pebble SDK 2.0 Tutorial #3: Images and Fonts" href="http://ninedof.wordpress.com/2013/12/22/pebble-sdk-2-0-tutorial-3-images-and-fonts/">Pebble SDK 2.0 Tutorial #3: Images and Fonts</a>

<a title="Pebble SDK 2.0 Tutorial #4: Animations and Timers" href="http://ninedof.wordpress.com/2013/12/29/pebble-sdk-2-0-tutorial-4-animations-and-timers/">Pebble SDK 2.0 Tutorial #4: Animations and Timers</a>

## Introduction

In this section of the tutorial we will be returning back to basics, building a simple watchapp that will use button presses (or clicks) and vibrations to enable the user to give input and receive output.

To get started, make a new CloudPebble project and add the C file from section 1, which consists of just the basic app life-cycle functions and a <code>TextLayer</code>. Since it is so brief, here it is again in full (with a couple of refinements for clarity):

<!-- language="cpp" -->
<pre><div class="code-block">
#include 

Window* window;
TextLayer *text_layer;

/* Load all Window sub-elements */
void window_load(Window *window)
{
  text_layer = text_layer_create(GRect(0, 0, 144, 168));
  text_layer_set_background_color(text_layer, GColorClear);
  text_layer_set_text_color(text_layer, GColorBlack);

  layer_add_child(window_get_root_layer(window), (Layer*) text_layer);
  text_layer_set_text(text_layer, "My first watchapp!");
}

/* Un-load all Window sub-elements */
void window_unload(Window *window)
{
  text_layer_destroy(text_layer);
}

/* Initialize the main app elements */
void init()
{
  window = window_create();
  WindowHandlers handlers = {
    .load = window_load,
    .unload = window_unload
  };
  window_set_window_handlers(window, (WindowHandlers) handlers);
  window_stack_push(window, true);
}

/* De-initialize the main app elements */
void deinit()
{
  window_destroy(window);
}

/* Main app lifecycle */
int main(void)
{
  init();
  app_event_loop();
  deinit();
}
</div></pre>

Now you're back up to speed, it's time to add the first new element: button clicks. The way this works in the Pebble SDK is that you provide the system with callbacks for what you want to happen when the button is pressed, just like with a <code>TickTimerService</code> implementation. These callbacks have the following signatures:

<!-- language="cpp" -->
<pre><div class="code-block">
void up_click_handler(ClickRecognizerRef recognizer, void *context)
{

}

void down_click_handler(ClickRecognizerRef recognizer, void *context)
{

}

void select_click_handler(ClickRecognizerRef recognizer, void *context)
{

}
</div></pre>

These will be needed in <code>init()</code> so make sure to place them above that function in the source file. To keep areas of code separate, place them above the <code>window_load()</code> and counterpart function to keep all <code>Window</code> related functions in one place in the file.

We will leave these blank for now as we continue to put all the pieces in place required for button click functionality. The next step is to register these with the system so it knows what to do when the button clicks occur. This is done in another function called a <code>ClickConfigProvider</code>, which (you guessed it) provides the click configuration. It looks like this, when filled with the requisite function calls necessary to register the individual button press callbacks from earlier. Each call links a button to its callback. Hopefully you can read it easily:

<!-- language="cpp" -->
<pre><div class="code-block">
void click_config_provider(void *context)
{
  window_single_click_subscribe(BUTTON_ID_UP, up_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, down_click_handler);
  window_single_click_subscribe(BUTTON_ID_SELECT, select_click_handler);
}
</div></pre>

After creating the button callbacks and providing a mechanism for telling the system what each individual button will do when pressed, the final step is to provide the system with the <code>click_config_provider()</code> function to enable it to call it and set up the button click behaviors. The back button cannot be controlled by the developer as it is used to back out a watchapp to the system menu! This final step is achieved in <code>init()</code> after the <code>Window</code> is created (but before it is pushed!) like so:

<!-- language="cpp" -->
<pre><div class="code-block">
window_set_click_config_provider(window, click_config_provider);
window_stack_push(window, true);
</div></pre>

Now we have our button clicks registered, let's make them do something! Perhaps the simplest and easiest demonstration is to have the buttons change the text being shown by the <code>TextLayer</code>. First, change the prompt shown to the user in <code>window_load()</code> from "My first watchapp!" to something a bit more relevant, such as "Press a button!". Now, in each button click handler callback function, add another <code>text_layer_set_text()</code> function call to set the text shown to that particular button. Here is just one example (do the other two yourself in a similar fashion!):

<!-- language="cpp" -->
<pre><div class="code-block">
void up_click_handler(ClickRecognizerRef recognizer, void *context)
{
  text_layer_set_text(text_layer, "You pressed UP!");
}
</div></pre>

After adding some actions to the three callbacks, compile the watchapp (make sure it is actually a watchapp as dictated by 'App kind' in the Settings screen) and test it. It should look like this:

![](/assets/import/media/2014/01/pressed.png)

So, there you have button clicks. To change the behavior, just change what happens in the callback functions. The rest can stay the same.

## Vibrations
With buttons providing a means of user input to your app, the next main means of output, besides what is being displayed on the screen, is to use the built-in vibration motor to notify users to events. For example, in my <a title="PTubeStatus: TFL Status on Your Wrist" href="http://ninedof.wordpress.com/2013/11/24/ptubestatus-tfl-status-on-your-wrist/">Pebble Tube Status</a> app (another shameless plug!) the watch vibrates once the updates data has been sent to the watch, so in the case of a slow data connection, the user can ignore the watch until the information is ready for viewing.

To use this functionality is much simpler than anything else we've covered so far. You can make the watch vibrate simply with one single line:

<!-- language="cpp" -->
<pre><div class="code-block">
vibes_short_pulse();

/* or */

vibes_long_pulse();

/* or */

vibes_double_pulse();
</div></pre>

To initiate a more complex vibration sequence, use a different form as shown below (I placed this in <code>up_click_handler()</code>, for example):

<!-- language="cpp" -->
<pre><div class="code-block">
//Create an array of ON-OFF-ON etc durations in milliseconds
uint32_t segments[] = {100, 200, 500};

//Create a VibePattern structure with the segments and length of the pattern as fields
VibePattern pattern = {
  .durations = segments,
  .num_segments = ARRAY_LENGTH(segments),
};

//Trigger the custom pattern to be executed
vibes_enqueue_custom_pattern(pattern);
</div></pre>

## Conclusion
That's pretty much all there is to button clicks and vibrations, which wraps up this part of the tutorial.

You can find a link to the full source code resulting from what we've covered here <a title="Source" href="https://github.com/C-D-Lewis/pebble-sdk2-tut-5">on GitHub</a>.

Next up: an introduction to working with PebbleJS and AppMessage. Basic knowledge of JavaScript required!
