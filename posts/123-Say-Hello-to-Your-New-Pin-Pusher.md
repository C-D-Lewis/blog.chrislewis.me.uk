---
index: 123
title: Say Hello to Your New Pin Pusher!
postDate: 2016-09-11 13:48:25
original: https://ninedof.wordpress.com/2016/09/11/say-hello-to-your-new-pin-pusher/
---

Update: Added changed IP facility details.

## Update: Added status watchapp details.

Two of my Pebble apps push pins to the timeline to enhance their experience beyond the apps themselves:


	- [News Headlines](https://apps.getpebble.com/en_US/application/5387b383f60819963900000e) - Posts the top headline (if it's new) every four hours. Used to push notifications and serve decoded PNG images, but that went away. Maybe someday they will return. But not for now.
	- [Tube Status](https://apps.getpebble.com/en_US/application/529e8742d7894b189c000012) - Checks the TFL feed every five minutes, and pushes a pin if there is a change in the delay status. This can be a new delay, a delay that's ended, and 'all clear' (no delays anymore).


Both servers also respond to <code>GET /status</code> to show app users if they're up, and this has proved useful when they occasionally went down. Thanks for a 'do node index.js forever' loop script, this is very rarely now an issue.

Up until now, these pins were served from a $5 Digital Ocean instance which essentially spends 99.9% of its time doing absolutely nothing! After coming back to the UK and making progress towards cancelling subscriptions and emptying my US bank account, I had a better idea - use my dusty Raspberry Pi instead!

As part of my new job at EVRYTHNG, a natural avenue of exploration for getting to grips with the IoT is using a Raspberry Pi, which can run Node.js, as it turns out. Perfect! The pin servers for the two apps above use Node.js with Express.

So after a bit of code/dependency cleanup, I set up both servers on the Pi with <code>screen</code> and put plenty of stickers around warning against turning it off or rebooting the router.

So far, so good! What could go wrong?

<img class="alignnone size-full wp-image-2397" src="https://ninedof.files.wordpress.com/2016/09/img_20160911_143438.jpg" alt="img_20160911_143438" width="4000" height="2992" />
<p style="text-align:center;">The new 'Pin Pusher' Raspberry Pi in its native habitat - under the family computer desk.</p>
<p style="text-align:left;">Followup: Getting a Changed Router IP while Out the House</p>
<p style="text-align:left;">In the eventuality that I have to update the IP of the family router for apps to use in their status check (otherwise they think the servers have gone down, bad for users!), I used to have a Python script email me its own IP address. Sadly, Google doesn't like this unauthenticated use of my GMail account, so I devised an alternative.</p>
<p style="text-align:left;">I set up my Pi as an EVRYTHNG Thng, gave it an 'ip' property, and wrote the following Python script to update this property in the EVRYTHNG cloud when it boots up. This way, all I have to do is ask whoever's in to reboot the Pi, and then wait for the updated IP address! I may also make it run periodically to cover the 'router randomly restarted' scenario.</p>
[code language="python"]

#!/usr/bin/python

import requests
import socket
import fcntl
import struct
import json

user_api_key = &quot;&lt;key&gt;&quot; # Probably shouldn't publish this!
thng_id = &quot;&lt;id&gt;&quot;

def get_ip_address(ifname):
  r = requests.get(&quot;http://www.canyouseeme.org&quot;)
  spool = r.text
  start_str = &quot;name=\&quot;IP\&quot; value=\&quot;&quot;
  start_index = spool.index(start_str) + len(start_str)
  spool = spool[start_index:]
  end_index = spool.index(&quot;/&gt;&quot;) - 1
  return spool[:end_index]

def main():
  ip = get_ip_address(&quot;eth0&quot;)
  print(&quot;IP: {}&quot;.format(ip))

  headers = {
    &quot;Authorization&quot;: user_api_key,
    &quot;Content-Type&quot;: &quot;application/json&quot;,
    &quot;Accept&quot;: &quot;application/json&quot;
  }
  payload = [{
    &quot;value&quot;: ip
  }]
  r = requests.put(&quot;https://api.evrythng.com/thngs/{}/properties/ip&quot;.format(thng_id), headers=headers, data=json.dumps(payload))
  res = r.text
  print(res)

main()

[/code]

## Followup: Checking Status Conveniently

Each of the two apps mentioned above have a built-in server monitoring feature in their settings screens, but that's a lot of scrolling. To put my mind at ease I have also created a simple monitoring app that uses the same backend mechanism:

<img class="alignnone size-full wp-image-2410" src="https://ninedof.files.wordpress.com/2016/09/img_20160911_225459.jpg" alt="img_20160911_225459" width="4000" height="2992" />
