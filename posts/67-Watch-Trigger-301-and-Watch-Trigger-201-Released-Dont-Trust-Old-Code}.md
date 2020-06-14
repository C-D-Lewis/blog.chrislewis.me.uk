---
index: 67
title: Watch Trigger 3.0.1 and Watch Trigger + 2.0.1 Released: Don't Trust Old Code
postDate: 2013-12-31 14:21:25
original: https://ninedof.wordpress.com/2013/12/31/watch-trigger-3-0-1-and-watch-trigger-2-0-1-released-dont-trust-old-code/
---

Woke up today to multiple bug reports. Apparently I didn't test the new versions of the Android apps against the 1.X versions of the watchapps enough! Downgrading is easy enough a process, so after a while I had found that changing the old <code>AppSync</code> implementation for my newer <code>AppMessage</code> paradigm (Package whole Dictionaries, iterate and process all Tuples for each Dictionary received) seemed to resolve the problems!

Thus the bug fix update was sent to Google Play this morning after only a modicum of panicking. All users will need to re-install their appropriate watchapp, and the Android app will guide them:
<p style="text-align:center;">![](http://ninedof.files.wordpress.com/2013/12/screenshot_2013-12-31-14-17-18.png?w=545)</p>
So, with that out the way, I've moved on to applying the new dymanically allocated Animation system developed during the course of writing the SDK 2.0 Tutorial #4 to the Beam Up watchfaces, which should hopefully eliminate this ugly bug:

![](http://ninedof.files.wordpress.com/2013/12/img_20131226_185234.jpg?w=545)If it's successful I'll packages all four of those and the two new versions of Watch Trigger (+) into Watch App Selector and update that to the Play Store too. Exciting times!
