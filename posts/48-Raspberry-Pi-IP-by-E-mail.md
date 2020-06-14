---
id: 1136
title: Raspberry Pi: IP by E-mail
postDate: 2013-09-28 00:01:38
original: https://ninedof.wordpress.com/2013/09/28/raspberry-pi-ip-by-e-mail/
---

I  [wrote a while ago](http://ninedof.wordpress.com/2013/07/13/raspberry-pi-ip-address-to-lcd-display/) about a mechanism to locate and connect to a  [headless](http://en.wikipedia.org/wiki/Headless_computer) Raspberry Pi over Ethernet using an LCD display and some start-up code.

Well today I broke it while preparing to move house (and use it in it's intended situation!), which was bad news. Listen to your GND markings, people!

But a moment's search for a replacement strategy yielded another idea. Nothing original by any means, but something new to my programming adventures thus far: Get the IP address by e-mail on boot!

Looking at a Raspberry Pi as it boots you will see the Ethernet port is initialized pretty early on in the boot procedure. A quick Google search revealed the existence of the ' [smtplib](http://docs.python.org/2/library/smtplib.html)' module included with Python, which I leveraged to make this happen. Here is the final code (get_ip_address() found  [here](code.activestate.com/recipes/439094-get-the-ip-address-associated-with-a-network-inter/)):

[code language="python"]
import smtplib
import struct
import socket
import fcntl

msg = &quot;From RPi Python&quot;

def get_ip_address(ifname):
	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	return socket.inet_ntoa(fcntl.ioctl(
		s.fileno(), 0x8915, # SIOCGIFADDR
		struct.pack('256s', ifname[:15])
	)[20:24])

fromaddr = &lt;from address&gt;
toaddr = &lt;to address&gt;

msg = &quot;&quot;&quot;RPi IP is  %s&quot;&quot;&quot; % get_ip_address('eth0')

username = &lt;username&gt;
password = &lt;password&gt;

print(&quot;Sending IP: %s to %s&quot; % (get_ip_address('eth0'), toaddr))

print(&quot;Opening connection...&quot;)
server = smtplib.SMTP('smtp.gmail.com:587')
server.ehlo()
server.starttls()
server.ehlo()

print(&quot;Logging in...&quot;)
server.login(username, password)

print(&quot;Sending message: %s&quot; % msg)
server.sendmail(fromaddr, toaddr, msg)

print(&quot;Closing connection...&quot;)
server.close()

print(&quot;Sent.&quot;)
[/code]

The next step is to make it run on boot, which only involved writing this script (called ipmailboot.sh):

[code language="python"]
#!/usr/bin/python

sudo python ~/python/ipmail.py
[/code]

Then changing the permissions for execution:

[code language="python"]
 sudo chmod 755 ipmailboot.sh
 [/code]

And then registering it to run on boot using <code>update-rc.d ipmailboot.sh defaults</code>.

So, nothing revolutionary, but when I move house and find the router is nowhere near a TV, all I'll have to do is connect it to the network with an Ethernet cable, power on and wait for the email to arrive (on my Pebble watch, no less!)
