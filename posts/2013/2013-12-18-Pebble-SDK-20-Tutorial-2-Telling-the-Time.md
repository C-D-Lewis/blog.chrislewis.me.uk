Pebble SDK 2.0 Tutorial #2: Telling the Time.
2013-12-18 13:33:57
Pebble
---

<strong>Required Reading

<a title="Pebble SDK 2.0 Tutorial #1: Your First Watchapp" href="http://ninedof.wordpress.com/2013/12/02/pebble-sdk-2-0-tutorial-1-your-first-watchapp/">Pebble SDK 2.0 Tutorial #1: Your First Watchapp</a>

## Introduction

So far, if you were stopped in the street and asked about your Pebble, you'd be able to wow them by telling them you wrote your own watch app. Less impressive will it seem when it can't do anything useful, so let's fix that now!

## Getting the Time

To get the time for your watchface, Pebble SDK allows you to subscribe to an event service that runs a 'handler' whenever it ticks.

For example, if you create a function called <code>tick_handler()</code> and register it to be run when the minute changes, you would be able to allow the watch to sleep the remaining time. Obviously there is a trade off between frequency of updates and power usage, but being the watch face designer, you get to choose!

So, create a new cloudpebble project and paste in the code you wrote in the last tutorial section into the main .c file. Let's get the time! First, go to Settings and change the 'App kind' to Watch Face.

The next step is to create the empty handler function we will use to update the time display when the minute ticks over. Here's how you'd go about doing that:

```cpp
void tick_handler(struct tm *tick_time, TimeUnits units_changed)
{
  //Here we will update the watchface display
}
```

The 'tick_time' argument contains the time data and 'units_changed' contains which unit was changed. You could use this to run an <code>Animation</code> once every hour, for example. Make sure the function is, as always, defined BEFORE it is first encountered. So in this case above where <code>window_load()</code> is defined.

You register this handler function with the tick event service using the function below, inserted into <code>init()</code>.

```cpp
tick_timer_service_subscribe(MINUTE_UNIT, (TickHandler) tick_handler);
```

The MINUTE_UNIT specifier tells the tick service that we want an update on each new minute, and no more often. You can choose other types from the API list <a title="Tick Units" href="https://developer.getpebble.com/2/api-reference/group___wall_time.html#ga0423d00e0eb199de523a92031b5a1107">here</a>.

Once again, we can undo what we set up when the watch face is unloaded, so add the corresponding unsubscribe call in <code>deinit()</code>. This is virtually redundant as nothing can happen once the watchface is closed, but is a good practice to get into:

```cpp
tick_timer_service_unsubscribe();
```

So now we will be getting our timely updates, we can update the <code>TextLayer</code> we created last time to show the time to the user. First, reserve a global character buffer that will live as long as the <code>TextLayer</code> below the pointers at the top of the file (as the text is not copied when being set as the <code>TextLayer</code>'s current text):

```cpp
char buffer[] = "00:00";
```

Next, add the following calls to your tick handler to format the character buffer with the time and set it as the <code>TextLayer</code>'s new text:

```cpp
void tick_handler(struct tm *tick_time, TimeUnits units_changed)
{
  //Format the buffer string using tick_time as the time source
  strftime(buffer, sizeof("00:00"), "%H:%M", tick_time);

  //Change the TextLayer text to show the new time!
  text_layer_set_text(text_layer, buffer);
}
```

A full listing of the modifiers can be found <a title="strftime" href="http://php.net/strftime">here</a>. Now when the tick event service counts a new minute, it will call our handler function, which in turn updates the time shown to the user. Nifty! Go to 'Compilation' and try it.

But what if we want to start the watchface with the time already showing? We can just call out tick handler (it is, after all, just a function!) and supply the current time and tick interval it is expecting. The code segment below shows how this is accomplished, placed at the end of <code>window_load()</code>:

```cpp
//Get a time structure so that the face does not start blank
struct tm *t;
time_t temp;
temp = time(NULL);
t = localtime(&temp);

//Manually call the tick handler when the window is loading
tick_handler(t, MINUTE_UNIT);
```

## Aesthetic Touches

At the moment this watch face is pretty dull. Let's make it a bit more pleasing to the eye! You can use the <code>text_layer_set_*</code> functions (<a title="TextLayer" href="https://developer.getpebble.com/2/api-reference/group___text_layer.html">found here</a>) to change how the <code>TextLayer</code> looks. Here's an example replacement of the relevant code segment in <code>window_load()</code> that looks a little more realistic:

```cpp
text_layer = text_layer_create(GRect(0, 53, 132, 168));
text_layer_set_background_color(text_layer, GColorClear);
text_layer_set_text_color(text_layer, GColorBlack);
text_layer_set_text_alignment(text_layer, GTextAlignmentCenter);
text_layer_set_font(text_layer, fonts_get_system_font(FONT_KEY_BITHAM_42_BOLD));

layer_add_child(window_get_root_layer(window), (Layer*) text_layer);
```

Now that the current time is large, front and center, we will add one final aesthetic touch before moving on to <code>GBitmap</code>s, custom <code>GFont</code>s, <code>Animation</code>s etc in the next section of the tutorial.

Introducing the <code>InverterLayer</code>! When placed on top of other layers, this <code>Layer</code> simply inverts all the pixels under it from white to black and vice versa. Let's add one on top of our time display to show the effect.

First, declare an <code>InverterLayer</code> pointer at the top of the file in global scope:

```cpp
InverterLayer *inv_layer;
```

Next, add the relevant function calls in <code>window_load()</code> to create and position the <code>InverterLayer</code>. Make sure it is added as a child layer AFTER the <code>TextLayer</code>, or the <code>TextLayer</code> won't be subject to its inverting effects (it won't be below it):

```cpp
//Inverter layer
inv_layer = inverter_layer_create(GRect(0, 50, 144, 62));
layer_add_child(window_get_root_layer(window), (Layer*) inv_layer);
```

Re-compile and install from the Compilation screen and you should see a smart banner of black across the middle of your watch face, inverting the previously black time text to white.

But we're still not done! Remember we must destroy what we create in the <code>window_unload()</code> function. Here's how said function should look now:

```cpp
void window_unload(Window *window)
{
  //We will safely destroy the Window elements here!
  text_layer_destroy(text_layer);

  inverter_layer_destroy(inv_layer);
}
```

## Conclusion

So there you have it! A more interesting watch face, ready for any way of improvement. I'll cover a few that I've already mentioned such as images, custom fonts and animations in the next tutorial sections. In the meantime check what you have against the example project available <a title="Source" href="https://github.com/C-D-Lewis/pebble-sdk2-tut-2">on GitHub</a>, or if you got stuck.

As always, let me know if you have any queries of feedback. Stay tuned for the next section!
