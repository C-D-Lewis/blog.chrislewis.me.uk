---
id: 1390
title: Pebble SDK 2.0 Tutorial #3: Images and Fonts
postDate: 2013-12-22 15:12:22
original: https://ninedof.wordpress.com/2013/12/22/pebble-sdk-2-0-tutorial-3-images-and-fonts/
---

Required Reading

 [Pebble SDK 2.0 Tutorial #1: Your First Watchapp](http://ninedof.wordpress.com/2013/12/02/pebble-sdk-2-0-tutorial-1-your-first-watchapp/)

 [Pebble SDK 2.0 Tutorial #2: Telling the Time](http://ninedof.wordpress.com/2013/12/18/pebble-sdk-2-0-tutorial-2-telling-the-time/)

## Introduction

So now you've learned how to create a watchface and spice it up a bit with a well placed <code>InverterLayer</code>. But it's still pretty dull. A much better way to improve it is to use your own images and fonts. That's what this section will focus on.

In a Pebble watch app or watchface, images and fonts are referred to in the app's <code>appinfo.json</code> file, which is managed automatically for you by CloudPebble, and so will not be covered in great detail right now. Of much more importance to you now is that in the C code file, images are stored in <code>GBitmap</code> structures and fonts in <code>GFont</code> structures. Just like all the <code>Layer</code> types, they are created and allocated memory dynamically, with the function names syntactically very similar, so you will hopefully find yourself looking them up in the  [API Documentation](https://developer.getpebble.com/2/api-reference/) a lot less.

## Making a Better First Impression

You have probably noticed that all your favorite watchapps have their own icon in the Pebble system menu, and so the first thing we're going to do is add one to our tutorial face we've been building up over the last couple of sections. Once again, create a new project over at CloudPebble and add a <code>main.c</code> file containing the finished code from the last tutorial section.

Next, select 'Add new' from the 'Resources' menu on the left, leave the type as PNG and browse for a file of 8-bit 2-colour PNG format with a size of 24x28 pixels. Below is one you can use for now:

![](http://ninedof.files.wordpress.com/2013/12/menu_icon.png)Give it an identifier, such as 'MENU_ICON' and click 'Save'. Next, go to 'Settings' and choose the file you just added from the 'Menu image' dropdown menu.  Then click 'Save changes'.

## Making the Watchface More Appealing

Let's add some more artistic direction to our watch face. At the moment, it probably looks like this:

![](http://ninedof.files.wordpress.com/2013/12/pebble-screenshot_2013-12-22_13-59-31.png)Not very appealing. Let's use images to add detail to the <code>InverterLayer</code>. Below are two samples I created that we can use to do just that:

![](http://ninedof.files.wordpress.com/2013/12/future1.png) ![](http://ninedof.files.wordpress.com/2013/12/past1.png?w=144) As with the menu icon, the first step is to add both images as Resources in CloudPebble and give them appropriate identifiers, such as <code>FUTURE</code> and <code>PAST</code> respectively. Next, go back to the C source file and declare two global pointers of type <code>GBitmap</code> and two of type <code>BitmapLayer</code>, like so:

[code language="cpp"]
GBitmap *future_bitmap, *past_bitmap;
BitmapLayer *future_layer, *past_layer;
[/code]

The <code>GBitmap</code>s will contain the image data, and the <code>BitmapLayer</code>s will present the images to the user as a <code>Layer</code>. So, in <code>window_load()</code>, add the appropriate function calls to create these elements. Here is how it is done. Try and understand what each line does, using your previous knowledge of the <code>TextLayer</code> and <code>InverterLayer</code>:

[code language="cpp"]
//Load bitmaps into GBitmap structures
//The ID you chose when uploading is prefixed with 'RESOURCE_ID_'
future_bitmap = gbitmap_create_with_resource(RESOURCE_ID_FUTURE);
past_bitmap = gbitmap_create_with_resource(RESOURCE_ID_PAST);

//Create BitmapLayers to show GBitmaps and add to Window
//Sample images are 144 x 50 pixels
future_layer = bitmap_layer_create(GRect(0, 0, 144, 50));
bitmap_layer_set_bitmap(future_layer, future_bitmap);
layer_add_child(window_get_root_layer(window), bitmap_layer_get_layer(future_layer));

past_layer = bitmap_layer_create(GRect(0, 112, 144, 50));
bitmap_layer_set_bitmap(past_layer, past_bitmap);
layer_add_child(window_get_root_layer(window), bitmap_layer_get_layer(past_layer));
[/code]

Once again, we need to add the de-init code to free up the memory again:

[code language="cpp"]
//Destroy GBitmaps
gbitmap_destroy(future_bitmap);
gbitmap_destroy(past_bitmap);

//Destroy BitmapLayers
bitmap_layer_destroy(future_layer);
bitmap_layer_destroy(past_layer);
[/code]

Are you beginning to spot patterns in how the API function calls are named? This way once you've worked with a new layer it is easier to guess correctly what to call for newer elements and reducing your dependence on the API documentation. Once all this has been done, your watchface should look like this:
![](http://ninedof.files.wordpress.com/2013/12/pebble-screenshot_2013-12-22_14-43-19.png)

## Custom Fonts

Another good way to add your own influence to your watchface is to use a custom font. The procedure for doing so it almost identical to that for images, so let's do it now.

First, again, add the font as a Resource in CloudPebble. This time set the format to 'TrueType font'. The font you choose will need to the a '.ttf' font file.  [Here's a sample for you to use now](https://www.dropbox.com/s/ugxuv4tbugmvldd/imagine.zip). Once you have browsed for the file, give it an identifier such as <code>IMAGINE_42</code>. The number after the name tells the SDK what font size you want. The rest of the settings can be left alone for now, so click 'Save' and go back to the C file.

The process for using the font in the watchface is <em>almost</em> the same as that for the images. First, load the resource into a <code>ResHandle</code> (Handle on the Resource, so to speak) structure BEFORE the TextLayer is created (We will be using it for the time display itself):

[code language="cpp"]
//Load font
ResHandle font_handle = resource_get_handle(RESOURCE_ID_IMAGINE_42);
[/code]

Now, modify the call to <code>text_layer_set_font()</code> to use our custom font and a slight layout modification to the text position by modifying the <code>GRect</code> to have a width of 144 pixels, like so:

[code language="cpp"]
text_layer = text_layer_create(GRect(0, 53, 144, 168));

...

text_layer_set_font(text_layer, fonts_load_custom_font(font_handle));
[/code]

After compilation, the watchface should finally look like so:
![](http://ninedof.files.wordpress.com/2013/12/pebble-screenshot_2013-12-22_15-00-53.png)

Much better!

## Conclusion

So there you have using custom images and fonts. If you want, add some more or change the existing ones (being careful with the dimensions in the code!) to see for yourself what small modifications can do to the look an feel.

Next time: Animations: Tweens and Timers.

The full source code the the end result of this part of the tutorial can be found  [on GitHub](https://github.com/C-D-Lewis/pebble-sdk2-tut-3).
