---
index: 9
title: Java Networking
postDate: 2013-04-10 20:43:47
original: https://ninedof.wordpress.com/2013/04/10/java-networking/
---

The next step in any game development methodology is investigating networked games, ones that run on multiple computers and communicate to coordinate a shared experience for players. To this end, I started looking into <code>java.net</code> for communicating in Java program. This yielded good results, and after about an hour of tinkering, I can show the fruits of this surprisingly easy labor:

![](http://ninedof.files.wordpress.com/2013/04/server.png?w=545)

Eagle eyed readers will be able to figure out the chronology of events. Simply, its a brief back and forth, with me entering commands in the bottom window, and the server program on top reporting the reception of these commands. The client also shows the time taken for the round trip. I have tested this on another computer in my local network and it works! 

Next step, a networked game! But first I think I should clean up the format of the messages here, as it maybe a tad confusing...
