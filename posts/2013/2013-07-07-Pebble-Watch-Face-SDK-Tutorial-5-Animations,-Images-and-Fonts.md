Pebble Watch Face SDK Tutorial #5: Animations, Images and Fonts
2013-07-07 13:29:34
Pebble
---

<strong>Links to Previous Sections:

Here are links to the previous sections of this tutorial. Read them if you haven’t to get up to speed!

<a title="Pebble Watch Face SDK Tutorial #1: Beginner’s Primer to the C Language" href="http://ninedof.wordpress.com/2013/06/19/pebble-watch-face-sdk-tutorial-1-beginners-primer-to-the-c-language/">Part #1: Beginner’s Primer to the C Language</a>

<a title="Pebble Watch Face SDK Tutorial #2: Applying the Primer to the Pebble SDK" href="http://ninedof.wordpress.com/2013/06/20/pebble-watch-face-sdk-tutorial-2-applying-the-primer-to-the-pebble-sdk/">Part #2: Applying the Primer to the Pebble SDK</a>

<a title="Pebble Watch Face SDK Tutorial #3: Setting up a Ubuntu Virtual Machine for Development" href="http://ninedof.wordpress.com/2013/06/20/pebble-watch-face-sdk-tutorial-3-setting-up-a-ubuntu-virtual-machine-for-development/">Part #3: Setting Up a Ubuntu Environment for Development</a>

<a title="Part 4" href="http://ninedof.wordpress.com/2013/06/21/pebble-watch-face-sdk-tutorial-4-anatomy-of-your-first-watch-face/">Part #4: Anatomy of your First Watch Face</a>

## Introduction

In this section we will be looking at some more advanced features of the Pebble SDK you can apply to your watch faces. These are animations, images and fonts.

Animations allow you to create smooth movement of Layers on screen. Images can  enhance the look and feel of your watch face but come with a few constraints. Fonts offer the easiest real customisation of the text elements of the watch face, most importantly those that tell the time!

As each new feature type is introduced, I'll explain the conditions and limitations, the functions used to implement the them as well as sample functions I've written as 'wrappers' to the lines of code you may find yourself writing together over and over again, to make things simpler.

## The Resource Map

First, a key part of any watch face that uses outside resources such as bitmap images and fonts is the Resource Map file. This is a JSON file that tells the compiler where all the resources you have used in your watch face are, so it can include them in the install package.

Whereas your source file lives in <code>/src/</code>, the resource map lives in <code>/resources/src/</code>. The resources themselves are easiest located along side, for example, an image might go in <code>/resources/src/images/</code> and a font in <code>/resources/src/fonts/</code>.

The exact syntax of each resource referenced in this file <a title="JSON syntax" href="http://www.w3schools.com/json/json_syntax.asp">can be found here</a>, but the form is easy to copy or mimic for each new resource you add, with a couple of example below:

![](/assets/import/media/2013/07/json-example.png)

Don't worry if you can't make complete sense of straight away!

In the source file side of things, you must initialise the resources you plan to use in the 'handle_init' function before you can use them. This is shown below:

![](/assets/import/media/2013/07/resource-init.png)

Make sure the APP_RESOURCES name matches that in the versionDefName in the JSON file itself.

This function call allows you to use the resources as named in the JSON file when functions ask you for the RESOURCE_ID.

## Animations

Animations allow a static watch face to come alive and become more expressive. An example of an implementation of these can be found in my <a title="Split Horizon" href="http://www.mypebblefaces.com/view?fID=3837&aName=Bonsitm&pageTitle=Split+Horizon%3A+Seconds+Edition&auID=3905">Split Horizon: Seconds Edition</a> watch face. Blocks slide in from the top to mark the 15, 30, 45 and 60 second marks, and two half-screen-sized InverterLayers come in and out again to reveal the new time when the minute ticks over.

To do all this, you need to use a structure called PropertyAnimation. When using this to animate a Layer of your choice, you must do a number of steps in a certain order.

• First, initalise the PropertyAnimation with the PropertyAnimation structure, the Layer to be moved and start and end locations (GRects)

• Set the duration of the animation (in milliseconds) and the curve type (Easing in or out for example)

• Schedule the animation. As soon as this is called, the animation will start pretty much instantaneously.


As promised earlier, here is a function that neatly wraps up all this into one function call you can use to make the main function easier to read (Click the image to see it better):

![](/assets/import/media/2013/07/animatelayer.png?w=545)

An extra stage you can take to make the animations more complex is to use the delay feature. With a second tick handler, the fastest you can have animations start is on each second tick. But with the delay feature, you can add, say, a 500 ms delay and have one animation start half a second after the first. Here is another wrapper function, see if you can spot the difference:

![](/assets/import/media/2013/07/animatelayerlater.png?w=545)

The final note on this is that at the moment the PropertyAnimation can only animate properties of a Layer. There are details in the API documentation the show you how to implement an animation for pretty much anything, but it is beyond the scope of this tutorial series.

## Images (Bitmaps)

Another way to add detail to your watch  face is to include some images. Some traditional watch faces use a bitmap background with hands or text time drawn on top for added effect.

The recommended format of images to be used is a 2-colour (black and white in other words) '.png' file that is less than the size of the screen (common sense, to save space). Here is an example image:

![](/assets/import/media/2013/07/bnw-png-12.png)

Due to the black and white nature of these images, shades of gray are impossible. The next best thing however is to use a technique known as 'dithering', which alternates black and white pixels to emulate a shade of gray from a distance.

![](/assets/import/media/2013/07/bnw-png-2.png)

![](/assets/import/media/2013/07/bnw-png-3.png)

Getting the balance right with dithering is all trial and error, but I find that 60% or 80% is a good value, depending on the nature of the image.

Now that you have your image, place it in the right directory. You can choose this but the path must be mentioned relative to the project root folder (The folder containing the <code>/src/</code> and <code>/resources/</code> directories). Once this is done, add a reference to it in the JSON file, with a memorable name. An example is below:

![](/assets/import/media/2013/07/png-def.png)

The 'type' is the file type. The 'defName' is the name you will use in the source file. The 'file' is the path of the resource file relative to the JSON file.

The next step is to make sure you are initialising the Resources in your main source file, as shown in the 'The Resource Map' section above.

Finally, call the requisite functions from the API documentation to initialise and place your image on the watch face. Again, here is an annotated wrapper function as an example:

![](/assets/import/media/2013/07/setimage.png?w=545)

## Fonts

Finally we come to fonts. These are slightly easier to use than bitmaps, but still require the proper declaration in the JSON, initialising app resources etc.

A font file to be used on a watch face should be a '.ttf' TrueType font. Many are available for free from sites on the web. Once you have one you like (You can install it and test it out in Word or the system font viewer), place it in the correct folder. Again, you can choose this, but it must be written precisely in the JSON declaration. Here is an example:

![](/assets/import/media/2013/07/def-font.png)

It is important to note that the point size of the font to be used is declared using the '_XX' at the end of  the defName in the JSON file. See the example image above for just that (This will be font size 30). Therefore you can have almost as many font sizes as you like from just <strong>one </strong>font file. You do not need to include multiple copies of the same '.ttf' file for each size font you want to use.

Once this is done, and the app resources have been initialised as mentioned in the last two sections, you can use it as a font in a TextLayer of your choosing in the watch face source file. Here is how that is done (This is another long one, click it to see it clearly):

![](/assets/import/media/2013/07/setfont.png?w=545)

## Conclusion

So there you have animations, images and fonts. Go wild. But not too wild, because there are file size limits on the install packages ('.pbw' files), although I've yet to hit them in normal use.

## Next Time

In the next part I will be detailing how to perform simple communications with a connected Android app. I'm afraid that due to available devices and iOS costs, Android will be the only perspective offered. Sorry!<strong>

## If you are unfamiliar with Java and/or Android app development, speak up either here or on my <a title="General Discussion thread" href="http://forums.getpebble.com/discussion/6054/who-wants-a-pebble-watch-face-tutorial-parts-1-to-4-released">General Discussion</a> thread and I will fill in the gap with a Java and Android Primer!</strong>
