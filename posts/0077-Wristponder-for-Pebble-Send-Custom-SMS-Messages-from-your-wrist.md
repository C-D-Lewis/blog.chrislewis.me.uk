Wristponder for Pebble: Send Custom SMS Messages from your wrist!
2014-02-14 17:12:35
Android,Pebble
---

<h2><strong>Introduction</strong></h2>
After a couple of weeks' on and off work I proudly present a new watchapp for Pebble: Wristponder!

Together with the Android companion app, this watchapp allows you to add, edit, delete, import and export custom SMS messages and send them from the watch.
<p style="text-align:center;"><a href="http://ninedof.files.wordpress.com/2014/02/pb-screen.png">![](http://ninedof.files.wordpress.com/2014/02/pb-screen.png)</a></p>

<h2 style="text-align:left;">How it works</h2>
In the Android app, the responses are specified by the user and stored in a database, which is then read when the watchapp is launched and a request is made.

Each response is sent to the watch where it is then shown in a <code>MenuLayer</code> underneath the name of the last contact to send the user an SMS. Once the user selects a response it is sent to that contact via the phone.

Due to <code>AppMessage</code> size limitations, each <code>PebbleDictionary</code> sent contains only two responses. If any of them fail to be delievered, the watchapp spots this and requests them again from the phone. This event is shown by 'Latecomers...' on the watch. This even happens less if the <code>AppMessage</code> delay is increased, but you can try smaller values if you like to live dangerously. This was a source of much frustration in development, but the final solution seems to be remarkably robust.
<p style="text-align:center;"><a href="http://ninedof.files.wordpress.com/2014/02/screenshot_2014-02-14-14-50-49.png">![](http://ninedof.files.wordpress.com/2014/02/screenshot_2014-02-14-14-50-49.png?w=545)</a></p>

<h2 style="text-align:left;">Download</h2>
You can get Wristponder with it's companion app in one place from the Google Play store. If you find any bugs or have feature ideas, let me know!

<a href="https://play.google.com/store/apps/details?id=com.wordpress.ninedof.wristponder"> ![](https://developer.android.com/images/brand/en_generic_rgb_wo_60.png)
</a>
