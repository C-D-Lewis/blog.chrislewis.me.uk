Beam Up v2.1.0: Infamous 'stuck' Bug Most Likely Fixed
2014-03-11 14:01:20
Pebble,Releases
---

<strong>UPDATE: 

## - v2.1.1 includes a much better fix for the animation bug. Sorry for the rapid-fire updates.

## - Looks like I introduced another problem. Rolling back on the Pebble Appstore until I do my job properly.

Since the launch of the Pebble AppStore I have been receiving daily emails about the 'stuck' bug, which looks like this:

![](/assets/import/media/2013/12/img_20131226_185234.jpg?w=545)Not too pretty, eh? It seems to happen completely at random, and I have made attempts to fix this before. It seems to have been introduced by the 2.0 Animation system. I deduce it cannot be a programmatic bug, because all animations are treated the <a title="Animation Function" href="https://github.com/C-D-Lewis/beam-up/blob/master/src/cl_util.c#L67">same way</a>.

So my fix takes the form of manually <code>_set_frame()</code>ing all the layout items at time = 2 seconds past the minute tick. This is not ideal, but given the animation complexity is the best current option.

Another added feature is the fact that the bottom bar now animates to the correct position when the face is opened.

If successful, I'll implement these changes to the other Beam Up variants soon.
