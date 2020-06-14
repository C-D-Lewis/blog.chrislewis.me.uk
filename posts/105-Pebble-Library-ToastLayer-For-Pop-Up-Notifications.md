---
id: 2156
title: Pebble Library: ToastLayer For Pop Up Notifications
postDate: 2014-10-17 04:36:31
original: https://ninedof.wordpress.com/2014/10/17/pebble-library-toastlayer-for-pop-up-notifications/
---

A while ago I created a simple  [Alert Library](https://github.com/C-D-Lewis/pebble-alert-lib), which provides functions to show and hide a set of layers to show an 'alert window' for a time that tells the user of an event without changing Window.

![](/assets/media/2014/10/screenshot.png)

Continuing this theme, today I created another similar library called the  [ToastLayer](https://github.com/C-D-Lewis/ToastLayer), which has two advantages over the Alert Library:

1. The toast notification animates up from the bottom, instead of covering the majority of the Window.

2. It is designed as an object, like any of the other Layers in the Pebble SDK. This means there can be more than one!

Feel free to use it to show notifications without changing Window! I will probably look into including this in some of my existing apps.
