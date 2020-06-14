---
index: 139
title: FitBit Development - Round 3
postDate: 2020-03-08 15:52:29
original: https://ninedof.wordpress.com/2020/03/08/fitbit-development-round-3/
---

It's been a while since the last post! I guess that's what happens when you go even deeper into your hobby as your job... I now work on frontend and backend projects and services instead of writing documentation for those at EVRYTHNG, and it's just about as varied, challenging, and rewarding as I expected, which is great. I've been working with many new libraries and technologies including:


 	- React with React Redux
 	- React Native (to a small degree)
 	- Terraform and continuous integration services such as Circle CI pipelines.
 	- MongoDB


I've also continued to implement a collaborative approach to EVRYTHNG's open REST API (beyond [writing the documentation](https://developers.evrythng.com/docs)) with use of [OpenAPI 3.0 spec files](https://github.com/evrythng/openapi) and tools to generate documentation in the same identical style to what I'd arrived at in the first year and a half curating it by hand. It's really neat to be able to version and review changes to spec files, then magically generate the same level of quality technical documentation instead of one person writing it all by hand. And of course, contributions to EVRYTHNG's [SDKs](https://github.com/evrythng/evrythng.js) and [open-source tools](https://github.com/evrythng/evrythng-cli).

## FitBit Development

In the meantime, I've only been sparsely developing software as a hobby, and mostly for the ever-evolving [node-microservices](https://github.com/c-d-lewis/node-microservices) project, and keeping my FitBit apps up to date as new devices and features are added to the FitBit ecosystem. As a result, all apps and faces are available for all devices, and as of yesterday I've finally started experimenting with the new Always on Display mode available to SDK based apps. Getting closer and closer to Pebble-like functionality!

In fact, you can [search for my name](https://gallery.fitbit.com/search?terms=chris%20lewis) to see all of those on offer:

![](/assets/media/2020/03/fitbit-round-3.png)

## Pebble Development (!?)

In other developments, changes (once again) to Google's developer program policies meant I had to dust off the codebase for Dashboard to push an update to remove the donation button. Unfortunately this meant that it had to be upgraded to a much newer SDK version. Which meant that extra measures had to be taken to continue to not be killed in the background. Luckily due to the code being open source I had some help. It's nice to see that app in action again after so long away from it:

![](/assets/media/2020/03/img_20200204_210524.jpg)

That's all for now, hopefully more projects and FitBit apps to come. I'd like to try and do something interesting and a bit different using the Versa 2's gorgeous color OLED display...
