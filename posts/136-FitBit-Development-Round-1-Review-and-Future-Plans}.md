---
index: 136
title: FitBit Development - Round 1 Review and Future Plans
postDate: 2018-03-30 17:15:56
original: https://ninedof.wordpress.com/2018/03/30/fitbit-development-round-1-review-and-future-plans/
---

![](/assets/media/2018/03/fitbit-round-1-banner.png)

After some months and a couple of releases for the FitBit Ionic a few months ago, here are the first batch of watchfaces and app for both Ionic and the new Versa! Reviewed and released right now are:


	- Elemental - An original watchface, and my first completed for Ionic.
	- Tube Status - Ported from Pebble, but with an updated pager UI,
	- Isotime - Ported from Pebble, with higher resolution digits, though sadly no longer rendered in individual blocks with [PGE](https://github.com/C-D-Lewis/pge).
	- Beam Up - Ported from Pebble, the classic (and one of my oldest!) animated watchface, complete with inverting beams (but this time faked with clever timings, instead of using an inverter layer or framebuffer hack.


The development experience has gotten much better, with very good connectivity of the developer connection with the updates paving the way for Versa, and also due to the [FitBit OS Simulator](https://dev.fitbit.com/blog/2018-03-13-announcing-fitbit-os-2.0-and-simulator/), which closes the iterative gap from minutes to seconds!

So what's next?

 [News Headlines](https://apps.getpebble.com/en_US/application/5387b383f60819963900000e) port needs to be completed, though getting the same UI as the Pebble app is proving to be a layout challenge. So I may opt to scrap it and build a new one, similar for Tube Status.

I also want to create some more original watchfaces for FitBit OS to take advantage of the gorgeous full-color screens these watches have. So look out for more!

I'd also love to port [Dashboard](https://apps.getpebble.com/en_US/application/53ec8d840c3036447e000109) (as I still use it regularly, and many have found it an invaluable remote and automation agent), but that will have to wait until an equivalent of [PebbleKit Android](https://developer.pebble.com/guides/communication/using-pebblekit-android/) is released by FitBit, or some other Intent-based mechanism for receiving app messages in a third party Android app.

In the meantime, you can find the source for all my FitBit OS apps and watchfaces in my [fitbit-dev GitHub repo](https://github.com/C-D-Lewis/fitbit-dev).
