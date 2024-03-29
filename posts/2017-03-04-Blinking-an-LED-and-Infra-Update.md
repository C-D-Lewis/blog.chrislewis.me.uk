Blinking an LED & Infra Update
2017-03-04 22:21:45
Integration,JavaScript,Pebble,Raspberry Pi
---

For some just beginning their programming journeys a common example to conquer is blinking an LED, which usually goes something like this:

```c
digitalWrite(13, HIGH);
delay(1000);
digitalWrite(13, LOW);
```

For me, I decided to try a much harder approach, in a fiddly effort that could be regarded as virtually pointless. Nevertheless, I persisted, because I thought it would be cool.

## The idea</strong>: blink a Blinkt LED on Server Pi whenever it serviced a request from the outside.

For those unfamiliar with my little family of Raspberry Pi minions, here is a brief overview:

 • <a href="https://twitter.com/Chris_DL/status/836336013790298112">Server Pi</a> - A Raspberry Pi 3 running three Node.js processes for various Pebble apps (News Headlines pin pusher, Tube Status pin pusher, unreleased notification and discovery service).

 • Backlight Pi - Another Raspberry Pi 3 with a single Node.js Express server that allows any device in the house to HTTP POST a colour to be shown behind my PC.

 • <a href="https://twitter.com/Chris_DL/status/806750464322568193">Monitor Pi</a> - A Raspberry Pi Zero W (W, as of today) that pings the three processes running on Server Pi <em>via</em> the GitHub Gist discovery mechanism to give me peace of mind that they're still up. It also checks the weather for ice and rain, and whether or not Greater Anglia have fallen over before I've taken the trouble of leaving for work at 7AM.

Maintaining this small fleet is a joy and a curse (one or both of "my own mini infrastructure, yay!" or  "It's all fallen over because Node exceptions are weird, noo!"), but since I started versioning it all in Git and adding crontab and boot scripts, it's become a lot easier. However, for this particular task, I found only one process can usefully control the Blinkt LEDs on top of Server Pi. Since this is a parameterised (services only) instance of Monitor Pi, it must be this process that does the blinking when a request is processed.

Since I'm already a big fan of modular Node.js apps, I just added another module that sets up a single-endpoint Express server, and have each of the other three Server Pi processes POST to it whenever they service a request with their own Express servers. Neat!

An hour of synchronising and testing four processes locally and on-device later, and I now have a blue blinking LED whenever a request is serviced. Sadly the activity isn't as high as it was in the News Headlines heyday when it was tasked with converting news story images to Pebble-friendly 64 colour thumbnails and an experimental analytics service late last year, but with the interesting tentative steps the unreleased notification service is taking, Server Pi may end up seeing a bit more action than simple status checks and app news lookups in the future.

With all this work done, it's also time for <a href="https://ninedof.wordpress.com/2016/12/03/map-of-pebble-services-architecture/">another </a>diagrammatic mess that I like to call my infrastructure...

![](/assets/import/media/2017/03/services-architecture-march-20173.png)
