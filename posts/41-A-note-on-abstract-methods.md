---
index: 41
title: A note on abstract methods
postDate: 2013-07-26 00:04:13
original: https://ninedof.wordpress.com/2013/07/26/a-note-on-abstract-methods/
---

In developing the GClient (detailed in the preceeding post), I discovered for myself that the method to be implemented for some interfaces and object types (such as <code>run()</code> in a Runnable object) are done by declaring them as 'abstract' methods. This means when a programmer creates a new instance of that object, the abstract method that needs to be implemented is shown to be 'filled up' with context specific code. Below is an example:

This is an abstract method from my 'PythonConnection' class:

[code language="java"]

/**
  * Implement this to act on data received
  * @param data String containing the data received from the remote python host
  */
	public abstract void onReceive(String data);

[/code]

When a new PythonConnection object is created, the opportunity to implement <code>onReceive()</code> is shown as below:

[code language="java"]

PythonConnection pyCon = new PythonConnection() {

			@Override
			public void onReceive(String data) {
				//Put code to use the 'data' String here!
				//Update UI, send a response etc...

			}
		};

[/code]

Where does the 'data' String come from, you ask? Well when the underlying Thread receives data from the BufferedReader, it calls <code>onReceive()</code>, supplying the String read from the Reader and continues listening once <code>onReceive()</code> returns. Here is where that occurs in a typical server (such as in the GClient):

[code language="java"]

/**
  * Start the receiving thread that will call onReceive() when it has data
  */
	private void startListening() {

		receiveThread = new Thread(new Runnable() {

			@Override
			public void run() {
				listening = true;
				System.out.println(&quot;Ready to receive.&quot;);

				while(listening) {
					try {
						String packet = fromPython.readLine();
						if(packet != null) {
							onReceive(packet);
						}
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
		});

		receiveThread.start();
	}

[/code]

Previously to get around this 'sending data across classes' problem (which got especially nasty when Threads came into it) I would either pass the object creating the abstract object or use some sort of 'shared static class', which wasn't ideal and generated problems of its own.

This is an example of one of the joys of exploring a language by using it! I foresee much use for this functionality.
