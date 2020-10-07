FitBit Development - Round 3
2020-03-08 15:52:29
Android,FitBit,Pebble
---

It's been a while since the last post! I guess that's what happens when you go even deeper into your hobby as your job... I now work on frontend and backend projects and services instead of writing documentation for those at EVRYTHNG, and it's just about as varied, challenging, and rewarding as I expected, which is great. I've been working with many new libraries and technologies including:

 • React with React Redux

 • React Native (to a small degree)

 • Terraform and continuous integration services such as Circle CI pipelines.

 • MongoDB

I've also continued to implement a collaborative approach to EVRYTHNG's open REST API (beyond <a href="https://developers.evrythng.com/docs">writing the documentation</a>) with use of <a href="https://github.com/evrythng/openapi">OpenAPI 3.0 spec files</a> and tools to generate documentation in the same identical style to what I'd arrived at in the first year and a half curating it by hand. It's really neat to be able to version and review changes to spec files, then magically generate the same level of quality technical documentation instead of one person writing it all by hand. And of course, contributions to EVRYTHNG's <a href="https://github.com/evrythng/evrythng.js">SDKs</a> and <a href="https://github.com/evrythng/evrythng-cli">open-source tools</a>.

## FitBit Development

In the meantime, I've only been sparsely developing software as a hobby, and mostly for the ever-evolving <a href="https://github.com/c-d-lewis/node-microservices">node-microservices</a> project, and keeping my FitBit apps up to date as new devices and features are added to the FitBit ecosystem. As a result, all apps and faces are available for all devices, and as of yesterday I've finally started experimenting with the new Always on Display mode available to SDK based apps. Getting closer and closer to Pebble-like functionality!

In fact, you can <a href="https://gallery.fitbit.com/search?terms=chris%20lewis">search for my name</a> to see all of those on offer:

![](/assets/import/media/2020/03/fitbit-round-3.png)

## Pebble Development (!?)

In other developments, changes (once again) to Google's developer program policies meant I had to dust off the codebase for Dashboard to push an update to remove the donation button. Unfortunately this meant that it had to be upgraded to a much newer SDK version. Which meant that extra measures had to be taken to continue to not be killed in the background. Luckily due to the code being open source I had some help. It's nice to see that app in action again after so long away from it:

![](/assets/import/media/2020/03/img_20200204_210524.jpg)

That's all for now, hopefully more projects and FitBit apps to come. I'd like to try and do something interesting and a bit different using the Versa 2's gorgeous color OLED display...
