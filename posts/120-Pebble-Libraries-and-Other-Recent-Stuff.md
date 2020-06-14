---
id: 2302
title: Pebble Libraries and Other Recent Stuff
postDate: 2016-06-30 00:41:04
original: https://ninedof.wordpress.com/2016/06/30/pebble-libraries-and-other-recent-stuff/
---

So Pebble recently added proper library support to their SDK. Fantastic! Now I have a streamlined outlet for all my obsessive and productive refactoring. A lot of my apps and watchfaces contain modular elements that get reused. I also have a strange draw to making libraries, examples of which you can find in  [this handy GitHub README](https://github.com/C-D-Lewis/pebble).

After the feature went live, I spent some time reviewing work done by Cherie, and published two libraries on NPM (more will probably follow, if I find the time/energy):


	-  [pebble-pge](https://www.npmjs.com/package/pebble-pge) - Everybody's favourite Pebble game engine they've probably never heard of.
	-  [universal-fb](https://www.npmjs.com/package/universal-fb) - Universal access to set/get/swap colours in a Layer's LayerUpdateProc without having to worry about the buffer format/how to manipulate bits in bytes (I already did that for you, twice)


This concludes today's library announcements.

In other news, I finally caved an made the icon grid/menu compromise in Dashboard that the more vocal users were complaining about. I have to admit, cramming both screens into one Window with an animation between them does work very well, and is likely to be the status quo for some time to come.

Speaking of which, watching the  [latest Developer Meetup video](https://www.youtube.com/watch?v=oP7lRK9Q8tw) made me sad to no longer be a part of improving the Pebble Development experience, but excited to remain a community member and spend even more time putting off adding new features to my apps that are enabled by the new SDK APIs. I'm looking at you, App Glances.
