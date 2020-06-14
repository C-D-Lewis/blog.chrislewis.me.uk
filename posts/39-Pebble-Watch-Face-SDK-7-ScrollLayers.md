---
index: 39
title: Pebble Watch Face SDK #7: ScrollLayers
postDate: 2013-07-21 22:01:02
original: https://ninedof.wordpress.com/2013/07/21/pebble-watch-face-sdk-7-scrolllayers/
---

Previous Tutorial Sections

All six previous parts of this tutorial series can be found on the ‘Pebble SDK Tutorial’ page link at the top of the page. Please read them if you are not already up to speed!

## Introduction

By request, this part of the tutorial will focus on using the ScrollLayer structure provided by the Pebble SDK. This is the Layer type used for menus, such as the main menu or settings menu. In fact, the MenuLayer itself contains a ScrollLayer!

The features of a ScrollLayer are thus:


	- It can be controlled with the up and down buttons to show more content that can fit on the screen at any one time.
	- It automatically shows 'shadows' at the top and bottom of the screen to indicate there is more to see in both the up and down direction.
	- It can contain all the Layers that it scrolls, making parent-child layer management easier.


Lets get started!

## Using a ScrollLayer

To make use of this Layer type in a watch app, you will need something to display inside it. For this example, I'll be using a snippet of text from [getpebble.com](http://getpebble.com), in a char array as shown below (using the fiendishly hidden WordPress code tags!):

[code language="cpp"]
char scrollText[] = &quot;Pebble is the first watch built for the 21st century. It's infinitely customizable, with beautiful downloadable watchfaces and useful internet-connected apps. Pebble connects to iPhone and Android smartphones using Bluetooth, alerting you with a silent vibration to incoming calls, emails and messages. While designing Pebble, we strove to create a minimalist yet fashionable product that seamlessly blends into everyday life.&quot;;
[/code]

You can use other Layer types, but this is good for simplicity.

As is usual for the Pebble SDK, we call functions to initialize and setup our Window and Layers, in the <code>handle_init()</code> function. I'll show this process below, but first here are the constants and globals that will be making an appearance:

[code language="cpp"]
//Globals
Window window;
ScrollLayer sLayer;
TextLayer tLayer;

//Maximum dimensions
static int WIDTH = 144;
static int MAX_HEIGHT = 1000;

//Compensate for top window bar
static int TOP_BAR_PADDING = 20;
[/code]

And now the main code segment:

[code language="cpp"]
/**
	* Resource initialisation handle function
	*/
void handle_init(AppContextRef ctx) {
	(void)ctx;

	//Init window
	window_init(&amp;window, &quot;Main window&quot;);
	window_set_background_color(&amp;window, GColorWhite);
	
	//Init ScrollLayer and attach button click provider
	scroll_layer_init(&amp;sLayer, GRect(0, 0, 144, 168));
	scroll_layer_set_click_config_onto_window(&amp;sLayer, &amp;window);
	
	//Init TextLayer
	text_layer_init(&amp;tLayer, GRect(0, 0, WIDTH, MAX_HEIGHT));
	text_layer_set_text(&amp;tLayer, scrollText);
	text_layer_set_background_color(&amp;tLayer, GColorClear);
	text_layer_set_text_color(&amp;tLayer, GColorBlack);
	text_layer_set_text_alignment(&amp;tLayer, GTextAlignmentLeft);

	//Get size used by TextLayer
	GSize max_size = text_layer_get_max_used_size(app_get_current_graphics_context(), &amp;tLayer);
  
	//Use TextLayer size
	text_layer_set_size(&amp;tLayer, max_size);
  
	//Use TextLayer size for ScrollLayer - this has to be done manually for now!
	scroll_layer_set_content_size(&amp;sLayer, GSize(WIDTH, max_size.h + TOP_BAR_PADDING));
	
	//Add TextLayer to ScrollLayer to Window
	scroll_layer_add_child(&amp;sLayer, &amp;tLayer.layer);
	layer_add_child(&amp;window.layer, (Layer*)&amp;sLayer);

	//Show Window
	window_stack_push(&amp;window, true);
}
[/code]

Read through the code above line by line and see the new additions that you might not have seen before. Below are the ones of note:


	- <code>scroll_layer_init()</code> - This does the same sort of actions as <code>window_init()</code> or <code>text_layer_init()</code> and initializes the ScrollLayer supplied as the first argument.
	- <code>scroll_layer_set_click_config_onto_window()</code> - This gives the ScrollLayer the button click information from the containing window, so that it can respond to button pressed while in this window.
	- <code>text_layer_get_max_size_used()</code> - This returns a GSize that is the dimensions that the TextLayer that the ScrollLayer contains uses. The alternative here is to find the point size of the font and find by trial and error the vertical height from the number of lines the text ends up using - a waste of time!
	- <code>scroll_layer_set_content_size()</code> - This function uses the GSize created before to set the size of the ScrollLayer. Without this information it would not be able to tell how far to be able to scroll up or down. At the moment this must be done manually.
	- <code>scroll_layer_add_child()</code> - This function does the same as the <code>layer_add_child()</code> function we've used before for TextLayers being added to the Window, but this time the Layer supplied as an argument is added to the layout inside the ScrollLayer, and will therefore be scrollable.


Finally, after using <code>layer_add_child()</code> to add the ScrollLayer to the Window, you should be all set!

## Conclusion

The ScrollLayer can be useful for showing a lot of information or a list. It does require some extra thinking about and setup, but it is worth it for the convenience! 

Full source code for a sample watch app (derived from the 'demos' supplied with the SDK) [can be found here.](https://www.dropbox.com/s/1k9dmm5nray70wr/ScrollLayerDemo.zip)

Happy scrolling!
