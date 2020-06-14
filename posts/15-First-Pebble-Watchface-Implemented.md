---
id: 243
title: First Pebble Watchface Implemented
postDate: 2013-04-20 10:52:41
original: https://ninedof.wordpress.com/2013/04/20/first-pebble-watchface-implemented/
---

Remember that Pebble I was talking about the other day? Well despite the fact that half the time the display looks like this:

![](http://ninedof.files.wordpress.com/2013/04/img_20130416_133617.jpg?w=545)

I've managed to compile and run this:

![](http://ninedof.files.wordpress.com/2013/04/img_20130420_114741.jpg?w=545)

The key to being able to use the screen is to hold the Down button quite hard... But unfortunately this isn't always practical, like when I want to use the Down button repeatedly on a list. I have contacted Support but have yet to receive a reply...

But in the meantime I can keep writing watchfaces, just can't use 'em.

But what if we wanted to change it? Well, here's how you'd go about it:
<ol>
	- <span style="line-height:12px;">Load up Ubuntu Linux or a suitable VM, download the Pebble SDK (including dependencies and libraries) and set it all up  [as described here](http://developer.getpebble.com/1/welcome).</span>
	- Write the source file, with guidance from the SDK documentation. I've already done this (and you can  [read it in full here](https://www.dropbox.com/s/yp02w4zcf6j9w5s/textTest.c)).
	- Change this line to whatever you want this very basic watchface to say. ![](http://ninedof.files.wordpress.com/2013/04/1.jpg)
	- Navigate to the watchface's directory in a Terminal. For example: <code>cd ./~pebble-dev/myWatchfaces/TextTest</code> and build the watchface using <code>./waf configure build![](http://ninedof.files.wordpress.com/2013/04/2.jpg?w=545)</code>
	- Find the resulting package file in the 'build' directory. For example: <code> ~/pebble-dev/myWatchfaces/TextTest/build</code>
	- Copy this file from Ubuntu to Windows if you're using a VM (I couldn't get the next step to work when inside a VM.) ![](http://ninedof.files.wordpress.com/2013/04/3.jpg)
	- You need to get to the package file directly on the phone. The suggested method is to use a Python HTTP Server, which comes pre-written as part of the Python distribution.![](http://ninedof.files.wordpress.com/2013/04/4.jpg)
	- On the phone, open a Browser and go to the LAN address of the computer running the server. On my network this would be <code>http://192.168.1.69:8000![](http://ninedof.files.wordpress.com/2013/04/5.jpg)</code>
	- There you will find the file. Tap the file name and the Pebble app will open and install the watchface in seconds. ![](http://ninedof.files.wordpress.com/2013/04/6.jpg)
	- Now you should see the watchface with its changes on the watch!![](http://ninedof.files.wordpress.com/2013/04/7.jpg)
</ol>
Now to work on some other ideas I've had...