Pebble SDK 2.0 Tutorial #8: Android App Integration
2014-04-03 23:33:53
Android,Pebble
---

<strong>Required Reading

<a title="Pebble SDK 2.0 Tutorial #1: Your First Watchapp" href="http://ninedof.wordpress.com/2013/12/02/pebble-sdk-2-0-tutorial-1-your-first-watchapp/">Pebble SDK 2.0 Tutorial #1: Your First Watchapp</a>

<a title="Pebble SDK 2.0 Tutorial #2: Telling the Time." href="http://ninedof.wordpress.com/2013/12/18/pebble-sdk-2-0-tutorial-2-telling-the-time/">Pebble SDK 2.0 Tutorial #2: Telling the Time</a>

<a title="Pebble SDK 2.0 Tutorial #3: Images and Fonts" href="http://ninedof.wordpress.com/2013/12/22/pebble-sdk-2-0-tutorial-3-images-and-fonts/">Pebble SDK 2.0 Tutorial #3: Images and Fonts</a>

<a title="Pebble SDK 2.0 Tutorial #4: Animations and Timers" href="http://ninedof.wordpress.com/2013/12/29/pebble-sdk-2-0-tutorial-4-animations-and-timers/">Pebble SDK 2.0 Tutorial #4: Animations and Timers</a>

<a title="Pebble SDK 2.0 Tutorial #5: Buttons and Vibrations" href="http://ninedof.wordpress.com/2014/01/11/pebble-sdk-2-0-tutorial-5-buttons-and-vibrations/">Pebble SDK 2.0 Tutorial #5: Buttons and Vibrations</a>

<a title="Pebble SDK 2.0 Tutorial #6: AppMessage for PebbleKit JS" href="http://ninedof.wordpress.com/2014/02/02/pebble-sdk-2-0-tutorial-6-appmessage-for-pebblekit-js/">Pebble SDK 2.0 Tutorial #6: AppMessage for PebbleKit JS</a>

<a title="Pebble SDK 2.0 Tutorial #7: MenuLayers" href="http://ninedof.wordpress.com/2014/03/13/pebble-sdk-2-0-tutorial-7-menulayers/">Pebble SDK 2.0 Tutorial #7: MenuLayers</a>

## Introduction

## NOTE: This section requires knowledge on how to set up a new Android project in an IDE such as <a title="Eclipse IDE" href="https://www.eclipse.org">Eclipse</a>! I will assume you are using Eclipse

After a few requests and comments, it's time to revisit the Android app communication from <a title="Pebble Watch Face SDK Tutorial #6: 2 Way Communication with Android" href="http://ninedof.wordpress.com/2013/07/11/pebble-watch-face-sdk-tutorial-6-2-way-communication-with-android/">the old 1.X tutorial series</a> and produce an example app for the new 2.0 SDK.

For the purposes of simplicity, we will be extending the Pebble SDK <code>new-project</code> example, which starts us off with a nice button setup. To do this, create a new empty CloudPebble project, and add this code to the main <code>.c</code> file:

<!-- language="cpp" -->
<pre><div class="code-block">
#include 

static Window *window;
static TextLayer *text_layer;

static void select_click_handler(ClickRecognizerRef recognizer, void *context) {
  text_layer_set_text(text_layer, "Select");
}

static void up_click_handler(ClickRecognizerRef recognizer, void *context) {
  text_layer_set_text(text_layer, "Up");
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context) {
  text_layer_set_text(text_layer, "Down");
}

static void click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_SELECT, select_click_handler);
  window_single_click_subscribe(BUTTON_ID_UP, up_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, down_click_handler);
}

static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  text_layer = text_layer_create((GRect) { .origin = { 0, 72 }, .size = { bounds.size.w, 20 } });
  text_layer_set_text(text_layer, "Press a button");
  text_layer_set_text_alignment(text_layer, GTextAlignmentCenter);
  layer_add_child(window_layer, text_layer_get_layer(text_layer));
}

static void window_unload(Window *window) {
  text_layer_destroy(text_layer);
}

static void init(void) {
  window = window_create();
  window_set_click_config_provider(window, click_config_provider);
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
  const bool animated = true;
  window_stack_push(window, animated);
}

static void deinit(void) {
  window_destroy(window);
}

int main(void) {
  init();

  APP_LOG(APP_LOG_LEVEL_DEBUG, "Done initializing, pushed window: %p", window);

  app_event_loop();
  deinit();
}

</div></pre>

With that in place, test compilation to make sure all works as it should regarding button operation.

To extend this to interact with an Android app, we must first add in the <code>AppMessage</code> components from the <a title="Pebble SDK 2.0 Tutorial #6: AppMessage for PebbleKit JS" href="http://ninedof.wordpress.com/2014/02/02/pebble-sdk-2-0-tutorial-6-appmessage-for-pebblekit-js/">AppMessage for PebbleKit JS</a> section. First, define the <code>in_received_handler()</code> where received <code>AppMessage</code>s will be interpreted as before:

<!-- language="cpp" -->
<pre><div class="code-block">
static void in_received_handler(DictionaryIterator *iter, void *context) 
{
   
}
</div></pre>

After this, register the handler and open <code>AppMessage</code> inside <code>init()</code>, before pushing the <code>Window</code>:

<!-- language="cpp" -->
<pre><div class="code-block">
//Register AppMessage events
app_message_register_inbox_received(in_received_handler);           
app_message_open(512, 512);    //Large input and output buffer sizes
</div></pre>

Define globally the protocol we will use for communication using enumerations or by <code>#define</code>ing constants. I prefer <code>enum</code>s, but both will do the job. We will define a key representing a button event occurring, and further values to distinguish between the buttons themselves:

<!-- language="cpp" -->
<pre><div class="code-block">
enum {
  KEY_BUTTON_EVENT = 0,
  BUTTON_EVENT_UP = 1,
  BUTTON_EVENT_DOWN = 2,
  BUTTON_EVENT_SELECT = 3
};
</div></pre>

The next step is to create a function to send these keys and values, which will be exactly the same as that shown in 'AppMessage for PebbleKit JS', above the click handlers:

<!-- language="cpp" -->
<pre><div class="code-block">
void send_int(uint8_t key, uint8_t cmd)
{
    DictionaryIterator *iter;
    app_message_outbox_begin(&iter);
     
    Tuplet value = TupletInteger(key, cmd);
    dict_write_tuplet(iter, &value);
     
    app_message_outbox_send();
}
</div></pre>

Finally, add calls to <code>send_int()</code> to each of the three button click handlers to send a signal corresponding to which button was pressed. This should look like the code shown below:

<!-- language="cpp" -->
<pre><div class="code-block">
static void select_click_handler(ClickRecognizerRef recognizer, void *context) {
  text_layer_set_text(text_layer, "Select");
  send_int(KEY_BUTTON_EVENT, BUTTON_EVENT_SELECT);
}

static void up_click_handler(ClickRecognizerRef recognizer, void *context) {
  text_layer_set_text(text_layer, "Up");
  send_int(KEY_BUTTON_EVENT, BUTTON_EVENT_UP);
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context) {
  text_layer_set_text(text_layer, "Down");
  send_int(KEY_BUTTON_EVENT, BUTTON_EVENT_DOWN);
}
</div></pre>

After setting up the Android side, we will come back to the Pebble side to implement the reverse process; sending data to the watch from Android.

## Android App Integration

Set up a new Android project and make sure it runs correctly as just a blank <code>Activity</code>. Following the Android SDK plugin for Eclipse without modifying any of the settings except project location and name is a good starting point, which I will be using. After completing this process and removing the superfluous <code>onCreateOptionsMenu()</code>, my main <code>Activity</code> file looks like this:

<!-- language="cpp" -->
<pre><div class="code-block">
package com.wordpress.ninedof.pebblesdk2part8;

import android.app.Activity;
import android.os.Bundle;

public class MainActivity extends Activity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
  }

}
</div></pre>

In order to communicate with Pebble, you will need to import the PebbleKit project into Eclipse. Once this is done, add it as a Library by right clicking the Tutorial project and choosing 'Properties', then clicking 'Add' under the 'Android' section. Choose 'PEBBLE_KIT' and click OK, then OK again to close the 'Properties' dialogue.

So, let's make the two talk! As the messages will begin coming from the watch we must register a <code>BroadcastReceiver</code> to intercept the Pebble's <code>AppMessages</code>. This is done as shown below:

<!-- language="java" -->
<pre><div class="code-block">
private PebbleDataReceiver mReceiver;

... onCreate() here ...

@Override
protected void onResume() {
  super.onResume();

  mReceiver = new PebbleDataReceiver(UUID.fromString("2fc99a5d-ee35-4057-aa9b-0d4dd8e35ef5")) {

    @Override
    public void receiveData(Context context, int transactionId, PebbleDictionary data) {
      
    }

  };

  PebbleKit.registerReceivedDataHandler(this, mReceiver);
}

@Override
protected void onPause() {
  super.onPause();
  
  unregisterReceiver(mReceiver);
}
</div></pre>

## Be careful to note that the UUID specified in the constructor is the SAME UUID as specified in your corresponding watchapp's <code>appinfo.json</code>, or in Settings on CloudPebble. The two must match for correct communication! 

Next, define the exact same set of keys and values as on the Pebble side, as these are used to communicate:

<!-- language="java" -->
<pre><div class="code-block">
private static final int
  KEY_BUTTON_EVENT = 0,
  BUTTON_EVENT_UP = 1,
  BUTTON_EVENT_DOWN = 2,
  BUTTON_EVENT_SELECT = 3;
</div></pre>

Now this is done we add logic to the overridden <code>receiveData()</code> method to determine which button press was encoded in the received message:

<!-- language="java" -->
<pre><div class="code-block">
@Override
public void receiveData(Context context, int transactionId, PebbleDictionary data) {
  //ACK the message
  PebbleKit.sendAckToPebble(context, transactionId);

  //Check the key exists
  if(data.getUnsignedInteger(KEY_BUTTON_EVENT) != null) {
    int button = data.getUnsignedInteger(KEY_BUTTON_EVENT).intValue();

    switch(button) {
    case BUTTON_EVENT_UP:
      //The UP button was pressed
      break;
    case BUTTON_EVENT_DOWN:
      //The DOWN button was pressed
      break;
    case BUTTON_EVENT_SELECT:
      //The SELECT button was pressed
      break;
    }
  }
}
</div></pre>

The last step that completes this leg of the journey is to actually see which button was pressed on the Android display, akin to how it is on the Pebble. To do this, simply set the main <code>View</code> to a <code>TextView</code> in <code>onCreate</code>:

<!-- language="java" -->
<pre><div class="code-block">
private TextView buttonView;

...

@Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);
  
  mButtonView = new TextView(this);
  mButtonView.setText("No button yet!");
  
  setContentView(mButtonView);
}
</div></pre>

Finally, add calls to <code>TextView.setText()</code> in the <code>switch</code> statement within the <code>receiveData</code> method to show on the Android display which button was pressed:

<!-- language="java" -->
<pre><div class="code-block">
switch(button) {
case BUTTON_EVENT_UP:
  //The UP button was pressed
  mButtonView.setText("UP button pressed!");
  break;
case BUTTON_EVENT_DOWN:
  //The DOWN button was pressed
  mButtonView.setText("DOWN button pressed!");
  break;
case BUTTON_EVENT_SELECT:
  //The SELECT button was pressed
  mButtonView.setText("SELECT button pressed!");
  break;
}
</div></pre>

Time to try it out! Compile and install the watchapp, run the Android project in Eclipse to install and launch on your phone, open the watchapp and press a button. You should see something like this:

![](/assets/import/media/2014/04/pebble-screenshot_2014-04-04_00-05-49.png)

![](/assets/import/media/2014/04/screenshot_2014-04-04-00-04-54.png?w=545)

## Going The Other Way

To send data back to Pebble, we will define a new key on both sides to trigger a vibration. Name this key <code>KEY_VIBRATION</code> and give it a value of <code>4</code>. With this done, modify the <code>receiveData()</code> method to send this message using a <code>PebbleDictionary</code> object after the <code>switch</code> statement like so:

<!-- language="java" -->
<pre><div class="code-block">
//Make the watch vibrate
PebbleDictionary dict = new PebbleDictionary();
dict.addInt32(KEY_VIBRATION, 0);
PebbleKit.sendDataToPebble(context, UUID.fromString("2fc99a5d-ee35-4057-aa9b-0d4dd8e35ef5"), dict);
</div></pre>

Finally, return to CloudPebble and add the new key to the main <code>.c</code> file. Finally, add a call to <code>vibes_short_pulse()</code> in <code>in_received_handler()</code>:

<!-- language="cpp" -->
<pre><div class="code-block">
enum {
  KEY_BUTTON_EVENT = 0,
  BUTTON_EVENT_UP = 1,
  BUTTON_EVENT_DOWN = 2,
  BUTTON_EVENT_SELECT = 3,
  KEY_VIBRATION = 4
};

...

static void in_received_handler(DictionaryIterator *iter, void *context) 
{
  Tuple *t = dict_read_first(iter);
  if(t)
  {
    vibes_short_pulse();
  }
}
</div></pre>

Recompile, install and launch BOTH the Pebble and Android apps, press a button and feel the communications flowing through to your wrist!

## Conclusions

Another long post! For more information on diving deeper and to send more complex forms of data, check out the <code>AppMessage</code> <a title="AppMessage Documentation" href="https://developer.getpebble.com/2/api-reference/group___app_message.html">documentation</a>.

Source code is on GitHub for both the <a title="Pebble source" href="https://github.com/C-D-Lewis/pebble-sdk2-tut-8-watch">Pebble</a> and <a title="Android source" href="https://github.com/C-D-Lewis/pebble-sdk2-tut-8-android">Android</a> projects.
