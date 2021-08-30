Pebble SDK 2.0 Tutorial #1: Your First Watchapp
2013-12-02 20:50:48
Pebble
---

<strong>Introduction

After the Pebble SDK update to version 2.0, the time has come to write a new version of my tutorial series for this new SDK.

If you are not familiar with the following basic C concepts, please read <a title="Pebble Watch Face SDK Tutorial #1: Beginner’s Primer to the C Language" href="http://ninedof.wordpress.com/2013/06/19/pebble-watch-face-sdk-tutorial-1-beginners-primer-to-the-c-language/">Part 1 of the 1.X tutorial</a>, which is just as appropriate now:

• Variables and variable scope (local or global?)

• Functions (definitions and use)

• Structures

• Pointers

• Program flow (if, else etc.)

• Pre-processor statements (<code>#define</code>, <code>#include</code> etc)


Up to speed? Good! Let's make our first SDK 2.0 watchapp. This time the tutorial will take a more practical approach, with each section finishing with a compilable project showing off the things learned therein.

## Development Environment

In order to write and compile watchfaces there are two main options for Windows users:

• Use <a title="cloudpebble" href="http://cloudpebble.net">Cloud Pebble</a>.

• <a title="Pebble Windows install instructions" href="https://developer.getpebble.com/2/getting-started/linux/">Install Ubuntu on a virtual machine</a>.


Choose whichever works for you. However, since the first draft of this tutorial section, CloudPebble now allows you to install, take screenshots and see logs from Pebble apps from the Compilation page, so for the purposes of a more simple start I'll be writing this tutorial from the Cloud Pebble perspective.

## First Steps

To get started, log into Cloud Pebble and choose 'Create Project'.

• Enter a suitable name such as 'Tutorial Part 1'.

• Choose 'Pebble C SDK'.

• Set the template to 'Empty Project'

• Confirm with 'Create'.


Next, click 'New C file' and enter a name. I'd recommend 'main.c'. This file will contain the C code that makes up the watchface we're creating.

## Setting up the Basics

In order to use (or 'include') all the Pebble SDK goodness already created for our use, start the file with this line:

<!-- language="cpp" -->
<pre><div class="code-block">
#include 
</div></pre>

All C programs begin at the start of the 'main' function (void means no arguments). From there we call <code>init()</code> (initialize) to set up our app, <code>app_event_loop()</code> to wait for events such as ticks, buttons presses etc. Finally when the watchface is closed Pebble calls <code>deinit()</code> (de-initialize) to free up all the memory we've used.

<!-- language="cpp" -->
<pre><div class="code-block">
int main(void)
{
  init();
  app_event_loop();
  deinit();
}
</div></pre>

In C all functions must be defined in full (behaviourally) or by prototype (just the signature, such as <code>void init();</code>) before their first call in a file. To meet this requirement and maintain simplicity for now, enter the next code segment ABOVE <code>main()</code>. This will be where we initialize all our app elements:

<!-- language="cpp" -->
<pre><div class="code-block">
void init()
{
  //Initialize the app elements here!
}

void deinit()
{
  //De-initialize elements here to save memory!
}
</div></pre>

Done that? Let's add our first app element: the <code>Window</code>. In the previous 1.X SDK, these structures were declared globally and referred to elsewhere using pointers. Since then, the 2.0 SDK has moved to declaring a pointer, and then dynamically allocating memory for the element when they are created. This is much better from a memory management point of view.

Right at the top of the file, but UNDER the <code>#include</code> directive, add the pointer for the <code>Window</code> element. To keep it simple, we'll just call it 'window':

<!-- language="cpp" -->
<pre><div class="code-block">
Window *window;
</div></pre>

At the moment, this 'window' pointer does nothing. The next step is to call the function to make this pointer point to a full fleshed out <code>Window</code>. Back inside <code>init()</code> add the following lines to create the <code>Window</code> element. For clarity, this one time I'll re-write the whole <code>init()</code> function with the new code inserted:

<!-- language="cpp" -->
<pre><div class="code-block">
void init()
{
  //Initialize the app elements here!
  window = window_create();
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
}
</div></pre>

You may be wondering what all this 'window handlers' business is about. When you open the main Pebble watch menu from any watch face, the screen that slides into view containing 'Music, Set Alarm, Watchfaces etc.' is a <code>Window</code>! It contains an element called a <code>MenuLayer</code>, but we will cover that type of element later. When a <code>Window</code> is created and filled with elements, those elements need to be created fully before they can be shown. These will be done in two 'handler' (in that they handle, or take care of a certain event) functions.

The two we will use to display something in our <code>Window</code> will be called <code>window_load()</code> and <code>window_unload()</code> respectively. It doesn't require too much thought to realize what events they will handle! We will define them in a moment, but for now they are assigned by name to the <code>.load</code> and <code>.unload</code> members of the <code>WindowHandlers</code> type set to our <code>Window</code> for when it is loaded and unloaded.

Here are the basic starter definitions; once again they MUST be placed before their first calls in the file, so place them above <code>init()</code> but below the <code>#include</code> directive and global <code>Window</code> pointer declaration. If you did all that correctly, your c source file should look like this:

<!-- language="cpp" -->
<pre><div class="code-block">
#include 

Window *window;

void window_load(Window *window)
{
  //We will add the creation of the Window elements here soon!
}

void window_unload(Window *window)
{
  //We will safely destroy the Window elements here!
}

void init()
{
  //Initialize the app elements here!
  window = window_create();
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
}

void deinit()
{
  //De-initialize elements here to save memory!
}

int main(void)
{
  init();
  app_event_loop();
  deinit();
}
</div></pre>

If you haven't arrived at this result so far, go back to the bits that differ and see how they ended up where they are.

The next step as a responsible app developer is to make sure we de-initialize anything we initialize so that the net memory we use after the app is quit is zero. To do this for the only element we have so far (a <code>Window</code>), add the following line so your <code>deinit()</code> function looks like this:

<!-- language="cpp" -->
<pre><div class="code-block">
void deinit()
{
  //We will safely destroy the Window elements here!
  window_destroy(window);
}
</div></pre>

The final basic step is to actually make the app 'appear' when it is chosen from the watch menu. To do this, we call the <code>window_stack_push()</code> function, which 'pushes' our <code>Window</code> into the top of the stack, and so appearing on top and in the foreground. Add this line to the END of your <code>init()</code> function like so:

<!-- language="cpp" -->
<pre><div class="code-block">
  window_stack_push(window, true);
</div></pre>

This will make the window slide into view (denoted by the <code>true</code> argument), but it will be completely blank! Let's rectify that.

## Making the App Do Something

What we've done so far is to initialize an empty <code>Window</code>. Now let's add the first sub-element to make it show some output. Introducing the <code>TextLayer</code>! This is an element used to show any standard string of characters into a pre-defined area. As with any element, we first need a global pointer. Add this under the <code>Window</code> pointer near the top of the file like so:

<!-- language="cpp" -->
<pre><div class="code-block">
TextLayer *text_layer;
</div></pre>

The next step is to allocate the memory for the underlying structure. This is done in the <code>window_load()</code> function. Here are the basic functions to call when setting up a <code>TextLayer</code>. I'll summarize them afterwards:

<!-- language="cpp" -->
<pre><div class="code-block">
  text_layer = text_layer_create(GRect(0, 0, 144, 168));
  text_layer_set_background_color(text_layer, GColorClear);
  text_layer_set_text_color(text_layer, GColorBlack);

  layer_add_child(window_get_root_layer(window), text_layer_get_layer(text_layer));
</div></pre>

The first line calls the function to fully create the <code>TextLayer</code> structure with a frame size of 144 x 168 (stored in a <code>GRect</code>, or rectangle structure), origin at (0, 0), then assigns the location of the resulting memory to the text_layer pointer. The second line sets the layer's background colour using the supplied pointer and <code><a title="GColor specification" href="https://developer.getpebble.com/2/api-reference/group___graphics_types.html#gaafde3cb660d99f7fe83e40c86e67b6c4">GColor</a></code> type. Finally the third line sets the text colour itself, in a similar manner to the second line. The fourth line adds the <code>TextLayer</code> to the Window as a child (shown in front).

After this, remember to add the corresponding de-initialization code to free up the memory we used in <code>window_unload()</code> but BEFORE <code>window_destroy()</code> (the elements that belong to a <code>Window</code> should be removed before the <code>Window</code> itself):

<!-- language="cpp" -->
<pre><div class="code-block">
text_layer_destroy(text_layer);
</div></pre>

Now the best bit! We make the watch app tell us whatever we want. Go back to the line after <code>layer_add_child()</code> and add the next line. You can set the quoted text argument to whatever you want:

<!-- language="cpp" -->
<pre><div class="code-block">
  text_layer_set_text(text_layer, "Anything you want, as long as it is in quotes!");
</div></pre>

Now we should be ready to see the fruits of our labour!

## Compilation and Installation

Make sure you hit 'Save', then click 'Settings' on the left. Here you can set all kinds of app-related settings, but for now just give your own values to 'Short App Name' and 'Company Name'. Hit 'Save Changes'. Next, go to 'Compilation' and hit 'Run Build'. You should be greeted with 'Successful' next to 'Status'. If not, go back and compare your code to the segments above, or check out the example download at the end of the post.

Enter your phone's IP address and click 'install and run' after enabling <a title="Developer Connection" href="https://developer.getpebble.com/2/getting-started/developer-connection/">Pebble Developer Connection</a> or download the .pbw file, then open the resulting file on your phone. After the Pebble app has done it's work, you should be able to see your text on the watch! Exciting!

## Conclusions

So there you have it, a very simple watch app to show some text. Next time we'll flesh it out a bit more and make it do something really useful, like showing the time!

You can find the example project that you should end up with after this tutorial section <a title="Source" href="https://github.com/C-D-Lewis/pebble-sdk2-tut-1">on GitHub</a>.

As always let me know if you have any questions or suggestions and stay tuned for the next section!
