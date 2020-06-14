---
id: 1237
title: Watch Trigger (& +) Updated to SDK 2.0
postDate: 2013-11-10 00:36:23
original: https://ninedof.wordpress.com/2013/11/10/watch-trigger-updated-to-sdk-2-0/
---

If you're a user of my  [Watch Trigger](http://ninedof.wordpress.com/2013/09/13/watch-trigger-1-9-biggest-update-yet/) or  [Watch Trigger +](http://ninedof.wordpress.com/2013/09/22/watch-trigger-for-pebble-initial-release/) Pebble watch apps and also love the newest watch firmware, do not despair: They are both now 2.0 compatible!

The main thing about converting apps to the new SDK is that it is not hard, just time consuming. <code>_init()</code> calls are replaced by pointer-ifying the implicit argument and <code>_create()</code> instead. Also some structs are changed, such as <code>BmpContainer</code> to a <code>BitmapLayer</code> and <code>GBitmap</code>. It's also much easier to manage layers, with <code>window_get_root_layer()</code> replacing <code>&amp;window-&gt;layer.layer</code> for example.

I switched from <code>AppSync</code> to AppMessage as the new implementation was more clean and seems to work quite well.

The only other main difference is that both versions of the Android app work with just one watch app for simplicity. Existing users who have upgraded to the beta 2.0 firmware will need to go to Settings and re-install the appropriate watch-app.

So without further ado, go ahead and dive in! If you have any issues, please let me know!

## Download![](https://developer.android.com/images/brand/en_generic_rgb_wo_60.png)

## Download (+)![](https://developer.android.com/images/brand/en_generic_rgb_wo_60.png)