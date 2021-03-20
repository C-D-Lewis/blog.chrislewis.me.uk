Keeping Up To Date With E-Paper Frame
2021-03-20 17:11
Python,Integration,Raspberry Pi
---

A project that caught my eye a long time ago was the
[magic mirror](https://magicmirror.builders/) - using one-way mirror-like
material over an LCD panel extracted from a PC monitor to show white text and
icons glowing over your reflection. Typical uses included weather, email, news,
agenda, etc to view at a glance while getting dressed or while passing by.

I liked this project, except for two key aspects:

1. Most solutions were either entirely pre-packaged, or required fiddling about
   with sealed monitors units and their bespoke driver boards and large power
   supplies.

2. I'm generally averse to looking at myself in the mirror beyond my morning
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
[e-paper frame](https://github.com/C-D-Lewis/e-paper-frame)!

![](assets/media/2021/03/e-paper-frame.jpg)

## Features

By default, the main widgets are as follows:

- Date and time

- Current weather conditions (icon, temperature, day high/low, chance of rain and current wind speed).

- Icon and status of two UK rail companies I (usually) regularly use

- Amount and daily change in Bitcoin and Ethereum cryptocurrencies, adjusted for the amount I actually own.

The remaining third of the display on the right is a set of pages that rotate
once a minute:

- Five day weather forecast (icon, high/low, chance of rain, wind speed)

- Five news stories from BBC News from a configurable category of news.

- The most recent tweet (name, icon, text, likes, replies, time) from a configurable Twitter account.

Here's another image showing the news in Technology today:

![](assets/media/2021/03/e-paper-news.jpg)

And the current most recent tweet from a chosen novely account
([@PicardTips](https://twitter.com/PicardTips)):

![](assets/media/2021/03/e-paper-picard.jpg)

## Python?

<!-- language="python" -->
<pre><div class="code-block">
# Initialise the display
def init_display():
  if RUNNING_ON_PI:
    epd.init()
  else:
    print('[TEST] epd.init()')
</div></pre>

## Conclusion

Text
