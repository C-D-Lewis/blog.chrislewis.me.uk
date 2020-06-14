---
id: 527
title: Pebble Watch Face SDK Tutorial #2: Applying the Primer to the Pebble SDK
postDate: 2013-06-20 12:46:37
original: https://ninedof.wordpress.com/2013/06/20/pebble-watch-face-sdk-tutorial-2-applying-the-primer-to-the-pebble-sdk/
---

Introduction:

The aim of this second section of the tutorial series is to show examples of how the primer theory from the last section appears in the real world application we're all looking at - the PebbleKit SDK. But first there is one more data storage convention in C we need to look at. But before that, a quick recap.

## Recap:


	- A watch face file is a C file (*.c) and is compiled by the compilers supplied with the Pebble SDK.
	- Statements (or lines of code) are executed one after another, except where diverted by program flow statements such as <code>if</code> and <code>else</code>.
	- Variables are where data is stored. Examples are types such as integers, strings and floating points.
	- Functions perform repeated tasks on data supplied as the arguments. Sometimes the resulting values are returned, and used in assignments.


If any of these things are completely foreign to you, please  [go back](http://ninedof.wordpress.com/2013/06/19/pebble-watch-face-sdk-tutorial-1-beginners-primer-to-the-c-language/) and read the last section!

## Structures

In C, structures are a data type similar to <code>int</code> or <code>float</code>, but contain many different values and can be created for a specific purpose by the user or in this case the SDK developers. You can think of them as a collection of variables that come under one heading, or an Object, if you're coming from an Object Oriented Programming background.

![](http://ninedof.files.wordpress.com/2013/06/image-12.png)

The individual variables inside the structure can be accessed individually but are all declared at the same time by a single structure declaration. Let's make this a little clearer with an example. Suppose we used a structure to define the aspects of a car.

![](http://ninedof.files.wordpress.com/2013/06/image-23.png)

The reason that structures are included here are that they are especially important in relation to the Pebble SDK, and so form our first real examples. Luckily we don't have to access the individual variables inside a structure very often.

The final point on structures is that the key word <code>typedef</code> can be used to define your structure as it's own data type, and so avoid having to type <code>struct</code> before any declaration. Here's an example:

![](http://ninedof.files.wordpress.com/2013/06/image-2-5.png)

## More Common Types To Know

In developing a watch face, there are a few more types of data constants to know (these are used as easy ways of specifying aspects of the watch face). The first example is the <code>GColor</code> (Graphics Color). These are defined in order to be used to set the colours of parts of Layers. Their  [listing in the API documentation](http://developer.getpebble.com/sdkref/group___graphics_types.html#gaafde3cb660d99f7fe83e40c86e67b6c4) lets you know which ones are available. You'll see how they fit in when we start to use them later.

Another common type you'll be using a lot is the <code>GRect</code>. This allows you to specify the dimensions of a rectangle for use in setting Layer frames, or starting and finishing positions for animations etc. It is crucial to enabling you to set where items appear on the watch face and how big they are.

Here are two real examples of these types in use:

![](http://ninedof.files.wordpress.com/2013/06/image-2-6.png)

If you see the  [API documentation for <code>GRect</code>](http://developer.getpebble.com/sdkref/group___graphics_types.html#struct_g_rect), it is actually a structure consisting of a <code>GPoint</code> for the origin and a <code>GSize</code> for the width and height. I hope you can guess what those two new ones do!

## Structures in the PebbleSDK

A large number of structures are used in the SDK to represent various elements that go into a watch face or app. An example is the Layer structure. The variables stored inside this structure are items such as it's geometry and the Window it is situated in. In the SDK reference material it  [looks like this](http://developer.getpebble.com/sdkref/group___layer.html#struct_layer).

At a distance, the most basic watch face possible is just a collection of structures representing user interface elements and functions that manipulate these structures through their pointers (easier than returning an entire struct!)

The first two I'll introduce are Window and TextLayer. These are defined using <code>typedef</code>, so the key word <code>struct</code> is not needed when you use them.

The Window structure represents the 'fullscreen window' that IS your watch face. When you add an element such as a TextLayer to the Window, it is displayed in that Window. In order to be accessible to all parts of the watch face program, they are declared 'globally'. This just means outside any function, and so visible to them all, like so:

![](http://ninedof.files.wordpress.com/2013/06/image-32.png)

So, the Window is the main place for all the parts of the watch face, and the TextLayer is a Layer that displays text to the user. Before either of these can be used, we must call functions provided by the SDK to set them up or 'initialise' them. The image below illustrates this process:

![](http://ninedof.files.wordpress.com/2013/06/image-42.png)

Notice throughout the process the Window structure the pointers are operating on is specified using a pointer to the structure, rather than the structure itself. This is done thought the '&amp;' symbol, used to specify the structure's pointer.

Once this is done, we can initialise and add a TextLayer to the Window for displaying our demo text.

![](http://ninedof.files.wordpress.com/2013/06/image-51.png?w=545)

It is important to note that the order in which Layers are added to a Window matters. Much like the new Window is added to the top of the 'stack' of windows, the most recent'y added Layer will be at the front, on top of everything else. If the background colour is specified as <code>GColorClear</code>, this is rarely an issue, but there could be times when this feature can be taken advantage of.

## Conclusion

So that's how the data types, functions and structures manifest themselves in creating a basic watch face. I hope I've made it clear enough, but if not, feel free to ask a question.

## Next Time

In the next section I'll show a brief overview of how to setup a Ubuntu environment for building watch faces, if you prefer that to the cloud based solution mentioned in the first section.

After that, I'll walk through a basic first watch face!
