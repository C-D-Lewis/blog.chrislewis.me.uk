---
index: 44
title: Unnamed Space Project: UI Investigation
postDate: 2013-08-28 00:40:47
original: https://ninedof.wordpress.com/2013/08/28/unnamed-space-project-ui-investigation/
---

So I've had an idea in my head for a while that has probably been done before, but as I've already mentioned, I prefer to do everything I can from scratch when it comes to programming, which takes time, but is incredibly rewarding when what I strive for comes to life as I imagined.

This particular idea is for a real-time space RPG, the main mechanic being that you set a course and a speed, and it might take a few real-time minutes to reach your destination, such that you would play the game ongoing in the background for something else you are doing, similar to an MMO.

I've attempted this before, and the main difference in having a game world many times larger than the screen is that you must position everything relative to some abstracted co-ordinate system completely separate from where each item may be drawn on the actual screen. This was achieved before by drawing each item if it was less than a screen width or height away from the player's drawing location in the middle of the screen, then whenever the player moved it's 'co-ordinate', all the other in-game items moved in the opposite direction, very effectively creating the illusion of moving through a world, even though the player's sprite stays put on the screen.

This feeling was further enhanced by moving the player's 'co-ordinate' using the sin/cosine of the speed and angle, allowing the player to appear to move in large smooth, sweeping arcs.

With my new skills from recent projects still fresh in mind, I set out to make this a much tighter experience, with some more intuitive input system beyond WSAD keyboard keys. I envisaged a speed slider, and a 'ring slider' around the player in the center of the screen, allowing a course to be set and speed to be set by dragging them. As everything is done on a Graphics2D enhanced Canvas component, using pre-written Swing sliders is out of the question, so I set out to recreate these UI elements from scratch to be drawn using Graphics2D methods.

The linear slider was fairly easy, using the <code>mouseDragged()</code> method from the <code>MouseMotionListener</code> class. Position the slider where the user clicked (x co-ordinate only!) as long as it was between the slider's start and finish positions.

So far so good.

But the 'ring slider' required much more thinking about. I first attempted to use counters and quadrant detection of the existing angle position of the ring, but this was way too complex. Then as I was thinking about something else, the answer came to me: use GCSE maths! Specifically, the circle trigonometry stuff. It all came down to this: ![](http://ninedof.files.wordpress.com/2013/08/circletheorem.png)So using the mouse's dragging x co-ordinate, I can find the corresponding y co-ordinate for that point around the 'ring slider''scircle. From this, the angle (theta, <b>θ</b>) the slider should be set to can be found using the tangent:

![](http://ninedof.files.wordpress.com/2013/08/arctan.png)But this only works up to 90 degrees using tangent (which is actually infinite at 90 degrees), so the calculation is carried out subtly differently depending on which of four quadrant rectangles the user is dragging in, after which the resultant 0 - 90 angle is adjusted to read what it should in the quadrant:

![](http://ninedof.files.wordpress.com/2013/08/quadrantssrc1.png)

Here is the code for calculation of the angle of the 'ring slider' in quadrant 0:

[code language="java"]//Setup quad rects for ring slider of any bounds x, y, width &amp; height
quad0 = new Rectangle(x + width/2, y, width/2, height/2);
quad1 = new Rectangle(x + width/2, y + height/2, width/2, height/2);
quad2 = new Rectangle(x, y + height/2, width/2, height/2);
quad3 = new Rectangle(x, y, width/2, height/2);

//Test user click - 2x2 rect around mouse pointer location
Rectangle thisRect = new Rectangle(inCurrent.x - 1, inCurrent.y - 1, 2, 2);

//Show angle
if(thisRect.intersects(quad0))
    thisQuad = 0;
else if(thisRect.intersects(quad1))
    thisQuad= 1;
else if(thisRect.intersects(quad2))
    thisQuad = 2;
else if(thisRect.intersects(quad3))
    thisQuad = 3;

switch(thisQuad) {
    case 0: {
        float adj = inCurrent.x - quad0.x;
        float opp = (quad0.y + quad0.height) - inCurrent.y;

        double theta = Math.toDegrees(Math.atan(opp/adj));
        angle = 90 - (int)Math.round(theta);

        //Range control
        if(angle &lt; 0)
            angle = 0;
        if(angle &gt; 90)
            angle = 90;
        break;
    }
    //Then the other quads for cases 1 through 3...
}
[/code]

The end result of all this, together with a spawning starfield of stars (who move proportionately to their size to create the illusion of depth) is this (Click to enlarge):

![](http://ninedof.files.wordpress.com/2013/08/inaction.png?w=545)I realise that a simple image isn't that exciting, so if you want to play around with these UI elements and see the whole demo in action, [here is an executable bundle](https://www.dropbox.com/s/6lzg9n61lcfyyrz/StarfieldUI%20Demo.zip)!
