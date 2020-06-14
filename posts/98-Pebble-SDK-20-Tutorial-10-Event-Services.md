---
id: 2040
title: Pebble SDK 2.0 Tutorial #10: Event Services
postDate: 2014-07-15 14:16:42
original: https://ninedof.wordpress.com/2014/07/15/pebble-sdk-2-0-tutorial-10-event-services/
---

Required Reading

 [Pebble SDK 2.0 Tutorial #1: Your First Watchapp](http://ninedof.wordpress.com/2013/12/02/pebble-sdk-2-0-tutorial-1-your-first-watchapp/)

 [Pebble SDK 2.0 Tutorial #2: Telling the Time](http://ninedof.wordpress.com/2013/12/18/pebble-sdk-2-0-tutorial-2-telling-the-time/)

 [Pebble SDK 2.0 Tutorial #3: Images and Fonts](http://ninedof.wordpress.com/2013/12/22/pebble-sdk-2-0-tutorial-3-images-and-fonts/)

 [Pebble SDK 2.0 Tutorial #4: Animations and Timers](http://ninedof.wordpress.com/2013/12/29/pebble-sdk-2-0-tutorial-4-animations-and-timers/)

 [Pebble SDK 2.0 Tutorial #5: Buttons and Vibrations](http://ninedof.wordpress.com/2014/01/11/pebble-sdk-2-0-tutorial-5-buttons-and-vibrations/)

 [Pebble SDK 2.0 Tutorial #6: AppMessage for PebbleKit JS](http://ninedof.wordpress.com/2014/02/02/pebble-sdk-2-0-tutorial-6-appmessage-for-pebblekit-js/)

 [Pebble SDK 2.0 Tutorial #7: MenuLayers](http://ninedof.wordpress.com/2014/03/13/pebble-sdk-2-0-tutorial-7-menulayers/)

 [Pebble SDK 2.0 Tutorial #8: Android App Integration](http://ninedof.wordpress.com/2014/04/03/pebble-sdk-2-0-tutorial-8-android-app-integration/)

 [Pebble SDK 2.0 Tutorial #9: App Configuration](http://ninedof.wordpress.com/2014/05/24/pebble-sdk-2-0-tutorial-9-app-configuration/)

## Introduction

In this section of the tutorial series, I will be covering some of the Event Services introduced in the 2.0 version of the Pebble SDK which have been oft requested due to their popularity in newer, interactive watchfaces. Namely:


	- Bluetooth Connection Service
	- Battery State Service
	- Accelerometer Service (tap and raw)
	- App Focus Service (not covered, but works identically to the Bluetooth Connection Service)


## Setup

To begin with, we will be using the blank template from before, shown below for convenience. Create a new CloudPebble project and start a new C file with the template as its contents:

[code language="cpp"]
#include &lt;pebble.h&gt;

static Window* window;

static void window_load(Window *window)
{

}

static void window_unload(Window *window)
{

}

static void init()
{
  window = window_create();
  WindowHandlers handlers = {
    .load = window_load,
    .unload = window_unload
  };
  window_set_window_handlers(window, (WindowHandlers) handlers);
  window_stack_push(window, true);
}

static void deinit()
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

## Bluetooth Connection Service
The first Event Service we will be using is the Bluetooth Connection Service, which allows us to see the current connection status as well as subscribe to updates (only while Bluetooth is actually connected, so be careful with debug logs), much in the same way as with the <code>TickTimerService</code>. Firstly, we will create a <code>TextLayer</code> in <code>window_load()</code> to use for showing the events happening. First is the global pointer:

[code language="cpp"]
static TextLayer *bt_layer;
[/code]

then creation proper in <code>window_load()</code>. Note the use of <code>bluetooth_connection_service_peek()</code> to show the state of the connection at the time of creation. As always we also add the corresponding destruction function call to free memory:

[code language="cpp"]
static void window_load(Window *window)
{
  //Setup BT Layer
  bt_layer = text_layer_create(GRect(5, 5, 144, 30));
  text_layer_set_font(bt_layer, fonts_get_system_font(FONT_KEY_GOTHIC_18));
  if(bluetooth_connection_service_peek() == true)
  {
    text_layer_set_text(bt_layer, &quot;BT: CONNECTED&quot;);
  }
  else
  {
    text_layer_set_text(bt_layer, &quot;BT: DISCONNECTED&quot;);
  }
  layer_add_child(window_get_root_layer(window), text_layer_get_layer(bt_layer));
}

static void window_unload(Window *window)
{
  text_layer_destroy(bt_layer);
}
[/code]

Next we will subscribe to the <code>BluetoothConnectionService</code> to update this <code>TextLayer</code> whenever the status of the Bluetooth connection to the phone changes. Like a <code>TickHandler</code>, we start by creating a function to use as a handler with the correct signature, and fill it with logic to change the text displayed. This should be placed before <code>init()</code>, where it will be registered:

[code language="cpp"]
static void bt_handler(bool connected)
{
  if(connected == true)
  {
    text_layer_set_text(bt_layer, &quot;BT: CONNECTED&quot;);
  }
  else
  {
    text_layer_set_text(bt_layer, &quot;BT: DISCONNECTED&quot;);
  }
}
[/code]

The final step is to perform the actual subscription, which is very easy to do, and happens in <code>init()</code>:

[code language="cpp"]
//Subscribe to BluetoothConnectionService
bluetooth_connection_service_subscribe(bt_handler);
[/code]

After compiling and installing the project, try disconnecting and re-connecting your phone's Bluetooth radio a few times and observe the result.

## Battery State Service
The next Event Service we will be adding will be the Battery State Service, which provides information on the Pebble's battery. It provides more detail than a simple <code>bool</code>, including charging status and whether the cable is plugged in or not. As before, we will create a new <code>TextLayer</code> to show the output. Add the pointer to the last one in the declaration:

[code language="cpp"]
static TextLayer *bt_layer, *batt_layer;
[/code]

Then, perform the proper creation in <code>window_load()</code>. This time, the information provided by the Battery State Service comes in the form on the <code>BatteryChargeState</code> data structure, with fields  [as shown in the documentation](https://developer.getpebble.com/2/api-reference/group___battery_state_service.html#struct_battery_charge_state). It is worth noting that the Service only returns the battery charge in increments of 10. The setup of the new <code>TextLayer</code> is shown below:

[code language="cpp"]
//Setup Battery Layer
batt_layer = text_layer_create(GRect(5, 25, 144, 30));
text_layer_set_font(batt_layer, fonts_get_system_font(FONT_KEY_GOTHIC_18));
layer_add_child(window_get_root_layer(window), text_layer_get_layer(batt_layer));

//Get info, copy to long-lived buffer and display
BatteryChargeState state = battery_state_service_peek();
static char buffer[] = &quot;Battery: 100/100&quot;;
snprintf(buffer, sizeof(&quot;Battery: 100/100&quot;), &quot;Battery: %d/100&quot;, state.charge_percent);
text_layer_set_text(batt_layer, buffer);
[/code]

After re-compiling, the battery charge percentage should be shown below the Bluetooth status.

## Accelerometer Service (tap)
The Accelerometer Service operates in a very similar manner to the previous two Event Services, but can operate in two modes: tap and raw data. The tap mode will call a handler that we subscribe when the Pebble is tapped (or wrist is shaken), whereas the raw data mode will supply X, Y and Z values at an rate we select. I'll show both of these for the sake of completeness. An application of the latter mode  [can be seen here](http://ninedof.wordpress.com/2014/04/24/block-game-using-pebble-accelerometer/).

First, we create a further <code>TextLayer</code> to show the output data:

[code language="cpp"]
static TextLayer *bt_layer, *batt_layer, *accel_layer;
[/code]

The first mode we will use is the tap mode. Let's create the <code>TextLayer</code> proper in <code>window_load()</code>:

[code language="cpp"]
//Setup Accel Layer
accel_layer = text_layer_create(GRect(5, 45, 144, 30));
text_layer_set_font(accel_layer, fonts_get_system_font(FONT_KEY_GOTHIC_18));
text_layer_set_text(accel_layer, &quot;Accel tap: N/A&quot;);
layer_add_child(window_get_root_layer(window), text_layer_get_layer(accel_layer));
[/code]

Next, we will create the handler function to be called whenever a tap is detected, and furnish it with logic to show what kind of tap was detected:

[code language="cpp"]
static void accel_tap_handler(AccelAxisType axis, int32_t direction)
{
  switch(axis)
  {
  case ACCEL_AXIS_X:
    if(direction &gt; 0)
    {
      text_layer_set_text(accel_layer, &quot;Accel tap: X (+)&quot;);
    }
    else
    {
      text_layer_set_text(accel_layer, &quot;Accel tap: X (-)&quot;);
    }
    break;
  case ACCEL_AXIS_Y:
    if(direction &gt; 0)
    {
      text_layer_set_text(accel_layer, &quot;Accel tap: Y (+)&quot;);
    }
    else
    {
      text_layer_set_text(accel_layer, &quot;Accel tap: Y (-)&quot;);
    }
    break;
  case ACCEL_AXIS_Z:
    if(direction &gt; 0)
    {
      text_layer_set_text(accel_layer, &quot;Accel tap: Z (+)&quot;);
    }
    else
    {
      text_layer_set_text(accel_layer, &quot;Accel tap: Z (-)&quot;);
    }
    break;
  }
}
[/code]

Finally, we subscribe our handler function to the Accelerometer Event Service in <code>init()</code>:

[code language="cpp"]
//Subscribe to AccelerometerService
accel_tap_service_subscribe(accel_tap_handler);
[/code]

You should now be able to see the result of tapping the watch. Personally I've found that shaking the wrist is a more reliable way of triggering events (such as showing more information on a watchface), but taps can still be used as an option.

## Accelerometer Service (raw data)
Finally, we will use the raw data mode of the Accelerometer Service. To do this, we will first remove the existing Accelerometer Service subscription (but still keep the handler for reference).

In the raw data mode, the data values arrive at a specific interval chosen with a call to <code>accel_service_set_sampling_rate()</code>, and the number of samples in a batch can be chosen using <code>accel_service_set_samples_per_update()</code>. We will stick with the default rate and update size for simplicity. Be aware that this mode will drain the battery significantly faster than the tap mode.

Next, we will create a new handler function to let us access the data that arrives from the Event Service. Accessing the data is as simple as reading the fields in the <code>data</code> parameter in the handler, as shown below:

[code language="cpp"]
static void accel_raw_handler(AccelData *data, uint32_t num_samples)
{
  static char buffer[] = &quot;XYZ: 9999 / 9999 / 9999&quot;;
  snprintf(buffer, sizeof(&quot;XYZ: 9999 / 9999 / 9999&quot;), &quot;XYZ: %d / %d / %d&quot;, data[0].x, data[0].y, data[0].z);
  text_layer_set_text(accel_layer, buffer);
}
[/code]

Finally, we add the new subscription, making sure we have disabled the one one in <code>init()</code>:

[code language="cpp"]
//Subscribe to AccelerometerService (uncomment one to choose)
//accel_tap_service_subscribe(accel_tap_handler);
accel_data_service_subscribe(1, accel_raw_handler);
[/code]

Now this is all in place, re-compile and re-install the watch app to see the live values. Try tilting the watch in each axis to see the  [constant g acceleration](http://en.wikipedia.org/wiki/Standard_gravity) act on each in turn.

The final result should look like this:
![](http://ninedof.files.wordpress.com/2014/07/final.png)

## Conclusion
So, that's the new Event Services. As I mentioned, there is another called the App Focus Service which tells you when your app is covered by a notification, but it works in a very similar way to the Bluetooth Connection Service, so you should be able to figure it out!

The full source code can be  [found here on GitHub](https://github.com/C-D-Lewis/pebble-sdk2-tut-10).
