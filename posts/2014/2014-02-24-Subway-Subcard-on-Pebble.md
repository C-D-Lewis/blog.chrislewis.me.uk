Subway Subcard on Pebble
2014-02-24 15:09:29
Integration,Pebble
---

As an experiment, I downloaded the Subway Subcard Android app and extracted the QR code from a screenshot. The screenshot has been modified to prevent anyone claiming my Subcard points (of which I currently have very few, but it's the principle!)
![](/assets/import/media/2014/02/subcardfull.png?w=545)
I then created a simple Pebble app to show this code as a BitmapLayer for the store scanner to scan. It looks like this with the dummy QR code:

![](/assets/import/media/2014/02/pebble-screenshot_2014-02-27_11-22-28.png)

And it worked! The points were added in the Android app but I didn't have to unlock my phone and open the Subcard app. So some time was saved, and I got a positive reaction from the cashier, which is always a bonus!

If you want to use this yourself, get the code from the <a title="Source" href="https://github.com/C-D-Lewis/pebble-subcard">GitHub repo</a> and replace qr.png with a 144x144 crop of your own Subcard QR code from the app or carefully from a photo of your physical card, then re-compile.
