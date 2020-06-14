---
id: 2223
title: Revisiting Beam Up for Pebble with SDK 3.0
postDate: 2015-04-28 03:12:21
original: https://ninedof.wordpress.com/2015/04/28/revisiting-beam-up-for-pebble-with-sdk-3-0/
---

According to the Pebble dev portal, the last version of Beam Up to be released was December 14th, 2014. If I remember correctly, that version was the much required update that rolled all the different versions (inverted, with date, with battery etc.) into one version. This was a move away from the SDK 1.x hangover where app config pages did not exist, so multiple apps were required.

The SDK has come a long way since then, with the latest release (3.0-dp9) released today, after much testing. The biggest change this time around is deprecating the <code>InverterLayer</code> element, popularly used to add a quick black-on-white effect to many watchfaces, as it no longer makes sense in a world of 64 colors.

How do you invert a color? As I found out during my degree course, techniques applied to colors (and even grayscale) cannot be easily applied to color in the same way. A prime example from that work was the techniques involved in  [Mathematical Morphology](http://en.wikipedia.org/wiki/Mathematical_morphology) and utilized ordering of pixels heavily. A white pixel can be defined as 'greater' than a black pixel, a grayscale pixel with value 128 can be 'lesser' than one with a value of 238, and so on. This enabled the implementation of various filters that went on to enable the automatic counting of tree canopies. But the last part of the work was adapting these techniques for color images. The crucial question was this: how can you decide whether one color is 'greater' than another? There were several options, with no clear leader in terms of logic. Was the 'greater' color:


	- The one with the largest single component?
	- The one with the largest averaged value?
	- The one with the largest total component value?


The answer I chose was borne out of a piece I read arguing that the human eye is more sensitive to green light (perhaps a hangover from living in the verdant wilderness?), and so proposed that the colors be ordered with a preference for the green component, and this gave good results.

The same problem exists when placing a Pebble <code>InverterLayer</code> over another color in a Layer beneath it: what's the inverse of yellow? Is it:


	- The inverted color according to classic opposites?
	- The inverted bits in the byte representation?
	- The inverted values of the RGB channels?


So it was removed, and APIs added to <code>MenuLayer</code> (the chief user of the <code>InverterLayer</code> in the system) to allows developers to specify their own choice of colors for menu items when each is selected. A more general approach I adopted to enable me to continue to develop Beam Up (a handy coincidence when I wanted to add color themes) is to have the developer specify two colors, and use the frame buffer API to invert then to each other wherever they appear. This approach worked really well, and enables any color combination desired as an artificial 'inversion'; especially useful for adding themes to Beam Up. These take the form of pairs of colors, selectable in presets (for now!) in the app config page.

The image below shows three of the new themes in action: blue, green and midnight. Classic, Inverted Classic, Red, and Yellow are also initially available.
<p style="text-align:center;">![](/assets/media/2015/04/themes.png)</p>
<p style="text-align:left;">The new version is  [available on the Pebble appstore](https://apps.getpebble.com/applications/5299d4da129af7d723000079). On Aplite (Pebble, Pebble Steel) it behaves as it ever did, except now the config page remembers your choices from last time you saved. On Basalt, the new themes are available, using the new pseudo-<code>InverterLayer</code>, called  [<code>InverterLayerCompat</code>](https://github.com/C-D-Lewis/beam-up/blob/master/src/shim/InverterLayerCompat.h) in the code. This is still  [available in full on GitHub](https://github.com/C-D-Lewis/beam-up)!</p>
