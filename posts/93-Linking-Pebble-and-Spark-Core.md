---
id: 1936
title: Linking Pebble and Spark Core
postDate: 2014-05-12 00:41:21
original: https://ninedof.wordpress.com/2014/05/12/linking-pebble-and-spark-core/
---

Note: This post assumes basic knowledge of Pebble <code>AppMessage</code>, PebbleKit JS, jQuery <code>$.ajax()</code>, <code>Spark.function()</code> and similar API calls.

Also, the JS code may only work on Android devices.


## Introduction

A major appeal of the Pebble smartwatch is its potential both as a data display and a data input device. The addition of PebbleKit JS in SDK 2.0 allows a watchapp to connect to the internet and download data. Through the use of jQuery data can be requested, and with the <code>EventSource</code> object data can be listened for asynchronously.

This enables the watch to display data sent from the Core as well as make requests to the Spark Cloud to instruct the Core to execute functions or request the status of exposed variables. This means that the Pebble can use the Core as an interface for its I/O pins, which is an exciting prospect when considered with all the libraries available for Arduino (and by extension, the Core).

The purpose of this post is to instruct in what is required to get these two devices to interact. To do so, you must setup:


	- <code>AppMessage</code> and keys for the Pebble C program.
	- PebbleKit JS listeners (including jQuery and/or <code>EventSource</code>).
	- Use <code>Spark.function()</code>, <code>Spark.variable()</code> or <code>Spark.publish()</code> to expose the data you want to request/functions you want to execute remotely.


Visually, the process for triggering a <code>Spark.function()</code> call from Pebble looks like this (<code>Spark.variable()</code> works in the same way):

![](http://ninedof.files.wordpress.com/2014/05/pebble-core-fuction.png?w=545)

## Prepare Pebble

To prepare the Pebble end, declare the keys you will be using for <code>AppMessage</code> communication. For this example, we will use a key called <code>KEY_TOGGLE</code> with a value of 0. This will be used to instruct PebbleKit JS to call a function registered on the Core with <code>Spark.function()</code> to toggle a pin <code>HIGH</code> or <code>LOW</code>. This is shown below in the starting template for the watchapp:

[code language="cpp"]
#include &lt;pebble.h&gt;

#define KEY_TOGGLE 0

static Window *window;
static TextLayer *text_layer;

static void select_click_handler(ClickRecognizerRef recognizer, void *context) 
{
  text_layer_set_text(text_layer, &quot;Select&quot;);
}

static void click_config_provider(void *context) 
{
  window_single_click_subscribe(BUTTON_ID_SELECT, select_click_handler);
}

static void window_load(Window *window) 
{
  //Create TextLayer
  text_layer = text_layer_create(GRect(0, 0, 144, 168));
  text_layer_set_text(text_layer, &quot;Press SELECT to toggle Spark pin D0&quot;);
  text_layer_set_text_alignment(text_layer, GTextAlignmentCenter);
  layer_add_child(window_get_root_layer(window), text_layer_get_layer(text_layer));
}

static void window_unload(Window *window) 
{
  //Destroy TextLayer
  text_layer_destroy(text_layer);
}

static void init(void) 
{
  //Create Window
  window = window_create();
  window_set_click_config_provider(window, click_config_provider);
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
  window_stack_push(window, true);
}

static void deinit(void) 
{
  //Destroy Window
  window_destroy(window);
}

int main(void) 
{
  init();
  app_event_loop();
  deinit();
}
[/code]

The next step is to declare this key in the Pebble app package when it is compiled. This is in <code>appinfo.json</code> (or Settings on CloudPebble):

[code]
&quot;appKeys&quot;: {
  &quot;KEY_TOGGLE&quot;: 0
}
[/code]

Next, we open <code>AppMessage</code> in <code>init()</code>:

[code language="cpp"]
//Prepare AppMessage
app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
[/code]

create a function to send a key-value pair through <code>AppMessage</code>:

[code language="cpp"]
static void send_int(int key, int cmd)
{
  DictionaryIterator *iter;
  app_message_outbox_begin(&amp;iter);
  
  Tuplet value = TupletInteger(key, cmd);
  dict_write_tuplet(iter, &amp;value);
  
  app_message_outbox_send();
}
[/code]

and add a call to send <code>KEY_TOGGLE</code> when the select button is pressed:

[code language="cpp"]
static void select_click_handler(ClickRecognizerRef recognizer, void *context) 
{
  send_int(KEY_TOGGLE, 0);  //Value can be any int for now
}
[/code]

## Prepare PebbleKit JS
After preparing the Pebble app to send an <code>AppMessage</code>, we must prepare PebbleKit JS to receive it and make a call to the Spark Cloud. The first stage in this is to initialise the <code>pebble-js-app.js</code> file like so:

[code language="javascript"]
var deviceId = &quot;&quot;;
var accessToken = &quot;&quot;;

Pebble.addEventListener(&quot;ready&quot;,
    function(e) {
        console.log(&quot;Pebble JS Ready!&quot;);
    }
);

Pebble.addEventListener(&quot;appmessage&quot;,
	function(dict) {
		console.log(&quot;AppMessage received!&quot;);
	}
);
[/code]

The "appmessage" event callback is where we will make the Spark Cloud request, as this is triggered when an <code>AppMessage</code> is received. This will be run by any message received, but for the sake of precision and to accomodate multiple messages in an eventual application, we will single out messages with our <code>KEY_TOGGLE</code> key:

[code language="javascript"]
if(typeof dict.payload[&quot;KEY_TOGGLE&quot;] !== &quot;undefined&quot;) {
	console.log(&quot;KEY_TOGGLE received!&quot;);
}
[/code]

It is in this clause that we will use jQuery to make the Spark Cloud request. First, we must include jQuery as it is not supported by default by PebbleKit JS (to the best of my knowledge!). We can do this by calling the following method in the "ready" event callback:

[code language="javascript"]
var importjQuery = function() {
	var script = document.createElement('script');
	script.src = 'http://code.jquery.com/jquery-latest.min.js';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
};

Pebble.addEventListener(&quot;ready&quot;,
    function(e) {
        importjQuery();
        console.log(&quot;Pebble JS Ready!&quot;);
    }
);
[/code]

Next, we assemble the URL for the POST request and make the <code>$.ajax()</code> call. The URL contains the following elements (more details can be found on the  [Spark Docs site](http://docs.spark.io/#/api)):



- The base URL: https://api.spark.io/v1/devices/
- The Core Device ID
- The name of the function declared in <code>Spark.function()</code> (more on this later)
- The Access Token for secure access for token holders
- Any arguments (One string at this time)



Our function-to-be will be called <code>int toggle(String args)</code> as this is the accepted signature for <code>Spark.function()</code>. Storing our sensitive Device ID and Access Token as private variables in the JS file, the result looks like this:

[code language="javascript"]
var url = &quot;https://api.spark.io/v1/devices/&quot; + deviceId + &quot;/toggle?access_token=&quot; + accessToken;

//Send with jQuery
$.ajax({
  type: &quot;POST&quot;,
  url: url,
  data: {&quot;args&quot;:&quot;none&quot;},	//No args for the moment
  success: function() {
  	console.log(&quot;POST successful!&quot;);
  },
  dataType: &quot;json&quot;
});
[/code]

## Make sure you change the <code>deviceId</code> and <code>accessToken</code> variables at the top of the JS file to be those of you own Core!

This completes the PebbleKit JS preparation!

## Prepare the Core
The final step in setting up a <code>Spark.function()</code> triggered by Pebble is to write the actual Core firmware. This is a very simple program. A function with the signature mentioned previously is created to do the toggling, with a <code>bool</code> variable to maintain state. This is then exposed to the Cloud API using <code>Spark.function()</code> in <code>setup()</code>. The end result looks like this:

[code language="cpp"]
bool is_high = false;

int toggle(String args)
{
    if(is_high == true)
    {
        digitalWrite(D0, LOW);
        is_high = false;
    }
    else
    {
        digitalWrite(D0, HIGH);
        is_high = true;
    }
    
    return 0;
}

void setup() {
    pinMode(D0, OUTPUT);
    Spark.function(&quot;toggle&quot;, toggle);
}

void loop() {
    //Nothing here
}
[/code]

Finally, connect an LED to pin D0 of the Core. A recommended circuit is shown below (Using  [SchemeIT](http://www.digikey.co.uk/schemeit)):

![](http://ninedof.files.wordpress.com/2014/05/pebble-core-cir.png)

## Putting It All Together
Compile and upload the watchapp to your Pebble, compile and upload the Core firmware to your Core and launch the watchapp when the Core upload is done. You should see something similar to this:

![](http://ninedof.files.wordpress.com/2014/05/pebble-spark-screen1.png)

When the Core is breathing cyan and the Pebble watchapp is open, press the SELECT button. The LED should toggle on and off! 

## Conclusion
That's a basic overview of the setup to enable the control of Spark Core pins (functions in general) from a Pebble. In the near future I'll write more to cover sending data asynchronously back the other way using <code>Spark.publish()</code> and <code>EventSource</code> JS objects to receive them. 

You can get the sample project code for all stages  [here on GitHub](https://github.com/C-D-Lewis/pebble-spark-link). 

Any queries or feedback if I've made a JS faux-pas (I'm relatively new!), let me know!
