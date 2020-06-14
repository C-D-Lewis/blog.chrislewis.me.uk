---
index: 37
title: Raspberry Pi: IP Address to LCD Display
postDate: 2013-07-13 17:30:18
original: https://ninedof.wordpress.com/2013/07/13/raspberry-pi-ip-address-to-lcd-display/
---

So a few days ago I acquired a Raspberry Pi. This amazing board is a SoC (System on a Chip) that runs a version of Debian Linux called Raspbian. Since then I've been poking around and finding out how to do my favourite useful stuff (networking, Arduino etc), aided in a way by the basic knowledge of Linux commands obtained from dabbling in Ubuntu.

After learning how to send and receive data on a network with Python, and controlling the GPIO pins in the same way as Arduino using [wiringPi](https://projects.drogon.net/raspberry-pi/wiringpi/), I decided to try and find a project to complete.

As I've said to people before when they ask me about leaning to program, a good motivator to learn new features and possibilities of a language is to set a small goal that is just out of reach. For example, say you'd learned enough Java to know how an object is constructed, data stored inside and methods called from it, the stretch goal might be to use a simple object provided by someone else.

In this spirit I decided to use a combination of Python, wiringPi and scripts to solve a problem I might have had in the near future. Using SSH, I can connect to and command the Pi from another computer, eliminating the need for a mouse, keyboard, HDMI display etc, leaving just ethernet and power connected. In order to do this, I need to know the Pi's IP address. This piece of information is presented to the user when the board is booted, on either the RCA or HDMI display outputs.

The difficulty here is that the first time the Pi is connected, the IP address it is given will be pseudo-random, and unknown.

But what if you don't have a TV or monitor in reach? When I move house in a few weeks time, what if the router is too far from the TV? I won't be able to use this method to get the IP. I could connect to the Wi-Fi gateway, but that relies on the service provider implementing a mechanism for doing so, which I can't rely upon.

This brings us back to finding a project to do. [As I've posted on this very blog](http://ninedof.wordpress.com/2013/05/22/java-to-arduino-lcd-output/), I managed to use an Arduino to show short messages on a standard LCD display, using the LiquidCrystal library. Why not use this display to show the IP address? No TV needed!

As I quickly found, the LiquidCrystal library didn't appear to be included in wiringPi. Luckily, the author had implemented their own version, the lcd.h header file, with similar functions. So, after making the requisite connections between the boards, and being careful to note these for later use, I had a simple C file that sends a string to the LCD display, when presented as an argument from the terminal. If the argument is too long ( &gt; 16 characters), it is not accepted, and the display instead shows "Too long!". If it is between 8 and 16 characters, then it is copied into two buffers each 8 characters in size, then displayed alternately.

Once this was done, I wrote a Python script ( [with help from here](http://raspberrypi.stackexchange.com/questions/6714/how-to-get-the-raspberry-pis-ip-address-for-ssh)) that determined the IP address, and then called the compiled executable that took the address as the argument and send it to the LCD display.

So far so good. But the main purpose of this exercise was to get around the combined problem of not knowing the IP address assigned by DHCP when the Pi is first introduced to a LAN, and having to TV guaranteed to be within reach. The final step therefore was to have the Python script run on boot. The final process is summed up below:
<ol>
	- Boot script /etc/rc.local executes the Python script.
	- The Python script in turn finds the IP address and calls the LCD executable, supplying the address as an argument.
	- The LCD executable sends the IP address to the LCD display
	- I use the IP address now visible to the world to connect using SSH, saving it for later use in the process.
</ol>
I think that's mission accomplished! Here is a photo of the finished system in action:

![](http://ninedof.files.wordpress.com/2013/07/ip-cutout.png)As is usual for this type of post, [you can find the C and Python source files, as well as a built C executable here](https://www.dropbox.com/s/flvkhkzwh7iyfpa/RPi%20IP%20to%20LCD.zip). The LCD display pin map is included as a comment in the C file. The Raspberry Pi pins used by the wiringPi library [can be found here](https://projects.drogon.net/raspberry-pi/wiringpi/pins/).
