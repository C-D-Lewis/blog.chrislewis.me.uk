---
id: 1066
title: Watch Trigger 1.9: Biggest update yet
postDate: 2013-09-13 01:46:52
original: https://ninedof.wordpress.com/2013/09/13/watch-trigger-1-9-biggest-update-yet/
---

![](http://ninedof.files.wordpress.com/2013/09/icon.png?w=300)

The latest update on it's way to the Google Play store now is the largest yet, so I thought I'd go through it in more detail.

The first major change is the return of support for Android 2.3.3 Gingerbread and up. Previously this was 3.0 Honeycomb and up due to the use of the surprisingly useful  [ActionBar](http://developer.android.com/guide/topics/ui/actionbar.html) and  [PreferenceFragment](http://developer.android.com/guide/topics/ui/settings.html#Fragment) APIs, used to add buttons to the nice red stripe at the top of the viewfinder (as well as enable it's opacity) and automatic creation of the Settings menu layout from an XML file respectively.

Using the above features meant I had to restrict the app to 3.0+ users, which I was uncomfortable doing, seeing as that is the benchmark set for compatibility by the official Pebble app. But since then and after requests from a few would-be users, I worked to create an app that works differently based on the user's version of Android.

If the user is on 3.0 and up, it will use the ActionBar, add the watch-app toggle and settings buttons as ActionBar options, and use the PreferenceFragment API to generate the Settings menu when it is opened by the user. However, if the user is on 2.3.3 (but below 3.0), the app will use a replacement viewfinder layout that replicates the ActionBar layout as close as I can. I must say, I'm impressed at the result. For the Settings menu, the older deprecated PreferencesActivity class is used to generate the settings instead.

Unfortunately, despite trying hard, I had to take out automatic scanning of captures images to the Gallery on Gingerbread. I just couldn't crack it for now. I'll keep trying though.

Here's how the new viewfinder looks with the progressbar, in my room, as it's currently very dark outside...

![](http://ninedof.files.wordpress.com/2013/09/shot1.png)

![](http://ninedof.files.wordpress.com/2013/09/shot2.png)

Other new features include:
<ol>
	- Subtle animations on a couple of UI elements; namely the reset button (if Instant Review is on) and the countdown timer remaining TextView, when it is visible
	- A ProgressBar showing the stages of trigger, capture, saving and media scanning of the image. If Instant Review is on, the reset button appears once this process is complete, ensuring users don't reset the camera before the image is finished saving.
	- The timer now has an option between 1 and 5 second increments (but still up to a 15 second maximum).
	- Full control over the image save path. This is set by default to the device's variant on 'storage/sdcard0/' or 'mnt/sdcard/', whatever Environment.getExternalStorageDirectory() returns. After this, the user is free to change this, even to go up and save to another attached media instead, such as an external SD card, which on my device would be 'storage/sdcard1/'.
	- A guard mechanism to protect against launching the app when the phone is mounted as a removable USB device on a PC. Seeing as the app's sole purpose is to save images to the internal media (which is unavailable when the phone is mounted), this mechanism is a no-brainer.
	- Finally, a wake-lock so that the phone doesn't go to sleep while you are arranging your photo/relatives.
</ol>
I think that's all, so have at it and enjoy! The in-app feedback options are still there in case anything goes wrong.

One other note: I've had reports of intermittent responses from the watch-app, such as UP and DOWN buttons working, but not SELECT. Seeing as I've implemented the Pebble AppSync as best as I am able, all events go through the same procedures, so receive equal treatment. This unusual behavior could be attributed to the on-going battle Pebble are fighting against flaky device connections as one of the focuses behind the last few Pebble App updates. As a personal response to this, I am working on my own abstraction above AppSync (which is itself an abstraction of AppMessage) to try and get a better handle on the continuous state of the connection to the watch.

More info if that gets anywhere.

## Download![](https://developer.android.com/images/brand/en_generic_rgb_wo_60.png)
