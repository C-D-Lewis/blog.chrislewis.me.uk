---
index: 83
title: Pebble SDK 2.0 Tutorial #7: MenuLayers
postDate: 2014-03-13 01:46:27
original: https://ninedof.wordpress.com/2014/03/13/pebble-sdk-2-0-tutorial-7-menulayers/
---

Required Reading

 [Pebble SDK 2.0 Tutorial #1: Your First Watchapp](http://ninedof.wordpress.com/2013/12/02/pebble-sdk-2-0-tutorial-1-your-first-watchapp/)

 [Pebble SDK 2.0 Tutorial #2: Telling the Time](http://ninedof.wordpress.com/2013/12/18/pebble-sdk-2-0-tutorial-2-telling-the-time/)

 [Pebble SDK 2.0 Tutorial #3: Images and Fonts](http://ninedof.wordpress.com/2013/12/22/pebble-sdk-2-0-tutorial-3-images-and-fonts/)

 [Pebble SDK 2.0 Tutorial #4: Animations and Timers](http://ninedof.wordpress.com/2013/12/29/pebble-sdk-2-0-tutorial-4-animations-and-timers/)

 [Pebble SDK 2.0 Tutorial #5: Buttons and Vibrations](http://ninedof.wordpress.com/2014/01/11/pebble-sdk-2-0-tutorial-5-buttons-and-vibrations/)

 [Pebble SDK 2.0 Tutorial #6: AppMessage for PebbleKit JS](http://ninedof.wordpress.com/2014/02/02/pebble-sdk-2-0-tutorial-6-appmessage-for-pebblekit-js/)

## Introduction

After a few requests, in this section we will look at using <code>MenuLayer</code>s in a Pebble watchapp. If you pick up your Pebble now and press the select button from the watch face, what you see is a <code>MenuLayer</code>. It has rows, icons and actions. Let's build one of those!

![](http://ninedof.files.wordpress.com/2014/03/pebble-screenshot_2014-03-13_00-22-47.png)

## Setup

The first step as usual is to start a new CloudPebble project with the basic app template. Here's that again, for convenience:

[code language="cpp"]
#include &lt;pebble.h&gt;

Window* window;

void window_load(Window *window)
{

}

void window_unload(Window *window)
{

}

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

void deinit()
{
	window_destroy(window);
}

int main(void)
{
	init();
	app_event_loop();
	deinit();
}
[/code]

Now that's out the way, declare a global pointer to a <code>MenuLayer</code> at the top of the file below the pre-processor directives.

[code language="cpp"]
MenuLayer *menu_layer;
[/code]

This <code>Layer</code> type is a bit more complex to set up than the other <code>Layers</code>, in that it requires a large amount of information about how it will look and behave before it can be instantiated. This information is given to the <code>MenuLayer</code> via the use of a number of callbacks. When the <code>MenuLayer</code> is redrawn or reloaded, it calls these functions to get the relevant data. The advantage of this approach is that the <code>MenuLayer</code> rows can be filled with data that can be changed at any time, such as with [Wristponder](https://play.google.com/store/apps/details?id=com.wordpress.ninedof.wristponder) or [Pebble Tube Status](https://github.com/C-D-Lewis/pebble-tube-status/blob/master/src/main.c#L120) (shameless plugs!)

The [API documentation](https://developer.getpebble.com/2/api-reference/group___menu_layer.html#ga4dbe0980dc6d9fe2b49b778a067d6314) describes all the possible <code>MenuLayerCallbacks</code> that can be associated with a <code>MenuLayer</code>, but the ones we will be using for a simple example will be:


	- <code>.draw_row</code> - This is used to draw the layout inside a menu item
	- <code>.get_num_rows</code> - This is used to feedback the total number of rows in the <code>MenuLayer</code>. This can be a <code>#define</code>d value, or an <code>int</code>, and so variable
	- <code>.select_click</code> - This is used to decide what happens when the select button is pressed, which will vary depending on which row is currently selected


Let's define these callbacks using the signatures provided by the API documentation linked previously. These must be above <code>window_load()</code> as is now the norm (hopefully!):

[code language="cpp"]
void draw_row_callback(GContext *ctx, Layer *cell_layer, MenuIndex *cell_index, void *callback_context)
{

}

uint16_t num_rows_callback(MenuLayer *menu_layer, uint16_t section_index, void *callback_context)
{

}

void select_click_callback(MenuLayer *menu_layer, MenuIndex *cell_index, void *callback_context)
{

}
[/code]

Now those are in place, let's add code to have them do something we'd find more useful than blank callbacks. The example we are going to use is a list of fruits (boring, I know!). The list will be of seven fruits, and brief descriptions. Thus, the <code>num_rows_callback()</code> function becomes simply:

[code language="cpp"]
uint16_t num_rows_callback(MenuLayer *menu_layer, uint16_t section_index, void *callback_context)
{
	return 7;
}
[/code]

For the <code>draw_row_handler()</code>, we will need to be able to alter what is drawn in the row depending on <em>which</em> row it is. This can be done by <code>switch</code>ing the <code>cell_index-&gt;row</code> property. You can use the presented <code>GContext</code> however you like for any of the SDK drawing functions, but to keep things simple we will use the pre-made drawing functions provided by the SDK. With these two last points combined, the <code>draw_row_callback()</code> function transforms into this beast:

[code language="cpp"]
void draw_row_callback(GContext *ctx, Layer *cell_layer, MenuIndex *cell_index, void *callback_context)
{
	//Which row is it?
	switch(cell_index-&gt;row)
	{
	case 0:
		menu_cell_basic_draw(ctx, cell_layer, &quot;1. Apple&quot;, &quot;Green and crispy!&quot;, NULL);
		break;
	case 1:
		menu_cell_basic_draw(ctx, cell_layer, &quot;2. Orange&quot;, &quot;Peel first!&quot;, NULL);
		break;
	case 2:
		menu_cell_basic_draw(ctx, cell_layer, &quot;3. Pear&quot;, &quot;Teardrop shaped!&quot;, NULL);
		break;
	case 3:
		menu_cell_basic_draw(ctx, cell_layer, &quot;4. Banana&quot;, &quot;Can be a gun!&quot;, NULL);
		break;
	case 4:
		menu_cell_basic_draw(ctx, cell_layer, &quot;5. Tomato&quot;, &quot;Extremely versatile!&quot;, NULL);
		break;
	case 5:
		menu_cell_basic_draw(ctx, cell_layer, &quot;6. Grape&quot;, &quot;Bunches of 'em!&quot;, NULL);
		break;
	case 6:
		menu_cell_basic_draw(ctx, cell_layer, &quot;7. Melon&quot;, &quot;Only three left!&quot;, NULL);
		break;
	}
}
[/code]

The <code>NULL</code> references are in the place that a row icon reference would be placed (if a <code>GBitmap</code> were to be shown). Thus, each layer will be drawn with its own unique message.

The final callback, <code>select_click_callback()</code> will do something different depending on which row is selected when the select button is pressed. To illustrate this, we will use a series of vibrations that signifies the numerical value of the row. Here's how this is done (or Vibes 101!):

[code language="cpp"]
void select_click_callback(MenuLayer *menu_layer, MenuIndex *cell_index, void *callback_context)
{
	//Get which row
	int which = cell_index-&gt;row;

	//The array that will hold the on/off vibration times
	uint32_t segments[16] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

	//Build the pattern (milliseconds on and off in alternating positions)
	for(int i = 0; i &lt; which + 1; i++)
	{
		segments[2 * i] = 200;
		segments[(2 * i) + 1] = 100;
	}

	//Create a VibePattern data structure
	VibePattern pattern = {
		.durations = segments,
		.num_segments = 16
	};

	//Do the vibration pattern!
	vibes_enqueue_custom_pattern(pattern);
}
[/code]

With those three callbacks in place, we can actually create the <code>MenuLayer</code> and add it to the main <code>Window</code>. This is done in four stages:


	- Create the <code>MenuLayer</code> and assign it to the global pointer
	- Set it up to receive clicks from the <code>Window</code>
	- Set the callbacks we just wrote to give the <code>MenuLayer</code> the information it needs
	- Add the <code>MenuLayer</code> to the main <code>Window</code>


Here's the code for that sequence, with annotations (Note the casts used in the <code>MenuLayerCallbacks</code> structure creation):

[code language="cpp"]
void window_load(Window *window)
{
	//Create it - 12 is approx height of the top bar
	menu_layer = menu_layer_create(GRect(0, 0, 144, 168 - 16));

	//Let it receive clicks
	menu_layer_set_click_config_onto_window(menu_layer, window);

	//Give it its callbacks
	MenuLayerCallbacks callbacks = {
		.draw_row = (MenuLayerDrawRowCallback) draw_row_callback,
		.get_num_rows = (MenuLayerGetNumberOfRowsInSectionsCallback) num_rows_callback,
		.select_click = (MenuLayerSelectCallback) select_click_callback
	};
	menu_layer_set_callbacks(menu_layer, NULL, callbacks);

	//Add to Window
	layer_add_child(window_get_root_layer(window), menu_layer_get_layer(menu_layer));
}
[/code]

As always, de-init the <code>MenuLayer</code>:

[code language="cpp"]
void window_unload(Window *window)
{
	menu_layer_destroy(menu_layer);
}
[/code]

If all has gone well, after compilation you should be greeted with the screen below, as well as the corresponding vibrations when each row is selected:

![](http://ninedof.files.wordpress.com/2014/03/pebble-screenshot_2014-03-13_01-27-12.png)

## Conclusions
So that's how to setup a basic <code>MenuLayer</code>. An extended application like those mentioned previously will use <code>char[]</code> buffers to store each row's text, modified in a <code>in_received</code> signature <code>AppMessage</code> callback, and calling <code>menu_layer_reload_data()</code> in that <code>AppMessage</code> callback, thus updating the <code>MenuLayer</code> with the new data.

The source code can be found [on GitHub HERE](https://github.com/C-D-Lewis/pebble-sdk2-tut-7)!

Let me know any queries you have. Enjoy!
