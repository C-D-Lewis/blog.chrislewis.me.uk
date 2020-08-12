Pebble Watch App: Watch Trigger
2013-08-30 00:22:22
Android,Pebble
---

<strong>Updates:
## 1.8.1:
- Fixed crash when capturing while media scanner was at work
- Added option to get a debug log to help me figure out what breaks!

## NOTICE: I'm working on bringing back compatibility with Android 2.3.3 Gingerbread phones. If you own such a device and would like to test a build for me, let me know!

I was on the Google Play store today and I saw that a <a title="Search for Pebble Camera Remote on Google Play" href="https://play.google.com/store/search?q=pebble%20camera%20remote&hl=en_GB">search for "Pebble Camera Remote"</a> returned no results. This got me thinking... <em>I can do that</em>!

So I spent a good afternoon getting back into Android and Pebble developer kits to produce the <del>first</del> 1.8.1 version of what I have dubbed "Watch Trigger" - an app that lets you use your Pebble watch as a remote control! This means you can do what you'd normally do when taking a timed photo, but you don't have to rush back to the group in ten seconds, you can press the watch button as quickly and discreetly as you want.

Once the app is installed, you can install the watch app by pressing the 'Install Watch App' button, then relaunch the Android app. As shown on the Pebble app, pressing SELECT will cause the phone to take a photo and save it to "<del>/sdcard/Watch Trigger Images/ImageX.jpg</del>" anywhere in the external storage you want. The name of the photo taken will then be confirmed on the phone and the watch, so you can go back and pick it up again:
![](/assets/import/media/2013/08/shot11.png)![](/assets/import/media/2013/08/shot31.png)
![](/assets/import/media/2013/08/watchapp.jpg)
So now it is possible to take a photo using the Pebble watch as a remote!

## Special mentions

In adding a button to install the companion watch app from within the Android app, I used a method written by <a title="Install Pebble App" href="https://github.com/SheepWillPrevail/android/blob/a8f51bb6abd8795517aa94bcc3c9f5a0c25eb081/PebbleRSS/src/com/grazz/pebblerss/MainActivity.java#L147">Robert Meijer, which I found on GitHub</a> - an elegant solution. Thanks Robert!

## Known bugs/issues

• <del>Only portrait orientation at the moment, but landscape if you rotate the photos post-shoot.</del>

• <del>Cropping of the preview surface, but <strong>NOT</strong> of the resulting photo. I'm not sure how to rectify this at the moment, but if programming has taught me anything, its that virtually anything is possible.</del>

• <del>Low default output resolution</del>

• <del>Storage location not always /sdcard0/ on all devices</del>

• <del>Crash when taking photo while the previous one is being saved</del>

• <del>Flash does not always fire</del>

• <del>Crash when triggering if media scanner was still running</del>

• Let me know any you find!

## Download</strong><a href="https://play.google.com/store/apps/details?id=com.wordpress.ninedof.watchtrigger">
![](https://developer.android.com/images/brand/en_generic_rgb_wo_60.png)</a>

Enjoy! As usual, please leave your thoughts and suggestions below!
