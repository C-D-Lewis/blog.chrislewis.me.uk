Opening Images on Pebble: Now With Intent Import!
2015-04-20 00:55:37
Android,Integration,Pebble
---

A few weeks ago I wrote about transmitting images to Pebble Time from Android, as a quick and convenient way to open any image via an Intent and display it on the watch. At that time, I had problems sending some types of images, where only the blue channel appeared to make it across correctly. The only exception appeared to be the image bundled in the Android app's resources, which always displayed correctly.

After a getting and re-write of the flaky transmission system (and a bonus first-time working solution!), I now have the app in a state where any image opened with the Android app from a file manager will be resized to fit the Pebble screen and transmitted for display.

Now, the focus will be to enable cropping and scaling of the image in the Android app to let the user choose which part of the image to display (as a photo shown on the watch loses detail somewhat!). In the meantime, here are some images!

## Original Image (<a href="http://forum.kerbalspaceprogram.com/threads/113008-Riding-Asteroids">credit to gmiezis!</a>)

![](/assets/import/media/2015/04/11034411_954803447872213_3799211289901104533_o.jpg?w=212)

## Imported to the Android app

![](/assets/import/media/2015/04/screenshot_2015-04-19-17-45-46.png?w=576)

## Image on Pebble Time

![](/assets/import/media/2015/04/img_20150419_174608.jpg?w=660)
