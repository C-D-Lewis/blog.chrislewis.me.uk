Pebble Watch Face SDK Tutorial #4: Anatomy of Your First Watch Face
2013-06-21 21:46:34
Pebble
---

<strong>UPDATE: The section on setting text has been updated to reflect font name change in PebbleKit v1.12

<code></code><strong>Links to Previous Sections:

Here are links to the previous sections of this tutorial. Read them if you haven't to get up to speed!

<a title="Pebble Watch Face SDK Tutorial #1: Beginner’s Primer to the C Language" href="http://ninedof.wordpress.com/2013/06/19/pebble-watch-face-sdk-tutorial-1-beginners-primer-to-the-c-language/">Part #1: Beginner's Primer to the C Language</a>

<a title="Pebble Watch Face SDK Tutorial #2: Applying the Primer to the Pebble SDK" href="http://ninedof.wordpress.com/2013/06/20/pebble-watch-face-sdk-tutorial-2-applying-the-primer-to-the-pebble-sdk/">Part #2: Applying the Primer to the Pebble SDK</a>

<a title="Pebble Watch Face SDK Tutorial #3: Setting up a Ubuntu Virtual Machine for Development" href="http://ninedof.wordpress.com/2013/06/20/pebble-watch-face-sdk-tutorial-3-setting-up-a-ubuntu-virtual-machine-for-development/">Part #3: Setting Up a Ubuntu Environment for Development</a>

## Introduction

This is the section you've all been waiting for, I suspect. Here, we'll examine the key functions and features of a basic watch face source file, and how it all fits together. By the end of this section, you should have assembled your very first watch face!

In summary:

• Pre-processor statements

• Static allocation vs. Stack allocation

• Handler functions

• Getting the time from the system and 24 hour compatibility

• Minute ticks vs. seconds ticks

• The resource map

• Compiling and installing

Lets begin!

## Pre-processor statements

These special statements let you give instructions to the compiler. There are two types I'll mention here, <code>#include</code> and <code>#define</code>. The former tells the compiler to include extra files that contain functions, data structure types and constant values provided by the Pebble SDK. The latter lets you specify a key word to represent a value (such as a left hand margin) so you can avoid typing that number over and over again.

Another big advantage of using a <code>#define</code>ed variable is that if you use it as (for example) a margin for all features of the watch face and then decide to change that value, you can simply just change the <code>#define</code> statement and not every single instance where it is used. Neat, eh?

Here is how those statements are used for a Pebble watch face:

```cpp
//Include files from SDK
#include "pebble_os.h"
#include "pebble_app.h"
#include "pebble_fonts.h"
```

The #define statement is used to define the Universally Unique Identifier, a random number that uniquely defines your watch face. It is used by the Pebble OS to let you overwrite your watch face with a new version.

```cpp
//Define Universally Unique Identifier
//    88a97cfd-2377-463a-84bd-b85eb4964063
#define UUID { 0x88, 0xa9, 0x7c, 0xfd, 0x23, 0x77, 0x46, 0x3a, 0x84, 0xbd, 0xb8, 0x5e, 0xb4, 0x96, 0x40, 0x63 }
```

Each watch face MUST have a new one! Here is how you generate a new one in Ubuntu, using the 'uuidgen' command:

![](/assets/import/media/2013/06/uuidgen.png)

## Static allocation vs. Stack allocation

As you saw in Part #2, if you declare a variable or structure outside ANY function (usually at the top of the file) then it is visible to all parts of the program (it is globally accessible). Once it is declared, that memory is kept safe for later use.

The opposite of this is called 'stack allocation' and is much different. With stack allocation, you can imagine a stack of variables in memory like a stack of cards. When you call a function, any declarations you put in there are added to the top of the stack of memory. When the function returns or exits, these variables are freed up to make more memory available, as it is assumed they are only needed for that function. The variable is declared 'locally'.

So, if you know you want to keep data for later, declare it globally. If you only need it for a single calculation, declare it locally!

For our watch face, we declare the watch face features globally, as well as memory for the string containing the current time (more on how we get that later):

```cpp
//Declare structures for watch face elements
Window window;
TextLayer timeLayer;

//Declare variable for storing time string
static char hourText[] = "00:00";
```

## Handler functions

In a Pebble watch face, there are certain functions that aren't called by the programmer (you), but by the system. An example is a function called every time a second ticks by. You can't know when this is, but the system does (it's a watch, after all!). What you can do as the programmer is specify what happens in this function, and leave the actual calling of it to the system. It 'handles' that scenario for you.

There are many different 'handler' functions, but the two main ones I'll introduce here are the 'init handler' and the 'tick handler'. There are also handlers for buttons, 2-way communication events and animation etc.

The 'init handler' is called as soon as you switch to your watch face. Any initialisation of watch face features and structures is placed in here, so it is all done for you in one go when you open the watch face.

Here is the 'init handler' for our basic watch face. Try and read what each function call does. Their names should be pretty self explanatory:

```cpp
/**
* Watch face initialisation handle function
*/
void handle_init(AppContextRef ctx) {
(void)ctx;    //This is not needed. Convert to void (nothing)

//Initialise window
window_init(&window, "Window Name");
window_stack_push(&window, true);
window_set_background_color(&window, GColorBlack);

//Initialise TextLayers
text_layer_init(&timeLayer, GRect(30, 30, 150, 50));
text_layer_set_background_color(&timeLayer, GColorClear);
text_layer_set_text_color(&timeLayer, GColorWhite);
text_layer_set_font(&timeLayer,
fonts_get_system_font(FONT_KEY_BITHAM_30_BLACK));
text_layer_set_text_alignment(&timeLayer, GTextAlignmentLeft);

//Add to window
layer_add_child(&window.layer, &timeLayer.layer);

//Set initial time so display is not blank
PblTm time;
get_time(&time);
setTime(&time);
}
```

The 'tick handler' is a function called when the watch face 'ticks', either every minute or every second. For saving power and helping keep the watch asleep as much as possible, it is wise to use a minute tick handler. If you want a more active watch face, use a second tick handler. We will start with a second tick handler in our basic watch face:

```cpp
/**
* Handle function called every second
*/
void handle_second_tick(AppContextRef ctx, PebbleTickEvent *t) {
(void)ctx;

PblTm time;    //Structure to store time info
get_time(&time);    //Fill the structure with current time

int seconds = time.tm_sec;    //Get the current number of seconds

if(seconds == 0)
setTime(t->tick_time);    //Change the time on the 'zero seconds' mark
}
```

So that the system can call these handler functions, we specify them in a function called 'pbl_main'. The exact details of how this function is laid out is not covered here, but how each handler is registered is done the same way, and can be seen in other examples. Here is the 'pbl_main' function for our basic watch face:

```cpp
/**
* Main Pebble app loop
*/
void pbl_main(void *params) {
PebbleAppHandlers handlers = {
.init_handler = &handle_init,    //Register initialisation function

.tick_info = {
.tick_handler = &handle_second_tick,    //Register tick function
.tick_units = SECOND_UNIT    //Specify to call every minute
}
};
app_event_loop(params, &handlers);    //Continue from there!
}
```

This brings up an important point: The functions specified by the Pebble SDK <strong>MUST </strong>be named how they are specified in the examples and the API documentation. There is no flexibility here.

However, the handler functions can be called whatever you like (as long as they are C legal) , but when you register them you must supply the exact same name.

## Getting the time (And 24 hour compatibility)

The one thing a watch face file must do is tell the time! To do this, there is a function supplied by the Pebble SDK called 'string_format_time', which uses:

• A string you've declared to store the time as a string

• The size of the string (luckily there is a function supplied called 'sizeof'

• The format of the time you want (<a title="strftime" href="http://php.net/manual/en/function.strftime.php">According to the rules specified here</a>)

• The source of the time, which is a PblTm structure.

Here is an example here, in conjunction with another function that tells you what the user's Settings preference is, which returns type <code>bool</code> (<code>true</code> or <code>false</code>), so you can use it in the if else style with ease:

```cpp
/**
* Function to set the time and date features on the TextLayers
*/
void setTime(PblTm *t) {

//If user selects '24hr' in Settings on the watch
if(clock_is_24h_style())
string_format_time(hourText, sizeof(hourText), "%H:%M", t);
else
string_format_time(hourText, sizeof(hourText), "%I:%M", t);

//Set the TextLayer text
text_layer_set_text(&timeLayer, hourText);
}
```

## Minute ticks vs. seconds ticks

As I mentioned earlier, battery life can be saved by working with the watch's 'aggressive sleep' philosophy. By only calling the tick handler every minute, the watch can spend a good deal more of it's time asleep in a low power state. Here is how the tick handler would look after changing to a minute tick basis:

```cpp
/**
* Handle function called every minute
*/
void handle_minute_tick(AppContextRef ctx, PebbleTickEvent *t) {
(void)ctx;

PblTm time;    //Structure to store time info
get_time(&time);    //Fill the structure with current time
setTime(t->tick_time);    //Change time on 'zero seconds' mark
}
```

Notice the differences with the image previous, which showed the second tick handler. It is simpler to implement. However, with the second handler, you can open the possibility of animations happening at different point.

For example, in one of my watch faces '<a title="Split Horizon Watch Face" href="http://www.mypebblefaces.com/view?fID=3837&aName=Bonsitm&pageTitle=Split+Horizon%3A+Seconds+Edition&auID=3905">Split Horizon</a>' (shameless plug!) there is animation happening to tell the user how far thorough the minute they are with markers that slide into view showing 15, 30, 45 and 60 seconds past the minute. These are allowed through a second handler with <code>if(seconds == 15)</code> etc conditional statements.

Once again, the handle function name can be changed, so long as the name used in 'pbl_main' is kept in sync:

```cpp
/**
* Main Pebble app loop
*/
void pbl_main(void *params) {
PebbleAppHandlers handlers = {
.init_handler = &handle_init,    //Register initialisation function

.tick_info = {
.tick_handler = &handle_minute_tick,    //Register tick function
.tick_units = MINUTE_UNIT    //Specify to call every minute
}
};
app_event_loop(params, &handlers);    //Continue from there!
}
```

Notice the '.tick_units' field is different now, to reflect the new tick basis.

## Extra bits and pieces

There are a couple extra pieces each watch face file needs.

The first is the PBL_APP_INFO function call which contains information such as watch face name, author, version number, icons etc:

```cpp
//Set app info
PBL_APP_INFO(UUID, "First Watch Face", "Chris Lewis", 0, 1, DEFAULT_MENU_ICON, APP_INFO_WATCH_FACE);

//UUID, app name, author, minor version, major version,
//use default icon, tell compiler this is a face
```

The second is the Resource Map. This is a file that is like a catalogue of all the resources you used in your watch face, such as custom images and fonts. Since there are none of those things in this basic example, it can be left as the dummy file supplied with the SDK examples, and included in the link to the finished project files at the end of this post.

<b>Compiling</b><strong> and installing

Here comes the fun bit: feeding your watch face source file into the compiler and receiving the install file to upload to your watch. If you've followed Step 1 and Step 2 in the API install instructions from Part 3 on Ubuntu then you should know how to do this, but here is brief summary if you have forgotten <strong>('' should be replaced with that path)</strong>:

• Set up the new project folder to include all the requisite links to the sdk using the following Terminal commands: <code>cd ~/</code> and then <code>~//Pebble/tools/create_pebble_project.py --symlink-only ~//Pebble/sdk <newprojectfolder></code>

• Go to the new project folder with <code>cd <newprojectfolder></code>

• Configure and build with <code>./waf configure build</code>


The output file will be found in /build and has the extension '.pbw'.

On cloudpebble.net, this can all be done by selecting 'compilation' and then 'run build'.

Copy this to your Dropbox, or use the python script from the Pebble SDK (instructions in the API documentation) or any other method of navigating to it on your phone (such as copying to SD card and a file manager), and the Pebble App will do the rest!

## Conclusion

So, hopefully you'll have all the information you need to build your first Pebble watch face. Tweak the values in the example code segments to see their effect (such as layer GRect co-ordinates and GColors), or tweak some other examples from the SDK and the Web.

<a title="Source code!" href="https://www.dropbox.com/s/4b3k0cosg1u1q4k/FirstWatchFace.zip"><strong>HERE IS A LINK TO THE COMPLETE EXAMPLE PROJECT!</strong></a>

## Next time

Next section I'll show you how to use your own fonts, display bitmap images and do simple animations.

## Announcement

For the next ten days, I'll won't be able to write. I'm glad I've managed to get Parts 1 to 4 done so you can do the complete basic journey, but be assured that while I'm away I'll be making copious notes on the next Parts! I'd be very grateful if you could bear with me! If I find time I'll try and check back here and answer any questions that have arisen.

Best of luck!
