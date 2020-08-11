Dynamic PC Backlight with Raspberry Pi and Blinkt
2016-11-20 23:18:44
Integration,Java,Raspberry Pi
---

I'm a big fan of <a href="https://shop.pimoroni.com/products/blinkt">Blinkt light hats</a> for Raspberry Pi. I have one showing me server status, rail delays, and weather conditions.

![](/assets/import/media/2016/11/20161016_153730.jpg)
<p style="text-align:center;">Server down!</p>
I have another at work showing the status of the last link check on our ReadMe.io site.

![](/assets/import/media/2016/11/img_20161117_165458.jpg)

And now I have one as a dynamic backlight for my new PC build.

![](/assets/import/media/2016/11/img_20161120_135026.jpg)

And the best part? This last one has an API! It has five modes, powered by a Node.js Express server and the <code>node-blinkt</code> NPM package:

 • <code>/set { "to": [r, g, b] }</code> - Set a color instantly.

 • <code>/fade { "to": [r, g, b] }</code> - Fade from the current colour to this one.

 • 'CPU' - Fade to a colour on a HSV scale from green to red depending on current CPU load.

 • 'Screen' - Take an average of the four screen corners, and set to that colour ten times a second.

 • 'Demo' - Fade to a random colour from the rainbow every 15 seconds.

 • 'Test' - Ping the Pi and set the 'Test' button to green if it responds 'OK' and HTTP 200.

The last three are driven by a Java control panel that permanently lives on the new PC.

![](/assets/import/media/2016/11/controller.png)

Thanks to the motherboard supplying power after the PC turns off, I can use 'Demo' as a nightlight! Not that I need one...
