---
id: 1173
title: New App: Watch App Selector
postDate: 2013-10-16 16:47:45
original: https://ninedof.wordpress.com/2013/10/16/new-app-watch-app-selector/
---

Every once in a while programming you get stuck on a problem and you think to yourself 'There must be an easier way to do this!', and most often you'll be right. It's just a case of casting around for another approach or thinking outside the box. In this case it was for a mini project I've been working on for some weeks, on and off. A single free app through which to distribute all my past and future Pebble watch apps and watch faces. I think it's been done before, but I like elegance of the idea. Problem was, I got stuck on how to best present all the apps.

My main vision was a <code>ListView</code>, but the templates for the individual item layouts were not quite right. So I looked around the internet for how to implement my own, and found conflicting, over-complex or wildly inaccurate resources on how to accomplish this. I left it to sit for a couple of weeks, as I was kept busy by other things, but then yesterday I made another attempt at it.

And as such also happens sometimes when programming, a  [single lead](http://www.vogella.com/articles/AndroidListView/article.html#adapterown_example) will take you all the way as you get swept up in the creative process for a several hour marathon. And the end result is this:
<h1>Watch App Selector</h1>
<p style="text-align:center;">![](http://ninedof.files.wordpress.com/2013/10/app_logo.png?w=300)</p>
<p style="text-align:left;">This is the first iteration on realizing the idea of a single app to distribute my watch apps and watch faces. It takes the form of a single list, with each app/face given its own title, summary and logo.</p>
<p style="text-align:left;">![](http://ninedof.files.wordpress.com/2013/10/shot1.png?w=180)When the user clicks on an item, they are taken to a details Activity with more fleshed out information, as well as applicable buttons for installing the apps.</p>
<p style="text-align:left;">![](http://ninedof.files.wordpress.com/2013/10/shot2.png?w=180)Thus, when I release some more watch apps/faces (got a couple of concepts in the works at the moment, just need to find the time), I will add them as a list item and release a new version of this app. Simple!</p>
<p style="text-align:left;">As always, I'm eager for any and all feedback.</p>
![](https://developer.android.com/images/brand/en_generic_rgb_wo_60.png)