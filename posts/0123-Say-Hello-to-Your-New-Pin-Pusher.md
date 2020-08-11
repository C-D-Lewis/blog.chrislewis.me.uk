Say Hello to Your New Pin Pusher!
2016-09-11 13:48:25
Integration,JavaScript,Pebble,Raspberry Pi
---

<strong>Update: Added changed IP facility details.

## Update: Added status watchapp details.

Two of my Pebble apps push pins to the timeline to enhance their experience beyond the apps themselves:

• <a href="https://apps.getpebble.com/en_US/application/5387b383f60819963900000e">News Headlines</a> - Posts the top headline (if it's new) every four hours. Used to push notifications and serve decoded PNG images, but that went away. Maybe someday they will return. But not for now.

• <a href="https://apps.getpebble.com/en_US/application/529e8742d7894b189c000012">Tube Status</a> - Checks the TFL feed every five minutes, and pushes a pin if there is a change in the delay status. This can be a new delay, a delay that's ended, and 'all clear' (no delays anymore).

Both servers also respond to <code>GET /status</code> to show app users if they're up, and this has proved useful when they occasionally went down. Thanks for a 'do node index.js forever' loop script, this is very rarely now an issue.

Up until now, these pins were served from a $5 Digital Ocean instance which essentially spends 99.9% of its time doing absolutely nothing! After coming back to the UK and making progress towards cancelling subscriptions and emptying my US bank account, I had a better idea - use my dusty Raspberry Pi instead!

As part of my new job at EVRYTHNG, a natural avenue of exploration for getting to grips with the IoT is using a Raspberry Pi, which can run Node.js, as it turns out. Perfect! The pin servers for the two apps above use Node.js with Express.

So after a bit of code/dependency cleanup, I set up both servers on the Pi with <code>screen</code> and put plenty of stickers around warning against turning it off or rebooting the router.

So far, so good! What could go wrong?

![](/assets/import/media/2016/09/img_20160911_143438.jpg)
<p style="text-align:center;">The new 'Pin Pusher' Raspberry Pi in its native habitat - under the family computer desk.</p>
<p style="text-align:left;"><strong>Followup: Getting a Changed Router IP while Out the House</strong></p>
<p style="text-align:left;">In the eventuality that I have to update the IP of the family router for apps to use in their status check (otherwise they think the servers have gone down, bad for users!), I used to have a Python script email me its own IP address. Sadly, Google doesn't like this unauthenticated use of my GMail account, so I devised an alternative.</p>
<p style="text-align:left;">I set up my Pi as an EVRYTHNG Thng, gave it an 'ip' property, and wrote the following Python script to update this property in the EVRYTHNG cloud when it boots up. This way, all I have to do is ask whoever's in to reboot the Pi, and then wait for the updated IP address! I may also make it run periodically to cover the 'router randomly restarted' scenario.</p>
<!-- language="python" -->
<pre><div class="code-block">

#!/usr/bin/python

import requests
import socket
import fcntl
import struct
import json

user_api_key = "<key>" # Probably shouldn't publish this!
thng_id = "<id>"

def get_ip_address(ifname):
  r = requests.get("http://www.canyouseeme.org")
  spool = r.text
  start_str = "name=\"IP\" value=\""
  start_index = spool.index(start_str) + len(start_str)
  spool = spool[start_index:]
  end_index = spool.index("/>") - 1
  return spool[:end_index]

def main():
  ip = get_ip_address("eth0")
  print("IP: {}".format(ip))

  headers = {
    "Authorization": user_api_key,
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  payload = [{
    "value": ip
  }]
  r = requests.put("https://api.evrythng.com/thngs/{}/properties/ip".format(thng_id), headers=headers, data=json.dumps(payload))
  res = r.text
  print(res)

main()

</div></pre>

## Followup: Checking Status Conveniently

Each of the two apps mentioned above have a built-in server monitoring feature in their settings screens, but that's a lot of scrolling. To put my mind at ease I have also created a simple monitoring app that uses the same backend mechanism:

![](/assets/import/media/2016/09/img_20160911_225459.jpg)
