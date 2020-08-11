First Pebble Watchface Implemented
2013-04-20 10:52:41
Pebble
---

Remember that Pebble I was talking about the other day? Well despite the fact that half the time the display looks like this:

<a href="http://ninedof.files.wordpress.com/2013/04/img_20130416_133617.jpg">![](http://ninedof.files.wordpress.com/2013/04/img_20130416_133617.jpg?w=545)</a>

I've managed to compile and run this:

<a href="http://ninedof.files.wordpress.com/2013/04/img_20130420_114741.jpg">![](http://ninedof.files.wordpress.com/2013/04/img_20130420_114741.jpg?w=545)</a>

The key to being able to use the screen is to hold the Down button quite hard... But unfortunately this isn't always practical, like when I want to use the Down button repeatedly on a list. I have contacted Support but have yet to receive a reply...

But in the meantime I can keep writing watchfaces, just can't use 'em.

But what if we wanted to change it? Well, here's how you'd go about it:
<ol>
• <span style="line-height:12px;">Load up Ubuntu Linux or a suitable VM, download the Pebble SDK (including dependencies and libraries) and set it all up <a title="Pebble SDK" href="http://developer.getpebble.com/1/welcome">as described here</a>.</span>

• Write the source file, with guidance from the SDK documentation. I've already done this (and you can <a title="Source for basic watchface" href="https://www.dropbox.com/s/yp02w4zcf6j9w5s/textTest.c">read it in full here</a>).

• Change this line to whatever you want this very basic watchface to say. <a href="http://ninedof.files.wordpress.com/2013/04/1.jpg">![](http://ninedof.files.wordpress.com/2013/04/1.jpg)</a>

• Navigate to the watchface's directory in a Terminal. For example: <code>cd ./~pebble-dev/myWatchfaces/TextTest</code> and build the watchface using <code>./waf configure build<a href="http://ninedof.files.wordpress.com/2013/04/2.jpg">![](http://ninedof.files.wordpress.com/2013/04/2.jpg?w=545)</a></code>

• Find the resulting package file in the 'build' directory. For example: <code> ~/pebble-dev/myWatchfaces/TextTest/build</code>

• Copy this file from Ubuntu to Windows if you're using a VM (I couldn't get the next step to work when inside a VM.) <a href="http://ninedof.files.wordpress.com/2013/04/3.jpg">![](http://ninedof.files.wordpress.com/2013/04/3.jpg)</a>

• You need to get to the package file directly on the phone. The suggested method is to use a Python HTTP Server, which comes pre-written as part of the Python distribution.<a href="http://ninedof.files.wordpress.com/2013/04/4.jpg">![](http://ninedof.files.wordpress.com/2013/04/4.jpg)</a>

• On the phone, open a Browser and go to the LAN address of the computer running the server. On my network this would be <code>http://192.168.1.69:8000<a href="http://ninedof.files.wordpress.com/2013/04/5.jpg">![](http://ninedof.files.wordpress.com/2013/04/5.jpg)</a></code>

• There you will find the file. Tap the file name and the Pebble app will open and install the watchface in seconds. <a href="http://ninedof.files.wordpress.com/2013/04/6.jpg">![](http://ninedof.files.wordpress.com/2013/04/6.jpg)</a>

• Now you should see the watchface with its changes on the watch!<a href="http://ninedof.files.wordpress.com/2013/04/7.jpg">![](http://ninedof.files.wordpress.com/2013/04/7.jpg)</a>

</ol>
Now to work on some other ideas I've had...
