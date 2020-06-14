---
id: 486
title: New Watch Face: Beam Up
postDate: 2013-06-17 21:16:47
original: https://ninedof.wordpress.com/2013/06/17/new-watch-face-beam-up/
---

I've had another watch face idea! And it's almost completely implemented. This time around, any digit about to change gets 'beamed up' by an <code>InverterLayer</code>, changed, then replaced a moment later. Before I go into the interesting specifics, here's a preview image (although rather crudely created):

![](http://ninedof.files.wordpress.com/2013/06/mockup.gif)I'll post it for download on mypebblefaces when I feel its ready, but its pretty close now, and there is an interesting characteristic to a watch face of this nature that I'd like to discuss.

The rough logic for the 'digit changing' code goes like this:

1. Any digit about to change has the 'beam comes down, digit goes up' animations applied to it.

2. Those digits are changed to the new ones at seconds == 0 time

3. Those new digits are then replaced with the 'digit comes down, beam goes up'  animations.

Now, in order to make sure only those digits that ARE about to change actually have the animation applied to them, we need to predict which ones are about to change. This is because the condition 'new digit does not equal old digit' (12:39 changing to 12:40) for example, can only be known once the new minute has elapsed at the seconds == 0 time. But by this time, the changed digit specific 'hide' animations are supposed to already have taken place! Hence the need for digit change prediction a second before, at seconds == 59 time.

To do this, we look at each digit and the conditions under which each one will change. For example, for the '2' digit in '13:29', which I call 'minutes tens', the condition is that the 'minutes units' digit will be '9'. Thus, this is incremented behind the scenes to trigger the correct 'hide' animations before the time change has actually taken place. When the minute changes, the new time overwrites this little 'hack' and so synchrony is never lost to the user.

Similar conditions exist for the other two left hand digits. For the 'hours minutes', the condition is that  the 'minutes tens' digit is '5' and the 'minutes units' digit is '9' (12:59 for example).

Finally, for the left hand most digit, 'hours tens', the condition is a little more complex. There are three times at which this digit changes.
<ol>
	- At 09:59, it changes to a '1' in 10:00.
	- At 19:59, it changes to a '2' in 20:00.
	- At 23:59, it changes to a '0' in 00:00.
</ol>
By using this simple prediction algorithm on the second tick before any animation is due to take place, the watch face code knows which digits will change before the time change has even taken place!

I'll need to think about how this can be generalised even further for 12-hour time, so that will be included in the eventual release, hopefully very soon!

Until next time.
