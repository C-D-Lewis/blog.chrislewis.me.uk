---
id: 1594
title: Pebble SDK 2.0 Tutorial #6: AppMessage for PebbleKit JS
postDate: 2014-02-02 18:54:40
original: https://ninedof.wordpress.com/2014/02/02/pebble-sdk-2-0-tutorial-6-appmessage-for-pebblekit-js/
---

Required Reading

 [Pebble SDK 2.0 Tutorial #1: Your First Watchapp](http://ninedof.wordpress.com/2013/12/02/pebble-sdk-2-0-tutorial-1-your-first-watchapp/)

 [Pebble SDK 2.0 Tutorial #2: Telling the Time](http://ninedof.wordpress.com/2013/12/18/pebble-sdk-2-0-tutorial-2-telling-the-time/)

 [Pebble SDK 2.0 Tutorial #3: Images and Fonts](http://ninedof.wordpress.com/2013/12/22/pebble-sdk-2-0-tutorial-3-images-and-fonts/)

 [Pebble SDK 2.0 Tutorial #4: Animations and Timers](http://ninedof.wordpress.com/2013/12/29/pebble-sdk-2-0-tutorial-4-animations-and-timers/)

 [Pebble SDK 2.0 Tutorial #5: Buttons and Vibrations](http://ninedof.wordpress.com/2014/01/11/pebble-sdk-2-0-tutorial-5-buttons-and-vibrations/)

<em>A basic working knowledge of JavaScript is recommended, but it shouldn't be too hard to understand the language syntax as a beginner from the sample code provided at the end, especially coming from any Java or C related background (such as us!).</em>

## Introduction

Creating a simple Pebble watch app or watch face is well and fine, but adding an Internet connection to that app to fetch data/communicate with other services adds almost limitless potential. An example of this is my  [Pebble Tube Status](http://ninedof.wordpress.com/2013/11/24/ptubestatus-tfl-status-on-your-wrist/) app that fetches information on the status of the London Underground network for line info at a glance. For this tutorial section we will be getting our data from another source: The  [Openweathermap.org](http://openweathermap.org/API) APIs, a free to use and simple example of data a watch face can display from the web.

Now, this is a long one, so make sure you have a good cup of tea or some other soothing beverage near you before you embark!

## Basic Watch Face Setup

The first step this time is to create a new CloudPebble project and make sure it is set up in 'Settings' as a watchface, not a watch app. Next, copy in the C code below to start a bare-bones app:

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
  window_set_window_handlers(window, handlers);

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

This is the 'blank canvas' on which we will build this weather info app. The next steps are to prepare the watch app to display the data we get from the weather feed. Let's do this with four <code>TextLayer</code>s. These will be for the 'Openweathermap.org' title/attribution, the location, the temperature and the time the data was fetched. As you can see from the API page linked previously, there are a lot more fields of data to display, but these will keep the tutorial simple and concise. So, here are our four global <code>TextLayer</code> declarations:

[code language="cpp"]
TextLayer *title_layer, *location_layer, *temperature_layer, *time_layer;
[/code]

This time around we will take a measure to avoid the lengthy process of initialising these <code>TextLayer</code>s by using a custom utility function to save space. As I was taught in my first year of University, functions are best used to reduce repetitive code, so this is an ideal use case. Below is a function that will set up a <code>TextLayer</code> to specification provided in the arguments. Place it above <code>window_load()</code> in the very least, as that is where it will be used:

[code language="cpp"]
static TextLayer* init_text_layer(GRect location, GColor colour, GColor background, const char *res_id, GTextAlignment alignment)
{
  TextLayer *layer = text_layer_create(location);
  text_layer_set_text_color(layer, colour);
  text_layer_set_background_color(layer, background);
  text_layer_set_font(layer, fonts_get_system_font(res_id));
  text_layer_set_text_alignment(layer, alignment);

  return layer;
}
[/code]

Thus we can set up the title <code>TextLayer</code> like so in an abbreviated fashion:

[code language="cpp"]
void window_load(Window *window)
{
  title_layer = init_text_layer(GRect(5, 0, 144, 30), GColorBlack, GColorClear, &quot;RESOURCE_ID_GOTHIC_18&quot;, GTextAlignmentLeft);
  text_layer_set_text(title_layer, &quot;Openweathermap.org&quot;);
  layer_add_child(window_get_root_layer(window), text_layer_get_layer(title_layer));
}
[/code]

Take a moment to match the arguments given in the function call to its declaration and see that by using this function we can save an extra five lines per <code>TextLayer</code> initialisation! The rest of the other layers are set up in a similar fashion:

[code language="cpp"]
location_layer = init_text_layer(GRect(5, 30, 144, 30), GColorBlack, GColorClear, &quot;RESOURCE_ID_GOTHIC_18&quot;, GTextAlignmentLeft);
text_layer_set_text(location_layer, &quot;Location: N/A&quot;);
layer_add_child(window_get_root_layer(window), text_layer_get_layer(location_layer));

temperature_layer = init_text_layer(GRect(5, 60, 144, 30), GColorBlack, GColorClear, &quot;RESOURCE_ID_GOTHIC_18&quot;, GTextAlignmentLeft);
text_layer_set_text(temperature_layer, &quot;Temperature: N/A&quot;);
layer_add_child(window_get_root_layer(window), text_layer_get_layer(temperature_layer));

time_layer = init_text_layer(GRect(5, 90, 144, 30), GColorBlack, GColorClear, &quot;RESOURCE_ID_GOTHIC_18&quot;, GTextAlignmentLeft);
text_layer_set_text(time_layer, &quot;Last updated: N/A&quot;);
layer_add_child(window_get_root_layer(window), text_layer_get_layer(time_layer));
[/code]

We mustn't forget to destroy these in the appropriate place, as always!

[code language="cpp"]
void window_unload(Window *window)
{
  text_layer_destroy(title_layer);
  text_layer_destroy(location_layer);
  text_layer_destroy(temperature_layer);
  text_layer_destroy(time_layer);
}
[/code]

The watch app (once compiled) should look like this:

![](http://ninedof.files.wordpress.com/2014/02/pebble-screenshot_2014-02-02_13-16-291.png)

## Setting up <code>AppMessage</code>
Before we fetch the data from the Internet, we will need to set up the watch app to receive <code>AppMessage</code> messages from the Pebble phone app. Remember that with PebbleKit JS, the JavaScript code runs on the phone, and the results are sent via <code>AppMessage</code> to the watch for display. A basic overview of how that messaging system works can be seen in the "AppMessage system overview" section in the  [SDK 1.X Tutorial Section](http://ninedof.wordpress.com/2013/07/11/pebble-watch-face-sdk-tutorial-6-2-way-communication-with-android/) on the subject, but the methodology has changed with SDK 2.0. With that in mind, let's add some basic <code>AppMessage</code> framework:

## Step 1: Declaring keys. Keys are 'labels' used to tell each side of the system what the data value means. For example, a key called 'temperature' could have it's associated value treated as a temperature value. The names of keys and how they are interpreted are entirely up to the programmer, as you will soon see. The list of keys we will use are shown in the declaration below:

[code language="cpp"]
enum {
  KEY_LOCATION = 0,
  KEY_TEMPERATURE = 1,
};
[/code]

## Step 2: Create a callback for receiving data from the phone. There are other callbacks for failed events, but we won't worry about them here:

[code language="cpp"]
static void in_received_handler(DictionaryIterator *iter, void *context)
{

}
[/code]

## Step 3: Setting up <code>AppMessage</code> itself. This is done in <code>init()</code>, but before <code>window_stack_push()</code>:

[code language="cpp"]
//Register AppMessage events
app_message_register_inbox_received(in_received_handler);
app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());    //Largest possible input and output buffer sizes
[/code]

## Step 4: Set up how we will process the received <code>Tuple</code>s. After multiple <code>AppMessage</code> implementations, I've found the most reliable method is to read the first item, then repeat reading until no more are returned, using a <code>switch</code> based <code>process_tuple()</code> function to separate out the process. Here's how that is best done:

[code language="cpp"]
static void in_received_handler(DictionaryIterator *iter, void *context) 
{
	(void) context;
	
	//Get data
	Tuple *t = dict_read_first(iter);
	while(t != NULL)
	{
		process_tuple(t);
		
		//Get next
		t = dict_read_next(iter);
	}
}
[/code]

Next, declare some character buffers to store the last displayed data. The function <code>text_layer_set_text()</code> requires that the storage for the string it displays (when not a literal) is long-lived, so let's declare it globally:

[code language="cpp"]
char location_buffer[64], temperature_buffer[32], time_buffer[32];
[/code]

Thus, we must define what <code>process_tuple()</code> will do. This is the important part, as here is where the incoming <code>Tuple</code>s will be dissected and acted upon. The key and value of each <code>Tuple</code> is read and the key used in a <code>switch</code> statement to decide what to do with the accompanying data:

[code language="cpp"]
void process_tuple(Tuple *t)
{
  //Get key
  int key = t-&gt;key;

  //Get integer value, if present
  int value = t-&gt;value-&gt;int32;

  //Get string value, if present
  char string_value[32];
  strcpy(string_value, t-&gt;value-&gt;cstring);

  //Decide what to do
  switch(key) {
    case KEY_LOCATION:
      //Location received
      snprintf(location_buffer, sizeof(&quot;Location: couldbereallylongname&quot;), &quot;Location: %s&quot;, string_value);
      text_layer_set_text(location_layer, (char*) &amp;location_buffer);
      break;
    case KEY_TEMPERATURE:
      //Temperature received
      snprintf(temperature_buffer, sizeof(&quot;Temperature: XX \u00B0C&quot;), &quot;Temperature: %d \u00B0C&quot;, value);
      text_layer_set_text(temperature_layer, (char*) &amp;temperature_buffer);
      break;
  }

  //Set time this update came in
  time_t temp = time(NULL);
  struct tm *tm = localtime(&amp;temp);
  strftime(time_buffer, sizeof(&quot;Last updated: XX:XX&quot;), &quot;Last updated: %H:%M&quot;, tm);
  text_layer_set_text(time_layer, (char*) &amp;time_buffer);
}
[/code]

That concludes the Pebble side of the system for now.

## PebbleKit JS Setup
The Pebble phone app runs JavaScript code that actually fetches the data using the phone's data connection, and then sends the results as <code>AppMessage</code> dictionaries to the watch for interpretation and display (as already mentioned). To start, on the left side of the CloudPebble screen, choose 'JS', and begin the file with this code segment to listen for when the Pebble app is opened:

[code language="js"]
Pebble.addEventListener(&quot;ready&quot;,
  function(e) {
    //App is ready to receive JS messages
  }
);
[/code]

The next step is to declare the same set of keys to the JavaScript side as to the C side. To do this, go to Settings, and scroll down to 'PebbleKit JS Message Keys', and enter the same keys as defined in the C code , like so:

<code>
KEY_LOCATION 0
KEY_TEMPERATURE 1
</code>

Then hit 'Save changes'.

We've already initialised the JavaScript file to respond when the watch app is opened, with the 'ready' event. Now we will modify it to request the weather information and parse the result. The code below will do that, and follows a process similar to that laid out in the  [Pebble weather app example](https://github.com/pebble/pebble-sdk-examples/blob/master/pebblekit-js/weather/src/js/pebble-js-app.js). First, create a method that will connect to an URL and return the response with a <code>XMLHttpRequest</code> object. Here is an example method:

[code language="js"]
function HTTPGET(url) {
	var req = new XMLHttpRequest();
	req.open(&quot;GET&quot;, url, false);
	req.send(null);
	return req.responseText;
}
[/code]

Next, invoke this method with the correct URL for the location you want from the Openweathermap.org API. Once this is done, we will obtain the response as plain text. It will need to be parsed as a JSON object so we can read the individual data items. After this, we construct a dictionary of the information we're interested in using our pre-defined keys and send this to the watch. This whole process is shown below in a method called <code>getWeather()</code>, called in the 'ready' event callback:

[code language="js"]
var getWeather = function() {
	//Get weather info
	var response = HTTPGET(&quot;http://api.openweathermap.org/data/2.5/weather?q=London,uk&quot;);

	//Convert to JSON
	var json = JSON.parse(response);

	//Extract the data
	var temperature = Math.round(json.main.temp - 273.15);
	var location = json.name;

	//Console output to check all is working.
	console.log(&quot;It is &quot; + temperature + &quot; degrees in &quot; + location + &quot; today!&quot;);

	//Construct a key-value dictionary
	var dict = {&quot;KEY_LOCATION&quot; : location, &quot;KEY_TEMPERATURE&quot;: temperature};

	//Send data to watch for display
	Pebble.sendAppMessage(dict);
};

Pebble.addEventListener(&quot;ready&quot;,
  function(e) {
    //App is ready to receive JS messages
	getWeather();
  }
);
[/code]

After completing all this, the project is almost complete. After compiling and installing, you should get something similar to this:

![](http://ninedof.files.wordpress.com/2014/02/pebble-screenshot_2014-02-02_18-05-17.png)

## Final Steps

So we have our web-enabled watch app working as it should. If this were a watch face, we'd want it to update itself every so often for as long as it is open. Seeing as this is a demo app, this isn't too critical, but let's do it anyway as a learning experience. It only requires a few more lines of C and JS.

Return to your C file and subscribe to the tick timer service for minutely updates in <code>init()</code>, like so:

[code language="cpp"]
//Register to receive minutely updates
tick_timer_service_subscribe(MINUTE_UNIT, tick_callback);
[/code]

Add the corresponding de-init procedure:

[code language="cpp"]
tick_timer_service_unsubscribe();
[/code]

And finally the add callback named in the 'subscribe' call (as always, above where it is registered!):

[code language="cpp"]
void tick_callback(struct tm *tick_time, TimeUnits units_changed)
{

}
[/code]

We're going to use this tick handler to request new updates on the weather from the phone. The next step is to create a function to use <code>AppMessage</code> to send something back to the phone. Below is just such a function, accepting a key and a value (be sure to add this function above the tick callback!):

[code language="cpp"]
void send_int(uint8_t key, uint8_t cmd)
{
	DictionaryIterator *iter;
 	app_message_outbox_begin(&amp;iter);

 	Tuplet value = TupletInteger(key, cmd);
 	dict_write_tuplet(iter, &amp;value);

 	app_message_outbox_send();
}
[/code]

Every five minutes (it can be any interval) we will request new information. Seeing as this is the only time the watch app will ever communicate back this way, it doesn't matter which key or value we use. It is merely a 'hey!' sort of message. If you wanted to distinguish between the messages sent back to the phone, you'd use the exact same method of defining keys as we did for location and temperature values. So, we change the tick handler to look a little more like this:

[code language="cpp"]
void tick_callback(struct tm *tick_time, TimeUnits units_changed)
{
	//Every five minutes
	if(tick_time-&gt;tm_min % 5 == 0)
	{
		//Send an arbitrary message, the response will be handled by in_received_handler()
		send_int(5, 5);
	}
}
[/code]

The final piece of the puzzle is to set up the JavaScript file to respond in turn to these requests from the watch. We do that by registering to receive the 'appmessage' events, like so:

[code language="js"]
Pebble.addEventListener(&quot;appmessage&quot;,
  function(e) {
    //Watch wants new data!
	getWeather();
  }
);
[/code]

And there we have it! Every five minutes the watch will ask for updated data, and receive this new information after the phone querys openweathermap.org.

## Conclusions
That was a rather long journey, but it's an important one for stretching the usefulness of your Pebble beyond telling the time and date! It also introduces a lot of new concepts at once, which may confuse some. If you have a query, post it here and I'll do my best to answer it!

The full project source code that results from this Tutorial section can be found  [on GitHub here](https://github.com/C-D-Lewis/pebble-sdk2-tut-6).

Thanks for reading, and keep an eye out for more soon!
