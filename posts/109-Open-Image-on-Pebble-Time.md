---
id: 2190
title: Open Image on Pebble Time
postDate: 2015-03-17 06:11:32
original: https://ninedof.wordpress.com/2015/03/17/open-image-on-pebble-time/
---

Long time no blog! There hasn't been much time for experimentation (besides creating a couple of  [color](https://github.com/pebble-hacks/isotime)  [apps](https://github.com/pebble-hacks/block-world) for Pebble Time) in the months leading up the  [Pebble Time Kickstarter](https://www.kickstarter.com/projects/597507018/pebble-time-awesome-smartwatch-no-compromises). Totally worth the effort though, after seeing the response to the  [new material](https://developer.getpebble.com/getting-started/) on the Pebble Developers site.

This weekend, however, I found some time to bring to reality an idea I have had since I first learned of the ability to make color apps for Pebble. Being a big fan of PebbleKit Android (used in Dashboard, Wristponder, Watch Trigger etc) to remotely control/access the connected phone. The idea is this: create an app for Android that registers as a receptor of opening image files. This app then resizes and reduces the color palette of the file before piping it to an automatically opening watchapp for viewing. This stemmed partly from a desire to avoid constantly changing resource files and recompiling a simple app for viewing PNG files every time I wanted to see how a new image looked on Pebble Time.

The implementation was pretty straightforward: Make a simple Android app that included an Intent filter for image files, and a watchapp that simply accepted data packets and stored them in the image data allocated for a GBitmap of the right size. The difficulty came in the signaling between the two. I'm no stranger to establishing communication schemes between Android and Pebble apps, but I'm only human. For some reason I was trying to use a mix of PebbleDataReceivers and PebbleAckReceivers. The former is for processing messages from the watch, and the latter is for reacting to the event that the watch acknowledges a message from the phone. By sending the next data packet in an 'ACK' handler, you can ensure maximum transmission speed as no time is wasted between the watch processing one packet and being ready for the next. This is the same method that apps like Wristponder use for transferring lots of data (try 30 canned responses!). If you're not careful, mixing these two modes (one of which can be considered manual, the other semi-automatic when set up in a continuous data transmission loop) can result in puzzling behavior that is difficult to debug.

Once debugged, however, the result is an app that sends a complete uncompressed image (save that for another day) 24k image to the watch in about 11 - 16 seconds (approx 2 kB/s) and then displays it on the watch. In the meantime, both the Android and Pebble apps show the progress of the transfer:

![](/assets/media/2015/03/screenshot_2015-03-08-18-41-59.png?w=169)

![](/assets/media/2015/03/transfer.png)

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

The app sends a built-in image of a tree as a default option when it is launched by itself, or another image if presented one using 'Open With' actions, such as from file managers or emails. The result of sending the tree image is thus:

![](/assets/media/2015/03/img_20150308_182032-e1425865838845.jpg?w=242)

For some reason I can't quite fathom the color reduction process the app uses (admittedly brittle bit shifting) doesn't handle all files as well, producing discolored results, which I will try and iron out with a better solution, perhaps in the Android SDK itself. When that day comes, I'll polish both app components and hopefully make another Google Play app of it (free, of course, this doesn't do anything particularly useful) and also a two-part library generalized to facilitating large data transfers between phone and watch.

Watch this space!

&nbsp;
