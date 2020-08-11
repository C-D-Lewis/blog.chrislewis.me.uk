Linking Pebble and Spark Core (Part 2)
2014-05-13 21:26:32
Integration,Pebble,Spark Core
---

<strong>Note: The JS code may only work on Android devices.

Part 1: <a href="http://ninedof.wordpress.com/2014/05/12/linking-pebble-and-spark-core/" title="Linking Pebble and Spark Core">Linking Pebble and Spark Core</a>

## Introduction

In the last post (linked above) I detailed the basics of connecting a Pebble watchapp's button clicks to a <code>Spark.function()</code> call on a Spark Core. In this post I will go over the reverse process: sending data back to the Pebble asynchronously. Once again this process uses a combination of Spark Cloud, PebbleKit JS and <code>AppMessage</code> to convey the message, which this time will be alerting a Pebble watch wearer that a button connected to the Core has been pressed via a short vibration pulse. 

## Preparing Pebble

The initial Pebble C program code is similar in structure to the last post's starting point, but without any of the <code>Click</code> functionality, as this will be a receive-only app. Thus the start of your project's main <code>.c</code> file will look like this:

<!-- language="cpp" -->
<pre><div class="code-block">
#include <pebble.h>

#define KEY_BUTTON_STATE 0

static Window *window;
static TextLayer *text_layer;

static void window_load(Window *window) 
{
  //Create TextLayer
  text_layer = text_layer_create(GRect(0, 0, 144, 168));
  text_layer_set_text(text_layer, "Press button on Core pin D0");
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
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });

  //Prepare AppMessage
  app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());

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
</div></pre>

Note that the name of the main <code>AppMessage</code> key has changed to a more appropriate <code>KEY_BUTTON_STATE</code>, but this is arbitrary - the value is still <code>0</code>.

Instead of receiving button clicks, the app will be receiving messages sent from the phone on receiving a message from the Spark Cloud. To do this, we register an <code>AppMessageInboxReceived</code> handler before opening the service:

<!-- language="cpp" -->
<pre><div class="code-block">
app_message_register_inbox_received((AppMessageInboxReceived) in_recv_handler);
</div></pre>

and also declare the function above <code>init()</code>:

<!-- language="cpp" -->
<pre><div class="code-block">
static void in_recv_handler(DictionaryIterator *iterator, void *context)
{

}
</div></pre>

This handler provides a <code>DictionaryIterator</code> structure that contains the received dictionary. To access the data, we use the <code>dict_read_first()</code> function to extract the tuple. This contains the key and value pair. We will then compare the value <code>cstring</code> and act accordingly ("HIGH" for button pressed and pulling pin D0 <code>HIGH</code> on the Core):

<!-- language="cpp" -->
<pre><div class="code-block">
static void in_recv_handler(DictionaryIterator *iterator, void *context)
{
  //Get first tuple (should be KEY_BUTTON_STATE)
  Tuple *t = dict_read_first(iterator);

  //If it's there
  if(t)
  {
    if(strcmp("HIGH", t->value->cstring) == 0)
    {
      vibes_short_pulse();
    }
  }
}
</div></pre>

Compile this and upload to your Pebble to make sure it is ready to work with PebbleKit JS, which we will set up next.

## Preparing PebbleKit JS

Also similar to last time, we must setup the JS code to listen for events from the Spark Cloud and send <code>AppMessage</code>s on to the watch. However, this time we do not require jQuery but instead use an object called <code>EventSource</code> that will provide the messages in a callback. This is done in the "ready" event handler:

<!-- language="javascript" -->
<pre><div class="code-block">
Pebble.addEventListener("ready",
  function(e) {
    //Register EventSource listener
    var core = new EventSource("https://api.spark.io/v1/events/?access_token=" + accessToken);
    core.addEventListener("button_state", 
      function(response) {
        
      }, 
      false
    );

    console.log("Pebble JS Ready!");
  }
);
</div></pre>

Note: This requires only your Access Token, not the Device ID. 

Once this callback has been created, it will be executed whenever a Core firmware uses <code>Spark.publish()</code> with the topic "button_state". When this event occurs, we will send the accompanying payload, either "HIGH" or "LOW" (details later) to the Pebble for it to decide whether to vibrate or not. This process looks like this:

<!-- language="javascript" -->
<pre><div class="code-block">
core.addEventListener("button_state", 
  function(response) {
    //Interpret response as JSON
    var json = JSON.parse(response.data);

    console.log("Payload is '" + json.data + "'");

    //Send the payload
    Pebble.sendAppMessage(
      {"KEY_BUTTON_STATE":json.data},
      function(e) {
        console.log("Sent '" + json.data + "' to Pebble.");
      },
      function(e) {
        console.log("Failed to send data to Pebble!");
      }
    );
  }, 
  false
);
</div></pre>

The <code>AppMessage</code> dictionary takes the form of a JSON dictionary with the key-value pair consisting of the declared key (remember to alter <code>appinfo.json</code> or the App Keys section in Settings on CloudPebble) and the word "HIGH" or "LOW" as received from the Core. We also get to register two callbacks for if the message was successful, and if it is not. The above code segment uses this to provide some meaningful log output. 

This completes the setup of the JS segment of the message's journey. With the JS code in place, re-compile and re-upload your Pebble <code>.pbw</code> file to your watch. 

## Preparing the Core

The last thing to do is to configure the Core to call <code>Spark.publish()</code> to notify the JS and C code we have already set up. This is done in the <code>loop()</code> function and takes the form of a simple <code>if</code>, <code>else</code> statement, depending on whether <code>digitalRead(D0)</code> determines whether the button is pressed. If you don't have a button to hand, you can simulate one by simply touching the 3.3V pin of your core to D0 briefly once the following code is in place and uploaded:

<!-- language="cpp" -->
<pre><div class="code-block">
static bool pressed = false;

void setup() {
    pinMode(D0, INPUT);
}

void loop() {
    //Publish button state
    if(digitalRead(D0) == HIGH && pressed == false)
    {
        Spark.publish("button_state", "HIGH");
        pressed = true;
        
        //Rate limit to prevent spamming the cloud
        delay(500);
    }
    else if(digitalRead(D0) == LOW && pressed == true)
    {
        Spark.publish("button_state", "LOW");
        pressed = false;
    }
}
</div></pre>

If you do have a push button to hand, here is how to connect it up, as <a href="http://arduino.cc/en/tutorial/button" title="Button">depicted on the Arduino site</a>, except instead of pin 2, we are using Core pin D0. Once this is done, ensure both watchapp and Core firmware are uploaded and running before pressing the button. The watch should vibrate within a couple of seconds!

## Conclusion

There we have an expansion on the original post, showing how to send asynchronous events and data from the Spare Core to the Pebble watch. A slight reduction in latency between the two can be theoretically achieved by calling <code>app_comm_set_sniff_interval(SNIFF_INTERVAL_REDUCED)</code>, although this will consume more power over a long term period.

As always, the source code to this project can be found <a href="https://github.com/C-D-Lewis/pebble-spark-link-2" title="Source code">here on GitHub</a>.

Enjoy! 
