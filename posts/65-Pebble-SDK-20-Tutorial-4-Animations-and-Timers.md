---
index: 65
title: Pebble SDK 2.0 Tutorial #4: Animations and Timers
postDate: 2013-12-29 15:10:47
original: https://ninedof.wordpress.com/2013/12/29/pebble-sdk-2-0-tutorial-4-animations-and-timers/
---

Required Reading

 [Pebble SDK 2.0 Tutorial #1: Your First Watchapp](http://ninedof.wordpress.com/2013/12/02/pebble-sdk-2-0-tutorial-1-your-first-watchapp/)

 [Pebble SDK 2.0 Tutorial #2: Telling the Time](http://ninedof.wordpress.com/2013/12/18/pebble-sdk-2-0-tutorial-2-telling-the-time/)

 [Pebble SDK 2.0 Tutorial #3: Images and Fonts](http://ninedof.wordpress.com/2013/12/22/pebble-sdk-2-0-tutorial-3-images-and-fonts/)

## Introduction

After adding custom images and fonts to our watch face, the next logical way to improve it is to add non-static elements, movement if you will. For this we have <code>Animations</code>! Using the Pebble SDK provided <code>Animation</code> structure we can schedule movements of a <code>Layer</code>'s bounds whenever we want. This sort of "start here and go here" animation is called 'tweened' animation. The alternative kind offers greater flexibility and is achieved through the use of <code>AppTimer</code>s.

## Tweened Animation

Firstly, we will apply a simple example of a tweened animation to our tutorial watch face. Start by importing the project code from the last section into CloudPebble and giving it a new name, such as 'SDKTut4' for example. Be sure to change the short and long app names in the 'Settings' section! We are going to animate the <code>TextLayer</code> showing the time when the minute changes. The first step is to change the type of tick event we subscribe to to <code>SECOND_UNIT</code> in <code>init()</code>:

[code language="cpp"]
tick_timer_service_subscribe(SECOND_UNIT, (TickHandler) tick_handler);
[/code]

This will enable us to be more precise about when the time display changes, which should ideally be as close to the zero-second mark as possible. To carry out a tweened animation we create a <code>PropertyAnimation</code> instance and specify its duration, delay after scheduling (allowing sub-second timing) and a handler function to be called when it has finished to free up the memory we used in creating it in the first place. This process is summarized in the code segment below, which should be added before the <code>tick_handler()</code> function:

[code language="cpp"]
void on_animation_stopped(Animation *anim, bool finished, void *context)
{
	//Free the memory used by the Animation
	property_animation_destroy((PropertyAnimation*) anim);
}

void animate_layer(Layer *layer, GRect *start, GRect *finish, int duration, int delay)
{
	//Declare animation
	PropertyAnimation *anim = property_animation_create_layer_frame(layer, start, finish);

	//Set characteristics
	animation_set_duration((Animation*) anim, duration);
	animation_set_delay((Animation*) anim, delay);

	//Set stopped handler to free memory
	AnimationHandlers handlers = {
		//The reference to the stopped handler is the only one in the array
		.stopped = (AnimationStoppedHandler) on_animation_stopped
	};
	animation_set_handlers((Animation*) anim, handlers, NULL);

	//Start animation!
	animation_schedule((Animation*) anim);
}
[/code]

## Note: If you are compiling for the [Basalt platform](https://developer.getpebble.com/sdk/migration-guide/#using-propertyanimation), you do not need to manually destroy your animation, so leave the handler out. 

You can cast a <code>PropertyAnimation*</code> pointer to a <code>Animation*</code> pointer and vice versa where needed. In addition, for simplicity the <code>GRect</code>s describing the start and finish positions of the animated <code>Layer</code> are created on the heap, and then specified to the <code>animate_layer()</code> wrapper function as pointers using the '&amp;' operator.

Now that these new functions are in place, it is time to use them! The animation we will add will slide the time display out to the right hand side at <code>seconds == 59</code> and then change the time and slide it back in from the left on <code>seconds == 0</code>. To do this, we simply modify our <code>tick_handler()</code> function to create the <code>GRects</code> and call the wrapper function to schedule the animations. This is shown by annotated example below:

[code language="cpp"]
void tick_handler(struct tm *tick_time, TimeUnits units_changed)
{
	//Format the buffer string using tick_time as the time source
	strftime(buffer, sizeof(&quot;00:00&quot;), &quot;%H:%M&quot;, tick_time);

	int seconds = tick_time-&gt;tm_sec;

	if(seconds == 59)
	{
		//Slide offscreen to the right
		GRect start = GRect(0, 53, 144, 168);
		GRect finish = GRect(144, 53, 144, 168);
		animate_layer(text_layer_get_layer(text_layer), &amp;start, &amp;finish, 300, 500);
	}

	else if(seconds == 0)
	{
		//Change the TextLayer text to show the new time!
		text_layer_set_text(text_layer, buffer);

		//Slide onscreen from the left
		GRect start = GRect(-144, 53, 144, 168);
		GRect finish = GRect(0, 53, 144, 168);
		animate_layer(text_layer_get_layer(text_layer), &amp;start, &amp;finish, 300, 500);
	}

	else
	{
		//Change the TextLayer text to show the new time!
		text_layer_set_text(text_layer, buffer);
	}
}
[/code]

Compile this and check it works. If you are unsure about the timing, remove the <code>if</code> statements and have the <code>Animation</code> run every second (although perhaps only the first one!) and work your way up to two working in tandem.

## Timers

The other main method of moving elements around is to use an <code>AppTimer</code>. These allow you to schedule something to happen whenever and how often you like. The paradigm is that you register some callback (another name for handler) function to run after a given delay. When that delay has elapsed, the callback function is called and performs your task. You can think of an <code>Animation</code> as a task executed by an <code>AppTimer</code> but with a very small delay. The example we are going to create is a small shape that moves back and forth above the time display as an extra aesthetic touch.

To enable a smooth animation effect, the rate at which the shape moves its position should be at least 25 frames per second. At this rate, the delay in milliseconds between <code>AppTimer</code> callback executions will be 1000ms / 25 frames per second = 40ms delay. The first step is to create a new <code>TextLayer</code> to be our shape (here, a square). Do this at the top of the C file to accompany the other pointers:

[code language="cpp"]
TextLayer *text_layer, *square_layer;
[/code]

We are using a <code>TextLayer</code> for the convenience of being able to set just its bounds and background colour. Otherwise we would have go into graphics and update procedures, which are beyond the scope of this section. Also, we will need to declare the other elements of our moving cube; the <code>AppTimer</code>, its size, the time delta between frames and its movement direction, which will be either 1 or -1:

[code language="cpp"]
AppTimer *timer;
const int square_size = 10;
const int delta = 40;
int dx = 1;
[/code]

Next, we define the timer callback to update the position of the square. As you will see below, there are several stages to complete each time the callback is called:

[code language="cpp"]
void timer_callback(void *data) {
	//Get current position
	GRect current = layer_get_frame(text_layer_get_layer(square_layer));

	//Check to see if we have hit the edges
	if(current.origin.x &gt; 144 - square_size)
	{
		dx = -1;	//Reverse
	}
	else if(current.origin.x &lt; 0)
	{
		dx = 1;	//Forwards
	}

	//Move the square to the next position, modifying the x value
	GRect next = GRect(current.origin.x + dx, current.origin.y, square_size, square_size);
	layer_set_frame(text_layer_get_layer(square_layer), next);

	//Register next execution
	timer = app_timer_register(delta, (AppTimerCallback) timer_callback, NULL);
}
[/code]

Make sure this callback is defined before its first use, which will be in <code>window_load()</code> after the <code>TextLayer</code> itself is allocated, as shown below:

[code language="cpp"]
//Create the square layer
square_layer = text_layer_create(GRect(0, 55, square_size, square_size));
text_layer_set_background_color(square_layer, GColorWhite);
layer_add_child(window_get_root_layer(window), text_layer_get_layer(square_layer));
[/code]

Then, at the end of the function, start the chain reaction with an initial timer registration:

[code language="cpp"]
//Start the square moving
timer = app_timer_register(delta, (AppTimerCallback) timer_callback, NULL);
[/code]

Finally, we must add function calls to <code>window_unload()</code> to tear down the elements related to the moving square and free the memory used:

[code language="cpp"]
//Cancel timer
app_timer_cancel(timer);

//Destroy square layer
text_layer_destroy(square_layer);
[/code]

Finally, recompile and test the resulting watch face, and see the results! A thing to note is that waking up the Pebble's CPU this often will incur battery life penalties, so use timers sparingly!

## Conclusions

So that's how to use <code>Animation</code>s and <code>AppTimer</code>s! If you think about it, there is a way to replace the moving square's <code>AppTimer</code> with a <code>PropertyAnimation</code>, rendering its use here void. A more robust example is my [Starfield Demo](https://github.com/C-D-Lewis/starfield-demo/blob/master/src/starfielddemo.c), which uses such timers as the core of its operation. A link to the finished product from this section can be found [HERE](https://www.dropbox.com/s/bl3dx9mhba5yr4r/sdktut4.zip). Enjoy! If you have queries or comments, make them below, or [Tweet me](http://twitter.com/Chris_DL).
