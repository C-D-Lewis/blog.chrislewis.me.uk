Pebble SDK 2.0 Tutorial #9: App Configuration
2014-05-24 15:15:06
Pebble
---

<strong>Required Reading

<a title="Pebble SDK 2.0 Tutorial #1: Your First Watchapp" href="http://ninedof.wordpress.com/2013/12/02/pebble-sdk-2-0-tutorial-1-your-first-watchapp/">Pebble SDK 2.0 Tutorial #1: Your First Watchapp</a>

<a title="Pebble SDK 2.0 Tutorial #2: Telling the Time." href="http://ninedof.wordpress.com/2013/12/18/pebble-sdk-2-0-tutorial-2-telling-the-time/">Pebble SDK 2.0 Tutorial #2: Telling the Time</a>

<a title="Pebble SDK 2.0 Tutorial #3: Images and Fonts" href="http://ninedof.wordpress.com/2013/12/22/pebble-sdk-2-0-tutorial-3-images-and-fonts/">Pebble SDK 2.0 Tutorial #3: Images and Fonts</a>

<a title="Pebble SDK 2.0 Tutorial #4: Animations and Timers" href="http://ninedof.wordpress.com/2013/12/29/pebble-sdk-2-0-tutorial-4-animations-and-timers/">Pebble SDK 2.0 Tutorial #4: Animations and Timers</a>

<a title="Pebble SDK 2.0 Tutorial #5: Buttons and Vibrations" href="http://ninedof.wordpress.com/2014/01/11/pebble-sdk-2-0-tutorial-5-buttons-and-vibrations/">Pebble SDK 2.0 Tutorial #5: Buttons and Vibrations</a>

<a title="Pebble SDK 2.0 Tutorial #6: AppMessage for PebbleKit JS" href="http://ninedof.wordpress.com/2014/02/02/pebble-sdk-2-0-tutorial-6-appmessage-for-pebblekit-js/">Pebble SDK 2.0 Tutorial #6: AppMessage for PebbleKit JS</a>

<a title="Pebble SDK 2.0 Tutorial #7: MenuLayers" href="http://ninedof.wordpress.com/2014/03/13/pebble-sdk-2-0-tutorial-7-menulayers/">Pebble SDK 2.0 Tutorial #7: MenuLayers</a>

<a title="Pebble SDK 2.0 Tutorial #8: Android App Integration" href="http://ninedof.wordpress.com/2014/04/03/pebble-sdk-2-0-tutorial-8-android-app-integration/">Pebble SDK 2.0 Tutorial #8: Android App Integration</a>

## Introduction

In this section of the tutorial series we will create a basic app that can be configured from the Pebble app. Lots of watchfaces and watchapps use this functionality to let the user tweak various aspects to their own liking. Watchfaces I've created before SDK 2.0 get around this by having each tweak in a separate watchface package, which lead to having five or six of the same watchface.

I've not yet gotten around to adding configuration to any of my watchfaces (although I plan to in the future) due to the fact that the configuration pages loaded from the Pebble app are not included in the watchapp package itself but are loaded from a remote website, and I have no web hosting to speak of. However, I have since discovered (although I'm sure I'm not the first) that such a page can be hosted on Dropbox. It must be in the Public folder, otherwise it is offered as a download and not as a webpage to view.

Let's get started!

## Watchapp Setup
The watchapp we will be creating will have a single option to keep things simple - the option to invert the colours. To begin with, create a new project and use the following code as a starting point:

<!-- language="cpp" -->
<pre><div class="code-block">
#include 

static Window *window;
static TextLayer *text_layer;

static void window_load(Window *window) 
{
  //Create TextLayer
  text_layer = text_layer_create(GRect(0, 0, 144, 168));
  text_layer_set_font(text_layer, fonts_get_system_font(FONT_KEY_GOTHIC_24_BOLD));
  text_layer_set_text_color(text_layer, GColorBlack);
  text_layer_set_background_color(text_layer, GColorWhite);
  text_layer_set_text(text_layer, "Not inverted!");

  layer_add_child(window_get_root_layer(window), text_layer_get_layer(text_layer));
}

static void window_unload(Window *window) 
{
  text_layer_destroy(text_layer);
}

static void init(void) 
{
  window = window_create();
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });

  window_stack_push(window, true);
}

static void deinit(void) 
{
  window_destroy(window);
}

int main(void) 
{
  init();
  app_event_loop();
  deinit();
}
</div></pre>

This should be familiar: a basic app that has a single <code>TextLayer</code> stating that the app is not inverted. The process I've adopted to setup app configuration has the following steps:

1. Setup <code>AppMessage</code> to enable messages containing option data to be sent from PebbleKit JS.
2. Setup the app to be configurable in <code>appinfo.json</code>, or the Settings page in CloudPebble.
3. Setup PebbleKit JS code to load the configuration page and send the result to the watch.
4. Write the HTML page that presents an interface to the user to allow them to choose their options.

## Setting Up AppMessage
We will start by declaring the key we will be using to receive the option to invert the watchapp. Don't forget to declare this in Settings on CloudPebble or in <code>appinfo.json</code> if you are working with the native SDK:

<!-- language="cpp" -->
<pre><div class="code-block">
#define KEY_INVERT 0
</div></pre>

Next, we create the <code>AppMessageInboxReceived</code> handler that will process any received messages. If they contain our key, we will compare the payload value <code>cstring</code> to set the colours of the app to be inverted or not, depending on the value received. We then use the <a title="Storage" href="https://developer.getpebble.com/2/api-reference/group___storage.html">Persistent Storage API</a> to save the result for the next time the watchapp is opened. This should be placed above <code>init()</code> as it will be called there in a moment:

<!-- language="cpp" -->
<pre><div class="code-block">
static void in_recv_handler(DictionaryIterator *iterator, void *context)
{
  //Get Tuple
  Tuple *t = dict_read_first(iterator);
  if(t)
  {
    switch(t->key)
    {
    case KEY_INVERT:
      //It's the KEY_INVERT key
      if(strcmp(t->value->cstring, "on") == 0)
      {
        //Set and save as inverted
        text_layer_set_text_color(text_layer, GColorWhite);
        text_layer_set_background_color(text_layer, GColorBlack);
        text_layer_set_text(text_layer, "Inverted!");

        persist_write_bool(KEY_INVERT, true);
      }
      else if(strcmp(t->value->cstring, "off") == 0)
      {
        //Set and save as not inverted
        text_layer_set_text_color(text_layer, GColorBlack);
        text_layer_set_background_color(text_layer, GColorWhite);
        text_layer_set_text(text_layer, "Not inverted!");

        persist_write_bool(KEY_INVERT, false);
      }
      break;
    }
  }
}
</div></pre>

The final step is to actually open <code>AppMessage</code> to enable communication with the phone. Do this in <code>init()</code>:

<!-- language="cpp" -->
<pre><div class="code-block">
app_message_register_inbox_received((AppMessageInboxReceived) in_recv_handler);
app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
</div></pre>

Note we used the <code>app_message_inbox_size_maximum()</code> and <code>app_message_outbox_size_maximum()</code> functions to get the maximum buffer sizes available. While not strictly required here, it is a good best practice. I've wasted a lot of time in past projects not realising the buffer sizes I'd chosen were too small!

The final step is to set up the app to load the last stored configuration when the app is restarted, and takes for form of a similar <code>if</code>, <code>else</code> as the <code>AppMessageInboxReceived</code> handler above. Again, we use the Persistent Storage API to get our last saved configuration value. The <code>window_load()</code>function becomes thus:

<!-- language="cpp" -->
<pre><div class="code-block">
static void window_load(Window *window) 
{
  //Check for saved option
  bool inverted = persist_read_bool(KEY_INVERT);

  //Create TextLayer
  text_layer = text_layer_create(GRect(0, 0, 144, 168));
  text_layer_set_font(text_layer, fonts_get_system_font(FONT_KEY_GOTHIC_24_BOLD));

  //Option-specific setup
  if(inverted == true)
  {
    text_layer_set_text_color(text_layer, GColorWhite);
    text_layer_set_background_color(text_layer, GColorBlack);
    text_layer_set_text(text_layer, "Inverted!");
  }
  else
  {
    text_layer_set_text_color(text_layer, GColorBlack);
    text_layer_set_background_color(text_layer, GColorWhite);
    text_layer_set_text(text_layer, "Not inverted!");
  }

  layer_add_child(window_get_root_layer(window), text_layer_get_layer(text_layer));
}
</div></pre>

Now the C code is complete!

## PebbleKit JS Setup
The PebbleKit JS component of the app is the part responsible for loading the configuration page and sends the results of the user interaction to the watch to be processed as we just set up. This is done through the "showConfiguration" and "webviewclosed" events. Here is our initial JS code. Add a new JS file in CloudPebble or to the <code>src/js/pebble-js-app.js</code> if coding natively:

<!-- language="javascript" -->
<pre><div class="code-block">
Pebble.addEventListener("ready",
  function(e) {
    console.log("PebbleKit JS ready!");
  }
);
</div></pre>

So far, so simple. Next, we add an event listener for the "showConfiguration" event, triggered when a user chooses the Settings button in the Pebble app, like that shown below:

![](/assets/import/media/2014/05/screenshot_2014-05-24-15-04-23.png?w=545)

The job of this event listener is to call <code>Pebble.openURL()</code>, a requirement of the system. This is when the configuration page is loaded (we will design this later). As stated in the introduction a good place to store this file is in your Public Dropbox folder. This way it is shown as a webpage and not as a download. Use mine for the moment, but if you want to make any changes you will need to change this to point to your own file:

<!-- language="javascript" -->
<pre><div class="code-block">
Pebble.addEventListener("showConfiguration",
  function(e) {
    //Load the remote config page
    Pebble.openURL("https://dl.dropboxusercontent.com/u/10824180/pebble%20config%20pages/sdktut9-config.html");
  }
);
</div></pre>

When the user has chosen their options and closed the page, the "webviewclosed" event is fired. We will register another event listener to handle this. The data returned will be encoded in the URL as a JSON dictionary containing one element: "invert" which will have a value of either "on" or "off" depending on what the user chose. This is then assembled into an <code>AppMessage</code> and sent to the watch, which then sets and saves as appropriate:

<!-- language="javascript" -->
<pre><div class="code-block">
Pebble.addEventListener("webviewclosed",
  function(e) {
    //Get JSON dictionary
    var configuration = JSON.parse(decodeURIComponent(e.response));
    console.log("Configuration window returned: " + JSON.stringify(configuration));

    //Send to Pebble, persist there
    Pebble.sendAppMessage(
      {"KEY_INVERT": configuration.invert},
      function(e) {
        console.log("Sending settings data...");
      },
      function(e) {
        console.log("Settings feedback failed!");
      }
    );
  }
);
</div></pre>

That concludes the PebbleKit JS setup. Now for the last part - HTML!

## Configuration HTML Page Setup
The final piece of the puzzle is the part the user will actually see and takes the form of a HTML page consisting of form elements such as checkboxes, selectors and buttons. We will just use one selector and one button to let the user choose if they want the watchapp to be inverted or not. Here's the layout code:

<!-- language="html" -->
<pre><div class="code-block">
<!DOCTYPE html>
<html>
  <head>
    <title>SDKTut9 Configuration</title>
  </head>
  <body>
    <h1>Pebble Config Tutorial</h1>
    Choose watchapp settings

    Invert watchapp:
    <select id="invert_select">
      <option value="off">Off</option>
      <option value="on">On</option>
    </select>
    

    
    <button id="save_button">Save</button>
    
  </body>
</html>
</div></pre>

With this done we add a script to add a click listener to the button and a function to assemble the JSON option dictionary. This dictionary is then encoded into the URL and handed to the PebbleKit JS code to be sent to the watch in the "webviewclosed" event. Insert this into the HTML page:

<!-- language="javascript" -->
<pre><div class="code-block">
<script>
  //Setup to allow easy adding more options later
  function saveOptions() {
    var invertSelect = document.getElementById("invert_select");

    var options = {
      "invert": invertSelect.options[invertSelect.selectedIndex].value
    }
    
    return options;
  };

  var submitButton = document.getElementById("save_button");
  submitButton.addEventListener("click", 
    function() {
      console.log("Submit");

      var options = saveOptions();
      var location = "pebblejs://close#" + encodeURIComponent(JSON.stringify(options));
      
      document.location = location;
    }, 
  false);
</script>
</div></pre>

That completes the page that will get the user's option choices and also the app itself! Compile the app and install on your watch. By choosing either 'On' or 'Off' on the configuration page you should be able to toggle the colour used in the watchapp. This should look like that shown below:

![](/assets/import/media/2014/05/invert-notinvert.png?w=545)

## Conclusion

So, that's the process I've adopted to set up app configuration. You can expand it by adding more <code>AppMessage</code> keys and more elements in the HTML page. Make sure to add the fields to the JSON object constructed in <code>saveOptions()</code> though. 

As usual, the full code is <a href="https://github.com/C-D-Lewis/pebble-sdk2-tut-9" title="Source Code">available on GitHub</a>. 
