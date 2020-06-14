---
id: 1824
title: Pebble SDK 2.0 Tutorial #8: Android App Integration
postDate: 2014-04-03 23:33:53
original: https://ninedof.wordpress.com/2014/04/03/pebble-sdk-2-0-tutorial-8-android-app-integration/
---

Required Reading

 [Pebble SDK 2.0 Tutorial #1: Your First Watchapp](http://ninedof.wordpress.com/2013/12/02/pebble-sdk-2-0-tutorial-1-your-first-watchapp/)

 [Pebble SDK 2.0 Tutorial #2: Telling the Time](http://ninedof.wordpress.com/2013/12/18/pebble-sdk-2-0-tutorial-2-telling-the-time/)

 [Pebble SDK 2.0 Tutorial #3: Images and Fonts](http://ninedof.wordpress.com/2013/12/22/pebble-sdk-2-0-tutorial-3-images-and-fonts/)

 [Pebble SDK 2.0 Tutorial #4: Animations and Timers](http://ninedof.wordpress.com/2013/12/29/pebble-sdk-2-0-tutorial-4-animations-and-timers/)

 [Pebble SDK 2.0 Tutorial #5: Buttons and Vibrations](http://ninedof.wordpress.com/2014/01/11/pebble-sdk-2-0-tutorial-5-buttons-and-vibrations/)

 [Pebble SDK 2.0 Tutorial #6: AppMessage for PebbleKit JS](http://ninedof.wordpress.com/2014/02/02/pebble-sdk-2-0-tutorial-6-appmessage-for-pebblekit-js/)

 [Pebble SDK 2.0 Tutorial #7: MenuLayers](http://ninedof.wordpress.com/2014/03/13/pebble-sdk-2-0-tutorial-7-menulayers/)

## Introduction

## NOTE: This section requires knowledge on how to set up a new Android project in an IDE such as  [Eclipse](https://www.eclipse.org)! I will assume you are using Eclipse

After a few requests and comments, it's time to revisit the Android app communication from  [the old 1.X tutorial series](http://ninedof.wordpress.com/2013/07/11/pebble-watch-face-sdk-tutorial-6-2-way-communication-with-android/) and produce an example app for the new 2.0 SDK.

For the purposes of simplicity, we will be extending the Pebble SDK <code>new-project</code> example, which starts us off with a nice button setup. To do this, create a new empty CloudPebble project, and add this code to the main <code>.c</code> file:

[code language="cpp"]
#include &lt;pebble.h&gt;

static Window *window;
static TextLayer *text_layer;

static void select_click_handler(ClickRecognizerRef recognizer, void *context) {
  text_layer_set_text(text_layer, &quot;Select&quot;);
}

static void up_click_handler(ClickRecognizerRef recognizer, void *context) {
  text_layer_set_text(text_layer, &quot;Up&quot;);
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context) {
  text_layer_set_text(text_layer, &quot;Down&quot;);
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
  text_layer_set_text(text_layer, &quot;Press a button&quot;);
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

  APP_LOG(APP_LOG_LEVEL_DEBUG, &quot;Done initializing, pushed window: %p&quot;, window);

  app_event_loop();
  deinit();
}

[/code]

With that in place, test compilation to make sure all works as it should regarding button operation.

To extend this to interact with an Android app, we must first add in the <code>AppMessage</code> components from the  [AppMessage for PebbleKit JS](http://ninedof.wordpress.com/2014/02/02/pebble-sdk-2-0-tutorial-6-appmessage-for-pebblekit-js/) section. First, define the <code>in_received_handler()</code> where received <code>AppMessage</code>s will be interpreted as before:

[code language="cpp"]
static void in_received_handler(DictionaryIterator *iter, void *context) 
{
   
}
[/code]

After this, register the handler and open <code>AppMessage</code> inside <code>init()</code>, before pushing the <code>Window</code>:

[code language="cpp"]
//Register AppMessage events
app_message_register_inbox_received(in_received_handler);           
app_message_open(512, 512);    //Large input and output buffer sizes
[/code]

Define globally the protocol we will use for communication using enumerations or by <code>#define</code>ing constants. I prefer <code>enum</code>s, but both will do the job. We will define a key representing a button event occurring, and further values to distinguish between the buttons themselves:

[code language="cpp"]
enum {
	KEY_BUTTON_EVENT = 0,
	BUTTON_EVENT_UP = 1,
	BUTTON_EVENT_DOWN = 2,
	BUTTON_EVENT_SELECT = 3
};
[/code]

The next step is to create a function to send these keys and values, which will be exactly the same as that shown in 'AppMessage for PebbleKit JS', above the click handlers:

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

Finally, add calls to <code>send_int()</code> to each of the three button click handlers to send a signal corresponding to which button was pressed. This should look like the code shown below:

[code language="cpp"]
static void select_click_handler(ClickRecognizerRef recognizer, void *context) {
	text_layer_set_text(text_layer, &quot;Select&quot;);
	send_int(KEY_BUTTON_EVENT, BUTTON_EVENT_SELECT);
}

static void up_click_handler(ClickRecognizerRef recognizer, void *context) {
	text_layer_set_text(text_layer, &quot;Up&quot;);
	send_int(KEY_BUTTON_EVENT, BUTTON_EVENT_UP);
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context) {
	text_layer_set_text(text_layer, &quot;Down&quot;);
	send_int(KEY_BUTTON_EVENT, BUTTON_EVENT_DOWN);
}
[/code]

After setting up the Android side, we will come back to the Pebble side to implement the reverse process; sending data to the watch from Android.

## Android App Integration

Set up a new Android project and make sure it runs correctly as just a blank <code>Activity</code>. Following the Android SDK plugin for Eclipse without modifying any of the settings except project location and name is a good starting point, which I will be using. After completing this process and removing the superfluous <code>onCreateOptionsMenu()</code>, my main <code>Activity</code> file looks like this:

[code language="cpp"]
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
[/code]

In order to communicate with Pebble, you will need to import the PebbleKit project into Eclipse. Once this is done, add it as a Library by right clicking the Tutorial project and choosing 'Properties', then clicking 'Add' under the 'Android' section. Choose 'PEBBLE_KIT' and click OK, then OK again to close the 'Properties' dialogue.

So, let's make the two talk! As the messages will begin coming from the watch we must register a <code>BroadcastReceiver</code> to intercept the Pebble's <code>AppMessages</code>. This is done as shown below:

[code language="java"]
private PebbleDataReceiver mReceiver;

... onCreate() here ...

@Override
protected void onResume() {
	super.onResume();

	mReceiver = new PebbleDataReceiver(UUID.fromString(&quot;2fc99a5d-ee35-4057-aa9b-0d4dd8e35ef5&quot;)) {

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
[/code]

## Be careful to note that the UUID specified in the constructor is the SAME UUID as specified in your corresponding watchapp's <code>appinfo.json</code>, or in Settings on CloudPebble. The two must match for correct communication! 

Next, define the exact same set of keys and values as on the Pebble side, as these are used to communicate:

[code language="java"]
private static final int
	KEY_BUTTON_EVENT = 0,
	BUTTON_EVENT_UP = 1,
	BUTTON_EVENT_DOWN = 2,
	BUTTON_EVENT_SELECT = 3;
[/code]

Now this is done we add logic to the overridden <code>receiveData()</code> method to determine which button press was encoded in the received message:

[code language="java"]
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
[/code]

The last step that completes this leg of the journey is to actually see which button was pressed on the Android display, akin to how it is on the Pebble. To do this, simply set the main <code>View</code> to a <code>TextView</code> in <code>onCreate</code>:

[code language="java"]
private TextView buttonView;

...

@Override
protected void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	
	mButtonView = new TextView(this);
	mButtonView.setText(&quot;No button yet!&quot;);
	
	setContentView(mButtonView);
}
[/code]

Finally, add calls to <code>TextView.setText()</code> in the <code>switch</code> statement within the <code>receiveData</code> method to show on the Android display which button was pressed:

[code language="java"]
switch(button) {
case BUTTON_EVENT_UP:
	//The UP button was pressed
	mButtonView.setText(&quot;UP button pressed!&quot;);
	break;
case BUTTON_EVENT_DOWN:
	//The DOWN button was pressed
	mButtonView.setText(&quot;DOWN button pressed!&quot;);
	break;
case BUTTON_EVENT_SELECT:
	//The SELECT button was pressed
	mButtonView.setText(&quot;SELECT button pressed!&quot;);
	break;
}
[/code]

Time to try it out! Compile and install the watchapp, run the Android project in Eclipse to install and launch on your phone, open the watchapp and press a button. You should see something like this:

![](http://ninedof.files.wordpress.com/2014/04/pebble-screenshot_2014-04-04_00-05-49.png)

![](http://ninedof.files.wordpress.com/2014/04/screenshot_2014-04-04-00-04-54.png?w=545)

## Going The Other Way

To send data back to Pebble, we will define a new key on both sides to trigger a vibration. Name this key <code>KEY_VIBRATION</code> and give it a value of <code>4</code>. With this done, modify the <code>receiveData()</code> method to send this message using a <code>PebbleDictionary</code> object after the <code>switch</code> statement like so:

[code language="java"]
//Make the watch vibrate
PebbleDictionary dict = new PebbleDictionary();
dict.addInt32(KEY_VIBRATION, 0);
PebbleKit.sendDataToPebble(context, UUID.fromString(&quot;2fc99a5d-ee35-4057-aa9b-0d4dd8e35ef5&quot;), dict);
[/code]

Finally, return to CloudPebble and add the new key to the main <code>.c</code> file. Finally, add a call to <code>vibes_short_pulse()</code> in <code>in_received_handler()</code>:

[code language="cpp"]
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
[/code]

Recompile, install and launch BOTH the Pebble and Android apps, press a button and feel the communications flowing through to your wrist!

## Conclusions

Another long post! For more information on diving deeper and to send more complex forms of data, check out the <code>AppMessage</code>  [documentation](https://developer.getpebble.com/2/api-reference/group___app_message.html).

Source code is on GitHub for both the  [Pebble](https://github.com/C-D-Lewis/pebble-sdk2-tut-8-watch) and  [Android](https://github.com/C-D-Lewis/pebble-sdk2-tut-8-android) projects.