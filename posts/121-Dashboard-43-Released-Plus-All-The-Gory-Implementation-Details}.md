---
index: 121
title: Dashboard 4.3 Released (Plus All The Gory Implementation Details)
postDate: 2016-07-12 22:07:34
original: https://ninedof.wordpress.com/2016/07/12/dashboard-4-3-released-plus-all-the-gory-implementation-details/
---

That's right, the latest and greatest update to Dashboard is now live (pending Google Play deployment delay). The new features are (in descending order of number of requests received):


	- A choice of Find Phone sound from system notification sounds. While these are guaranteed to be available, free-form choice of file proved too tricky to handle (see Android file manage <code>content://</code> URI problems discussed elsewhere).
	- An option to post an Android notification (and by extension, to the watch) when the phone has fully charged (see details below). This approach is better than the original one planned which involved custom UI in the watchapp, but would rely on an assumption about how long PebbleKit Android would take to launch the watchapp before messaging it.
	- Holding down the button now uses repeat button clicks to reduce wear on the Pebble buttons while scrolling through toggles.
	- Since I'm making bigger use of Notifications, installed a proper white notification icon to improve upon the old 'white circle'.
	- More misc UI improvements in both app components, including a donation link for those inclined, after some minor success in News Headlines.


So how does the new 'full charge notification' feature work? I'm glad you asked!

## The Short Answer

Once your phone has reached 100% charge (when it was previously 99% or less), an Android notification is posted, which is displayed on Pebble (for free!) unless for some reason Dashboard was disabled in the Pebble app.

## The Long Answer

Oh boy, this was a tricky one. While the <code>ACTION_BATTERY_CHANGED</code> Intent is available for apps to know when the battery level changes, it's a special case that cannot be simply registered in AndroidManifest.xml for spin-up whenever required. It has to be programmatically registered. For an app designed to run with extremely minimal interaction with the Android app component, this is tricky.

So what have I done? When the user toggles the feature on in the Android app, the BroadcastReceiver for the above Intent is registered. Sounds simple, right? Well that works for anywhere between ten minutes and an hour or so. I was charging my phone from 99% in testing, and seeing the notification after a few minutes as expected, but a frustrating lack of notification after leaving the phone idle for couple of hours on longer charges.

For reasons unknown to me, the system kills my programmatically registered BroadcastReceiver at seemingly random intervals. Remember, this wouldn't happen with a nice and convenient receiver registered in AndroidManifest.xml.

Undeterred by this (because this is a nice feature idea), I found another solution. I made the receiver object a static class member, and used the Android AlarmManager to check it was not <code>null</code> at infrequent intervals (currently half an hour). This seemed to work well, once I realised by trial and error that Android Studio appears to kill BroadcastReceivers and AlarmManager alarms, but not deliver the <code>ACTION_PACKAGE_CHANGED</code> which I use to restore the alarms after a theoretical future app update is installed.

In addition, new users would not have their 'keep alive' alarms registered upon first install, since <code>ACTION_PACKAGE_ADDED</code> is not delivered to the app that has just installed (why!?). Fancy another complication? Here you go: AlarmManager alarms are all killed when the device is rebooted, so I make additional use of <code>ACTION_BOOT_COMPLETED</code> to restore them.

## Finally

So there we go! I've always been a vocal proponent of Android's Intent system for IPC, but after this set of complications (which has still yielded an apparently solid solution), I'm not so sure. Ah, who am I kidding? Still a big fan!

Dashboard can be installed from the [Pebble appstore](https://apps.getpebble.com/en_US/application/53ec8d840c3036447e000109) and the [Google Play Store](https://play.google.com/store/apps/details?id=com.wordpress.ninedof.dashboard).
