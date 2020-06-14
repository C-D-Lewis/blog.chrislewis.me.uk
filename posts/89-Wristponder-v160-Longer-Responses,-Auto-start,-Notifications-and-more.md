---
id: 1864
title: Wristponder v1.6.0 - Longer Responses, Auto-start, Notifications and more!
postDate: 2014-04-15 14:17:23
original: https://ninedof.wordpress.com/2014/04/15/wristponder-v1-6-0-longer-responses-auto-start-notifications-and-more/
---

After finishing my engineering dissertation, today is a day to get some coding done before starting on the next assignment sprint tomorrow.

The result is version 1.6.0 of Wristponder!

![](http://ninedof.files.wordpress.com/2014/04/screenshot_2014-04-15-14-52-59.png?w=545)

New features include:


	- The maximum length of a response has been raised from 40 to 100 characters.
	- Option to auto-start the watchapp when an SMS or phone call is received.
	- Option to receive a notification when the SMS send is successful or fails. This is good for when signal is weak and takes longer than the alert dialog timeout.
	- Sorting the list of responses now triggers a sync of responses where it incorrectly did not previously. Full manual sorting is coming soon, when I figure out the UI processes to use.
	- The watchapp is now built with SDK 2.0.2. Sorry this transition from BETA6 took so long.


As a result, both the Android and watchapp require updating. The good news is that the new watchapp is bundled with the Android app with an  [improved side-loading mechanism](http://forums.getpebble.com/discussion/comment/103733/#Comment_103733) that looks more robust, I hope.

A set of selectable Favourite contacts is also coming soon, but requires significant UI modification, more than a day's work. Stay tuned for that.

Enjoy!

## Download
![](https://developer.android.com/images/brand/en_generic_rgb_wo_60.png)
