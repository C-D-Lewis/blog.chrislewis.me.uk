---
id: 193
title: Multi-Client Server
postDate: 2013-04-12 01:24:04
original: https://ninedof.wordpress.com/2013/04/12/multi-client-server/
---

Working on the server software some more, with some help from a friend, it now accepts up to an arbitrary (currently 10) connections, each one handled in its own thread. When the server manager gets a new connection, it passes the <code>Socket</code> to the new thread, which then handles all the I/O for that connection. When that client disconnects, it sets a 'in use' flag, which the server manager can then use to re-allocate it if all the other threads are busy. 

Here's a demo image! I'll also release some source code for this stage, as a simple proof of concept before it gets too much more complicated. 

![](http://ninedof.files.wordpress.com/2013/04/multiclient.png?w=545)

The next step is to set up server sending messages from one client to another, and become a real server! At the moment its just a listener...

Here's a  [link](https://www.dropbox.com/s/br5dldu1rqrejz2/Server%20and%20Client.zip) to the source code.
