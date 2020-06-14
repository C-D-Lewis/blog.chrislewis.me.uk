---
index: 31
title: Pebble Watch Face SDK Tutorial #4: Anatomy of Your First Watch Face
postDate: 2013-06-21 21:46:34
original: https://ninedof.wordpress.com/2013/06/21/pebble-watch-face-sdk-tutorial-4-anatomy-of-your-first-watch-face/
---

UPDATE: The section on setting text has been updated to reflect font name change in PebbleKit v1.12

<code></code>Links to Previous Sections:

Here are links to the previous sections of this tutorial. Read them if you haven't to get up to speed!

 [Part #1: Beginner's Primer to the C Language](http://ninedof.wordpress.com/2013/06/19/pebble-watch-face-sdk-tutorial-1-beginners-primer-to-the-c-language/)

 [Part #2: Applying the Primer to the Pebble SDK](http://ninedof.wordpress.com/2013/06/20/pebble-watch-face-sdk-tutorial-2-applying-the-primer-to-the-pebble-sdk/)

 [Part #3: Setting Up a Ubuntu Environment for Development](http://ninedof.wordpress.com/2013/06/20/pebble-watch-face-sdk-tutorial-3-setting-up-a-ubuntu-virtual-machine-for-development/)

## Introduction

This is the section you've all been waiting for, I suspect. Here, we'll examine the key functions and features of a basic watch face source file, and how it all fits together. By the end of this section, you should have assembled your very first watch face!

In summary:


	- Pre-processor statements
	- Static allocation vs. Stack allocation
	- Handler functions
	- Getting the time from the system and 24 hour compatibility
	- Minute ticks vs. seconds ticks
	- The resource map
	- Compiling and installing


Lets begin!

## Pre-processor statements

These special statements let you give instructions to the compiler. There are two types I'll mention here, <code>#include</code> and <code>#define</code>. The former tells the compiler to include extra files that contain functions, data structure types and constant values provided by the Pebble SDK. The latter lets you specify a key word to represent a value (such as a left hand margin) so you can avoid typing that number over and over again.

Another big advantage of using a <code>#define</code>ed variable is that if you use it as (for example) a margin for all features of the watch face and then decide to change that value, you can simply just change the <code>#define</code> statement and not every single instance where it is used. Neat, eh?

Here is how those statements are used for a Pebble watch face:

[code language="cpp"]
//Include files from SDK
#include &quot;pebble_os.h&quot;
#include &quot;pebble_app.h&quot;
#include &quot;pebble_fonts.h&quot;
[/code]

The #define statement is used to define the Universally Unique Identifier, a random number that uniquely defines your watch face. It is used by the Pebble OS to let you overwrite your watch face with a new version.

[code language="cpp"]

//Define Universally Unique Identifier
//    88a97cfd-2377-463a-84bd-b85eb4964063
#define UUID { 0x88, 0xa9, 0x7c, 0xfd, 0x23, 0x77, 0x46, 0x3a, 0x84, 0xbd, 0xb8, 0x5e, 0xb4, 0x96, 0x40, 0x63 }

[/code]

Each watch face MUST have a new one! Here is how you generate a new one in Ubuntu, using the 'uuidgen' command:

![](http://ninedof.files.wordpress.com/2013/06/uuidgen.png)

## Static allocation vs. Stack allocation

As you saw in Part #2, if you declare a variable or structure outside ANY function (usually at the top of the file) then it is visible to all parts of the program (it is globally accessible). Once it is declared, that memory is kept safe for later use.

The opposite of this is called 'stack allocation' and is much different. With stack allocation, you can imagine a stack of variables in memory like a stack of cards. When you call a function, any declarations you put in there are added to the top of the stack of memory. When the function returns or exits, these variables are freed up to make more memory available, as it is assumed they are only needed for that function. The variable is declared 'locally'.

So, if you know you want to keep data for later, declare it globally. If you only need it for a single calculation, declare it locally!

For our watch face, we declare the watch face features globally, as well as memory for the string containing the current time (more on how we get that later):

[code language="cpp"]

//Declare structures for watch face elements
Window window;
TextLayer timeLayer;

//Declare variable for storing time string
static char hourText[] = &quot;00:00&quot;;

[/code]

## Handler functions

In a Pebble watch face, there are certain functions that aren't called by the programmer (you), but by the system. An example is a function called every time a second ticks by. You can't know when this is, but the system does (it's a watch, after all!). What you can do as the programmer is specify what happens in this function, and leave the actual calling of it to the system. It 'handles' that scenario for you.

There are many different 'handler' functions, but the two main ones I'll introduce here are the 'init handler' and the 'tick handler'. There are also handlers for buttons, 2-way communication events and animation etc.

The 'init handler' is called as soon as you switch to your watch face. Any initialisation of watch face features and structures is placed in here, so it is all done for you in one go when you open the watch face.

Here is the 'init handler' for our basic watch face. Try and read what each function call does. Their names should be pretty self explanatory:

[code language="cpp"]

/**
* Watch face initialisation handle function
*/
void handle_init(AppContextRef ctx) {
(void)ctx;    //This is not needed. Convert to void (nothing)

//Initialise window
window_init(&amp;window, &quot;Window Name&quot;);
window_stack_push(&amp;window, true);
window_set_background_color(&amp;window, GColorBlack);

//Initialise TextLayers
text_layer_init(&amp;timeLayer, GRect(30, 30, 150, 50));
text_layer_set_background_color(&amp;timeLayer, GColorClear);
text_layer_set_text_color(&amp;timeLayer, GColorWhite);
text_layer_set_font(&amp;timeLayer,
fonts_get_system_font(FONT_KEY_BITHAM_30_BLACK));
text_layer_set_text_alignment(&amp;timeLayer, GTextAlignmentLeft);

//Add to window
layer_add_child(&amp;window.layer, &amp;timeLayer.layer);

//Set initial time so display isn't blank
PblTm time;
get_time(&amp;time);
setTime(&amp;time);
}

[/code]

The 'tick handler' is a function called when the watch face 'ticks', either every minute or every second. For saving power and helping keep the watch asleep as much as possible, it is wise to use a minute tick handler. If you want a more active watch face, use a second tick handler. We will start with a second tick handler in our basic watch face:

[code language="cpp"]

/**
* Handle function called every second
*/
void handle_second_tick(AppContextRef ctx, PebbleTickEvent *t) {
(void)ctx;

PblTm time;    //Structure to store time info
get_time(&amp;time);    //Fill the structure with current time

int seconds = time.tm_sec;    //Get the current number of seconds

if(seconds == 0)
setTime(t-&gt;tick_time);    //Change the time on the 'zero seconds' mark
}

[/code]

So that the system can call these handler functions, we specify them in a function called 'pbl_main'. The exact details of how this function is laid out is not covered here, but how each handler is registered is done the same way, and can be seen in other examples. Here is the 'pbl_main' function for our basic watch face:

[code language="cpp"]

/**
* Main Pebble app loop
*/
void pbl_main(void *params) {
PebbleAppHandlers handlers = {
.init_handler = &amp;handle_init,    //Register initialisation function

.tick_info = {
.tick_handler = &amp;handle_second_tick,    //Register tick function
.tick_units = SECOND_UNIT    //Specify to call every minute
}
};
app_event_loop(params, &amp;handlers);    //Continue from there!
}

[/code]

This brings up an important point: The functions specified by the Pebble SDK MUST be named how they are specified in the examples and the API documentation. There is no flexibility here.

However, the handler functions can be called whatever you like (as long as they are C legal) , but when you register them you must supply the exact same name.

## Getting the time (And 24 hour compatibility)

The one thing a watch face file must do is tell the time! To do this, there is a function supplied by the Pebble SDK called 'string_format_time', which uses:


	- A string you've declared to store the time as a string
	- The size of the string (luckily there is a function supplied called 'sizeof'
	- The format of the time you want ( [According to the rules specified here](http://php.net/manual/en/function.strftime.php))
	- The source of the time, which is a PblTm structure.


Here is an example here, in conjunction with another function that tells you what the user's Settings preference is, which returns type <code>bool</code> (<code>true</code> or <code>false</code>), so you can use it in the if else style with ease:

[code language="cpp"]

/**
* Function to set the time and date features on the TextLayers
*/
void setTime(PblTm *t) {

//If user selects '24hr' in Settings on the watch
if(clock_is_24h_style())
string_format_time(hourText, sizeof(hourText), &quot;%H:%M&quot;, t);
else
string_format_time(hourText, sizeof(hourText), &quot;%I:%M&quot;, t);

//Set the TextLayer text
text_layer_set_text(&amp;timeLayer, hourText);
}

[/code]

## Minute ticks vs. seconds ticks

As I mentioned earlier, battery life can be saved by working with the watch's 'aggressive sleep' philosophy. By only calling the tick handler every minute, the watch can spend a good deal more of it's time asleep in a low power state. Here is how the tick handler would look after changing to a minute tick basis:

[code language="cpp"]

/**
* Handle function called every minute
*/
void handle_minute_tick(AppContextRef ctx, PebbleTickEvent *t) {
(void)ctx;

PblTm time;    //Structure to store time info
get_time(&amp;time);    //Fill the structure with current time
setTime(t-&gt;tick_time);    //Change time on 'zero seconds' mark
}

[/code]

Notice the differences with the image previous, which showed the second tick handler. It is simpler to implement. However, with the second handler, you can open the possibility of animations happening at different point.

For example, in one of my watch faces ' [Split Horizon](http://www.mypebblefaces.com/view?fID=3837&amp;aName=Bonsitm&amp;pageTitle=Split+Horizon%3A+Seconds+Edition&amp;auID=3905)' (shameless plug!) there is animation happening to tell the user how far thorough the minute they are with markers that slide into view showing 15, 30, 45 and 60 seconds past the minute. These are allowed through a second handler with <code>if(seconds == 15)</code> etc conditional statements.

Once again, the handle function name can be changed, so long as the name used in 'pbl_main' is kept in sync:

[code language="cpp"]

/**
* Main Pebble app loop
*/
void pbl_main(void *params) {
PebbleAppHandlers handlers = {
.init_handler = &amp;handle_init,    //Register initialisation function

.tick_info = {
.tick_handler = &amp;handle_minute_tick,    //Register tick function
.tick_units = MINUTE_UNIT    //Specify to call every minute
}
};
app_event_loop(params, &amp;handlers);    //Continue from there!
}

[/code]

Notice the '.tick_units' field is different now, to reflect the new tick basis.

## Extra bits and pieces

There are a couple extra pieces each watch face file needs.

The first is the PBL_APP_INFO function call which contains information such as watch face name, author, version number, icons etc:

[code language="cpp"]

//Set app info
PBL_APP_INFO(UUID, &quot;First Watch Face&quot;, &quot;Chris Lewis&quot;, 0, 1, DEFAULT_MENU_ICON, APP_INFO_WATCH_FACE);

//UUID, app name, author, minor version, major version,
//use default icon, tell compiler this is a face

[/code]

The second is the Resource Map. This is a file that is like a catalogue of all the resources you used in your watch face, such as custom images and fonts. Since there are none of those things in this basic example, it can be left as the dummy file supplied with the SDK examples, and included in the link to the finished project files at the end of this post.

<b>Compiling</b> and installing

Here comes the fun bit: feeding your watch face source file into the compiler and receiving the install file to upload to your watch. If you've followed Step 1 and Step 2 in the API install instructions from Part 3 on Ubuntu then you should know how to do this, but here is brief summary if you have forgotten ('&lt;path to PebbleKit&gt;' should be replaced with that path):
<ol>
	- Set up the new project folder to include all the requisite links to the sdk using the following Terminal commands: <code>cd ~/&lt;path to the folder above your project folder&gt;</code> and then <code>~/&lt;path to PebbleKit&gt;/Pebble/tools/create_pebble_project.py --symlink-only ~/&lt;path to PebbleKit&gt;/Pebble/sdk &lt;newprojectfolder&gt;</code>
	- Go to the new project folder with <code>cd &lt;newprojectfolder&gt;</code>
	- Configure and build with <code>./waf configure build</code>
</ol>
The output file will be found in &lt;project folder&gt;/build and has the extension '.pbw'.

On cloudpebble.net, this can all be done by selecting 'compilation' and then 'run build'.

Copy this to your Dropbox, or use the python script from the Pebble SDK (instructions in the API documentation) or any other method of navigating to it on your phone (such as copying to SD card and a file manager), and the Pebble App will do the rest!

## Conclusion

So, hopefully you'll have all the information you need to build your first Pebble watch face. Tweak the values in the example code segments to see their effect (such as layer GRect co-ordinates and GColors), or tweak some other examples from the SDK and the Web.

 [HERE IS A LINK TO THE COMPLETE EXAMPLE PROJECT!](https://www.dropbox.com/s/4b3k0cosg1u1q4k/FirstWatchFace.zip)

## Next time

Next section I'll show you how to use your own fonts, display bitmap images and do simple animations.

## Announcement

For the next ten days, I'll won't be able to write. I'm glad I've managed to get Parts 1 to 4 done so you can do the complete basic journey, but be assured that while I'm away I'll be making copious notes on the next Parts! I'd be very grateful if you could bear with me! If I find time I'll try and check back here and answer any questions that have arisen.

Best of luck!
