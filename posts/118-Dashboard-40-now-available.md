---
id: 2281
title: Dashboard 4.0 now available!
postDate: 2016-05-04 18:30:55
original: https://ninedof.wordpress.com/2016/05/04/dashboard-4-0-now-available/
---

![](/assets/media/2016/05/blogbanner.png)

It's here! The redesign I've been planning since many months ago (the previous colour watchapp design was a bit of a bodge), and I've wanted to add in a few extra features:


 	- GSM signal strength
 	- Wifi network name
 	- Phone free space
 	- Resync every 30 seconds while the app is open
 	- Option to jump straight to a certain toggle when the app is opened


...and all the usual refactoring (I can't help myself) and some protocol simplification. Here's a rule of thumb: if your AppMessage protocol uses arithmetic and nested switch statements, ditch it!

I also improved a lot of the Android code, added fail cases, and more logging etc. to better help me diagnose problems when a user sends me a debug log. Finally, I brought a little animation magic to the UI, and relied more heavily on system UI components instead of over-complicating things by rolling my own version of everything.

Download on  [Google Play](https://play.google.com/store/apps/details?id=com.wordpress.ninedof.dashboard) and  [Pebble appstore](https://apps.getpebble.com/en_US/application/53ec8d840c3036447e000109)!
