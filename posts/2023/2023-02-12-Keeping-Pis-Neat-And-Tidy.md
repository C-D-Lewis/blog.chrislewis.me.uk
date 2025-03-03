Keeping Pis Neat and Tidy
2023-02-12 14:21
Raspberry Pi,Integration
---

For a few years now I've had a small set of three Raspberry Pi model 3s in a
stack using a cheap but slightly rickety stacking 'case' involving several
layers of plastic and lots of pieces of metal. After a few warm and cold seasons
it seems the joints losen slightly and it gets a bit wobbly. But it does the job
just fine - and with some smart Ethernet and USB power cables it was a nice
addition to my 'home office'.

![](assets/media/2022/05/pi-stack.jpg)

However, around October last year I had the idea to replace this store-bought
case with something more custom made, similar to the 3D printed 'case' created
for the
[Cirroc NAS device](https://blog.chrislewis.me.uk/?post=2022-08-13-Ditching-Dropbox-With-Cirroc-A-Tiny-Cloud).
So, I dived back into Tinkercad and before long the idea turned into something a
little more ambitious - a 3D printed rack resembling that found in a data
center, with each Pi in its own rack tray. How hard could it be?

## Version 1

After a few weeks of tinkering with the design and measurements taken from the
various available online datasheets I had something I though was worth printing.
The result was just about adequate - a few mis-measurements, holes that were too
small, and accidentally using the Raspberry Pi model 4 I/O dimensions. It looked
the part and just about did the job - for two Pis.

![](assets/media/2023/02/rack-v1.jpg)

I found the 3mm thin side panels were too flimsy and had a slight curve from
the 3D printer bed, so I had to fasten one side on the inside of the top panel
to add enough 'pinch' to keep the shelves from popping out and falling down. But
most importantly it informed me what needed to change for the second version!

## Version 2

I bought a set of digital calipers and got serious about the measurements for
the I/O on the Pis, as well as precise measurements of the feet of the Netgear
5 port switch to lock it in place, and also had the idea of bringing the Cirroc
NAS device in too to use the two top bays. This would bring all the Pis used
for various purposes under one roof so to speak, a very appealing proposition.

After more time in Tinkercad I arrived at the final design, and with the help
of being able to move parts around as if they were real I could feel much more
confident the second round of prints would be the last required. I increased the
hole diameters to 4mm, and the side panel thickness to 5mm for some more
stiffness, and even a dedicated shelf for holding the USB power bank and help
route all the USB and Ethernet cables through one location. Lastly, adding a
variant of the Pi shelf with I/O for the Pi 4 (which Cirroc uses, and appears to
be mirrored horizontally) and a dedicated shelf for the two SSDs made the design
complete.

![](assets/media/2023/02/rack-cad.png)

## Final Result

After printing, assembly, and a whole lot of cable wrangling the thing is now
complete - and I have to say I'm pleased with the result! It is stronger, solid,
and shelves and other devices are not as subject to wandering about due to
tensions in cables etc. And it also includes Cirroc, freeing up a whole cell
of my IKEA shelving for something else to take its place.

![](assets/media/2023/02/rack-v2.jpg)

A close-up with two shelves pulled part-way out:

![](assets/media/2023/02/rack-v2-open.jpg)

Each shelf includes a small 1-inch OLED module from Adafruit to allow the
<code>monitor</code> app from <code>node-microservices</code> to report system
resorce usage, and for Cirroc to retain it's trademark display in the same style.

## Conclusion

So, after mutiple iterations and lessons learned in 3D design of larger
multi-part designs I am rewarded with a solid, neat, self-contained unit that
resembles a cute, slightly disheveled data center rack, and also contains a
previous project. And it looks excellent in the dark as well!

![](assets/media/2023/02/rack-v2-dark.jpg)
