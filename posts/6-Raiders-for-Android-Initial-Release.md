---
id: 133
title: Raiders for Android Initial Release!
postDate: 2013-03-31 23:17:45
original: https://ninedof.wordpress.com/2013/03/31/raiders-alpha-release/
---

![](http://ninedof.files.wordpress.com/2013/03/raiders-title1.png)

After much work, I feel that Raiders is ready for an initial release. I've minimised re-allocation as much as I'm able, and separated the calculations and drawing using a new <code>Thread</code>. This actually boosted the framerate on my brother's Galaxy Ace from around 25 to over 50!

I may never get round to posting a summary of the PC version, so I'll do it here. Raiders is a basic arcade-shoot-em-up. The vague plot (if any) is that the player shoots as many enemy ships as possible. As you level up, more valuable ships appear. The score counter counts in the pending score accumulated and multiplies it based on the current Combo value, so if you're on a 4x combo, each point counted in is worth 4 on the main counter. Destroying a ship adds to a 'timeout' counter that has a maximum value of 500 frames, after which the pending score is decimated per frame, and so totted up.

In its current form there are three enemy ship types and no possibility of player death or winning, just a seven figure score counter. After showing both my parents (who are not gamers at all), they both ended up spending a good five or so minutes shooting ships before they got bored. I consider that an achievement!

Here is a  [download link](https://www.dropbox.com/s/7is07qt9ppex7zr/RaidersAndroid.apk) for a side-loadable .apk. In Android, enable 'Install from Unknown Sources', then open the .apk on the phone. Enjoy!

I'll continue to add more features from the PC version (player and enemy health, more ships, mines, a boss etc) and post the next release here.
