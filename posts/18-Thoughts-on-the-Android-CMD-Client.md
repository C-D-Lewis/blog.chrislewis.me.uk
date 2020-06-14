---
index: 18
title: Thoughts on the Android CMD Client
postDate: 2013-05-03 15:33:27
original: https://ninedof.wordpress.com/2013/05/03/thoughts-on-the-android-cmd-client/
---

Since creating the client and server (detailed in the last post) I have made a few observations. Firstly, there was no security whatsoever. This means that if someone who had compiled the source code I released an knew my Internet IP address and when the server was up could have in theory obliterated my PC!

So for now I have put in a check using certain hardware characteristics of the incoming connection's device against known values for my own phone. Thus in theory, only my phone can now use the server. I'll verify this behavior once I get a hold of another device from a friend in the coming days.

Also, issuing the command <code>'cmd'</code> appeared to be the only command that did nothing, but after a few button presses on the phone and some head scratching I came to realise that this was because the server was creating a silent cmd window using the silent cmd window. A look at Task Manager revealed this to be true.

Luckily, at the moment the server code waits for the <code>ProcessBuilder</code> that executed <code>'cmd'</code> to wait for that child process to finish before returning, or I would have had quite a few processes to kill! Although while writing this it occurs to me that once the host <code>java.exe</code> process was ended, the child process would follow suit.

## If you do compile and run the source code I released, please bear in mind that it is still UNSECURE in the manner I just described. If you would like the more secure version please send me a tweet. 
