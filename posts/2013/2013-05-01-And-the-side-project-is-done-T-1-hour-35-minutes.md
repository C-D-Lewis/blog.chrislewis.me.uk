And the side project is done! T +1 hour 35 minutes
2013-05-01 23:59:22
Android,Java
---

UPDATE: Source link now actually includes ALL the source code...

That proved to be much easier than expected... All it needed was modifying the Java server and implementing a NetConnection <code>Thread</code> class in an almost verbatim reproduction from the Networked Java game. I'm almost disappointed!

So without further adieu, here are the screenshots, with an explanation and source code below:

The PC runs the AndroidCommandServer jar file, and waits for a connection from the Android phone. Once a connection has been made, it waits for plain text 'cmd' commands and executes them when they arrive. For this demonstration, I simply sent 'notepad' to conjure up (almost as if by magic) a Notepad window! More usefully, this could be used for remotely locking the PC etc.

![](/assets/import/media/2013/05/androidcommandserver-console.png?w=545)

Here is a screenshot of the phone, post command issue (click for full size):

![](/assets/import/media/2013/05/screenshot_2013-05-02-00-42-26.png?w=180)

As you can see, the app is very rough and ready (and actually my first time using the Eclipse plugin's graphical element editor, as previously for soundboards and the A* pathfinder I'd always done it in the pure XML view), and I may implement the reception of text from the PC (Which would appear where 'TextView' currently rears it's ugly head) but it's not needed at the moment.

Also, for simplicity and cleanliness the phone will terminate the connection on app suspend (<code>onPause()</code>) by sending <code>#disconnect</code> which instructs the server to end the I/O streams that side.

<a title="Source code" href="https://www.dropbox.com/s/bq8zrj8t9r0h2k0/AndroidCommandServer%20release.zip">Here is the source</a>, also a good clean first time app for any speculative Android app writers that want a simple example (excluding the Socket stuff, but that is simple enough to be instructive too, I guess)
