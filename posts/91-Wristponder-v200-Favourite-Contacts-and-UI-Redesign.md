---
index: 91
title: Wristponder v2.0.0: Favourite Contacts and UI Redesign
postDate: 2014-04-27 00:38:00
original: https://ninedof.wordpress.com/2014/04/27/wristponder-v2-0-0-favourite-contacts-and-ui-redesign/
---

One of the most requested features for Wristponder I get is the ability to manually choose a small set of 'favourite' contacts, perhaps as only having the last contacts and cumulative incoming contacts wasn't enough. I realised that after adding favourite contacts the main menu would get much longer, and so the UI would need an overhaul to better navigate the list of contacts. So the menu was redesigned to contain Last SMS, Last Call, Top Incoming -&gt; Incoming contacts, Favourites -&gt; Favourite contacts. This way it's quicker to navigate where you want to go, as opposed to always scrolling the whole list.

![](http://ninedof.files.wordpress.com/2014/04/wp-2-screens.png)

Thankfully using the new data streaming method to download contacts as opposed to sending them synchronously from Android (which was prone to errors and missed messages, which the new method is not) I was able to present the synchronising of contacts as a fancy progress bar as the app opens. Behind the scenes as well, I split up one huge C file into a header-source pair for each window with as few globals as needed. Much easier to work with now!

![](http://ninedof.files.wordpress.com/2014/04/wp-sync.png)

The favourite contacts themselves are selected using a new button in the main Android app's ActionBar, and chosen using a series of Spinners.

<img class="aligncenter size-full wp-image-1903" src="http://ninedof.files.wordpress.com/2014/04/wp-2-heart.png" alt="wp 2 heart" width="540" height="110" />

The reason for this is that I had great difficulty finding a way to integrate the Contact Picker's Activity life-cycle (using startActivityForResult) into a ListActivity. Short of using another Activity as a blank go-between, this was the best option I found. It's very likely I'll make a better interface in the future if the inspiration strikes me.

![](http://ninedof.files.wordpress.com/2014/04/screenshot_2014-04-26-21-31-39.png?w=545)As with the last update, the response list is synchronised only when changed using two checksums calculated internally on both sides, then compared when a contact is selected. This makes use of the app a lot faster and illustrates the usefulness of the Persistent Storage API!

As always, you can get Wristponder from Google Play:

## Download
![](https://developer.android.com/images/brand/en_generic_rgb_wo_60.png)
