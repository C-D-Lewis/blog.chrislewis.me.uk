Integrated Raspberry Pi Enclosure
2020-09-27 14:06
Raspberry Pi
---

The normal way for a Raspberry Pi enthusiast to use their miniature computer is
to attach a mouse, keyboard, power supply, display of some kind, and then to
disconnect all these cables and peripherals and put them away again. Unless they
use SSH, which makes things a bit less messy.

A few weeks ago I stumbled across the concept of enclosures for Raspberry Pi
that try and solve this problem by combining one or more peripherals into the
case or enclosure itself. Sometimes as far as an included keyboard, battery
pack, etc. I was inspired by this, having done a little CAD design for laser-cut
acylic back in school, and designed to play around in
[Tinkercad](https://www.tinkercad.com) to see what I came up with.

## Design

Over a few days I pieced together some panels and corner pieces to 3D print. I
found that by also modelling the interior components (Pi itself, Waveshare
display, internal bulk of the panel-mount extension cables) I could accurately
size the enclosure and place holes for screws and bolts to hold it all together.

![](assets/media/2020/09/cad.png)

## Assembly

Over the next couple of weeks I ordered the panels to be laser-cut by a small
company specialising in laser cutting and engraving (and would accept orders
smaller than 100!), and used my brother's 3D printer to print the corner pieces.
Once the panel mount cables arrived, I realised that the gaps and bolt holes
were wrong, and so had to re-order a couple of panels - a learning process
indeed.

Finally, assembly was complete. I'm happy with the size, and the
slight use of color to accentuate the design. It's slightly heftier than I
predicted, but that's nice in a way.

![](assets/media/2020/09/done-upright.jpg)

It even works laying down if needed:

![](assets/media/2020/09/done-flat.jpg)

There was just enough space inside for the cables to fit and loop around where
necessary. The thicker the cable, the more difficult to fit in, but none were
too bulky to fit at all.

![](assets/media/2020/09/cables.jpg)

Keen-eyed readers will see one cable is looking a bit hacked about, and that is
because it has been. In order to make at least one of the three top switches
functional (the plan was for one used for power, display, and software trigger)
I very carefully split open the input power USB cable and added detatchable
wires so it acts as a power control. An anxiety-inducing operation, but happily
a success!

![](assets/media/2020/09/solder.jpg)

## Bonus photos

The panel mount extension cables look very nice with their contrasting chome
screws, lined up with enough space to plug things in as needed, such as a mouse
(though the display is a capacitative touch screen), keyboard, USB thumb drive
or 4G model for example.

![](assets/media/2020/09/sockets.jpg)

The three top switches have enough travel to push through from the back of the
front panel and the additional red piece of detailing which makes the display
completely flush with the front surface. Soon, the plan is to splice another USB
wire to enable the display to be turned on/off independantly, and the third
switch to trigger a Python script. For example, <code>startx</code> when ON, and
an equivalent command to drop back to the terminal.

![](assets/media/2020/09/switches.jpg)
