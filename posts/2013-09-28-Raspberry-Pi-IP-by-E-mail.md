Raspberry Pi: IP by E-mail
2013-09-28 00:01:38
Raspberry Pi
---

I <a title="Raspberry Pi: IP Address to LCD Display" href="http://ninedof.wordpress.com/2013/07/13/raspberry-pi-ip-address-to-lcd-display/">wrote a while ago</a> about a mechanism to locate and connect to a <a title="Wikipedia - Headless" href="http://en.wikipedia.org/wiki/Headless_computer">headless</a> Raspberry Pi over Ethernet using an LCD display and some start-up code.

Well today I broke it while preparing to move house (and use it in it's intended situation!), which was bad news. Listen to your GND markings, people!

But a moment's search for a replacement strategy yielded another idea. Nothing original by any means, but something new to my programming adventures thus far: Get the IP address by e-mail on boot!

Looking at a Raspberry Pi as it boots you will see the Ethernet port is initialized pretty early on in the boot procedure. A quick Google search revealed the existence of the '<a title="Python 2.7 SMTPLib" href="http://docs.python.org/2/library/smtplib.html">smtplib</a>' module included with Python, which I leveraged to make this happen. Here is the final code (get_ip_address() found <a title="Get IP Address" href="code.activestate.com/recipes/439094-get-the-ip-address-associated-with-a-network-inter/">here</a>):

<!-- language="python" -->
<pre><div class="code-block">
import smtplib
import struct
import socket
import fcntl

msg = "From RPi Python"

def get_ip_address(ifname):
  s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
  return socket.inet_ntoa(fcntl.ioctl(
    s.fileno(), 0x8915, # SIOCGIFADDR
    struct.pack('256s', ifname[:15])
  )[20:24])

fromaddr = <from address>
toaddr = <to address>

msg = """RPi IP is  %s""" % get_ip_address('eth0')

username = <username>
password = 

print("Sending IP: %s to %s" % (get_ip_address('eth0'), toaddr))

print("Opening connection...")
server = smtplib.SMTP('smtp.gmail.com:587')
server.ehlo()
server.starttls()
server.ehlo()

print("Logging in...")
server.login(username, password)

print("Sending message: %s" % msg)
server.sendmail(fromaddr, toaddr, msg)

print("Closing connection...")
server.close()

print("Sent.")
</div></pre>

The next step is to make it run on boot, which only involved writing this script (called ipmailboot.sh):

<!-- language="python" -->
<pre><div class="code-block">
#!/usr/bin/python

sudo python ~/python/ipmail.py
</div></pre>

Then changing the permissions for execution:

<!-- language="python" -->
<pre><div class="code-block">
 sudo chmod 755 ipmailboot.sh
 </div></pre>

And then registering it to run on boot using <code>update-rc.d ipmailboot.sh defaults</code>.

So, nothing revolutionary, but when I move house and find the router is nowhere near a TV, all I'll have to do is connect it to the network with an Ethernet cable, power on and wait for the email to arrive (on my Pebble watch, no less!)
