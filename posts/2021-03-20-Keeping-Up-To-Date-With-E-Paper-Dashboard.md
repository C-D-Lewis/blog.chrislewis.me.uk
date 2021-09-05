Keeping Up To Date With E-Paper Dashboard
2021-03-20 17:11
Python,Integration,Raspberry Pi
---

A project that caught my eye a long time ago was the
[magic mirror](https://magicmirror.builders/) - using one-way mirror-like
material over an LCD panel extracted from a PC monitor to show white text and
icons glowing over your reflection. Typical uses included weather, email, news,
agenda, etc to view at a glance while getting dressed or while passing by.

I liked this project, except for two key aspects:

- Most solutions were either entirely pre-packaged, or required fiddling about
  with sealed monitors units and their bespoke driver boards and large power
  supplies.

- I'm generally averse to looking at myself in the mirror beyond my morning
  routine.

Then, a month or so ago I saw a twist on this idea that replaced the LCD display
and one-way mirror material with an old friend - an e-paper display. The desire
to make one of these became real when I saw a project that put the display
inside a wooden picture frame - a housing and stand in one! They even hid the
Raspberry pi (obligatory at this point) round the back on the fold out stand.

So I bought a 7.5 inch e-paper display (complete with driver HAT for Raspberry
Pi), a frame, and yet another Raspberry Pi Zero W and got to work. A few days
pixel-pushing and Googling how to do the simplest fetch/file/drawing tasks in
Python the result is the imaginatively named
[e-paper-dashboard](https://github.com/C-D-Lewis/e-paper-dashboard)!

![](assets/media/2021/03/e-paper-frame.jpg)

## Features

By default, the main widgets are as follows:

- Date and time

- Current weather conditions (icon, temperature, day high/low, chance of rain
  and current wind speed).

- Icon and status of two UK rail companies I (usually) regularly use

- Amount and daily change in Bitcoin and Ethereum cryptocurrencies, adjusted for
  the amount I actually own.

The remaining third of the display on the right is a set of pages that rotate
once a minute, progress through the set denoted with a line of paging dots:

- Five day weather forecast (icon, high/low, chance of rain, wind speed)

- Five news stories from BBC News from a configurable category of news.

- The most recent tweet (name, icon, text, likes, replies, time) from a
  configurable Twitter account.

Here's another image showing the news in Technology today:

![](assets/media/2021/03/e-paper-news.jpg)

And the current most recent tweet from a chosen novely account
([@PicardTips](https://twitter.com/PicardTips)):

![](assets/media/2021/03/e-paper-picard.jpg)

And of course, the reverse side is less glamorous, but still fairly neatly
organised:

![](assets/media/2021/03/e-paper-reverse.jpg)

## Python!?

Yes, keen-eyed readers will note that this project does not use JavaScript at
all. The kind folks at Waveshare provided a Python library to drive the display
and I'm not petty enough to wrap a whole bunch of slow text, shape, and image
drawing routines in JavaScript for the sake it.

I actually really enjoy using Python, but rarely need to. Indeed, the first
version of
[node-microservices](https://github.com/c-d-lewis/node-microservices) was a
single-file Python script that monitored weather and rail delays. Things seem
to have come full circle...

So, this is a good opportunity to dust my basic Python off and maybe learn a few
more new things in the process.

## Overview

The general structure of the project is a core loop that redraws the display
once per minute (on the minute), and updates all the widgets' data sources
in a configurable interval, currently 15 minutes.

Each widget has an <code>update_data()</code> function that implements this
fetch and processing of new data and a <code>draw()</code> function that is
passed the <code>Image</code> and <code>ImageDraw</code> from the PIL library
to write it's information to the overall canvas.

Once this is done for all widgets, the finished rendered image is pushed to the
display, which takes about five seconds to fully refresh, which is acceptable
for a passive use-case such as this.

In addition, each widget file can make use of the many helper files for tasks
such as accessing configuration, drawing helpers, drawing images, using fonts,
and fetching text or JSON from the internet.

## Configuration

Most widgets require some configuration value or secrets to work, and these are
read from a local <code>config.json</code> file, an example of which fields are
used is included in the repository. These values are detailed in the project
[README.md](https://github.com/C-D-Lewis/e-paper-dashboard/blob/main/README.md#configuration)
file, but include:

- API keys for Nomics and Darksky APIs.

- Latitude and longitude for weather forecast fetching.

- Amount of Bitcoin and Ethereum owned, so that the market rate value can be
  adjusted to show a more relvant piece of information (usually a more tangible
  amount lost than gained!)

## Testing

It's slow to continuously <code>rsync</code> or <code>git push</code> changes
and wait for fetch and display refresh, so I implemented a compatibility layer
to allow testing on non-ARM devices. If run on a Mac, for instance, the display
image rendered is saved to a file for easy inspection. Starting and stopping
the display is also taken care of:

```python
RUNNING_ON_PI = 'arm' in platform.machine()

# Initialise the display
def init_display():
  if RUNNING_ON_PI:
    epd.init()
  else:
    print('[TEST] epd.init()')

# Handle updating the display
def update_display(image):
  if RUNNING_ON_PI:
    epd.display(epd.getbuffer(image))
  else:
    image.save('render.png')
    print('[TEST] epd.display()')

# Handle sleeping the display
def sleep_display():
  if RUNNING_ON_PI:
    epd.sleep()
  else:
    print('[TEST] epd.sleep()')
```

## Conclusion

So there it is - idea realized in a fairly nicely presented and useful
at-a-glance final result. And of course it can be adjusted in the future - the
concept of paginating the right hand side allows much more to be added in the
future with the same amount of real estage.

Check out the
[project repository](https://github.com/C-D-Lewis/e-paper-dashboard) for all the
code and documentation in case you want to run it yourself.

![](assets/media/2021/03/e-paper-hello.jpg)