Pebble Watch Face SDK Tutorial #6: 2 Way Communication with Android
2013-07-11 21:20:47
Android,Pebble
---

<strong>Previous Tutorial Sections

All five previous parts of this tutorial series can be found on the 'Pebble SDK Tutorial' page link at the top of the page. Please read them if you are not already up to speed!

## Introduction

One of the main selling points of the Pebble smartwatch is the fact that it can run apps that communicate with a companion app on an iPhone or Android smartphone. Indeed, it is impossible to get started without one. In the spirit of openness that is also a major selling point, this part of the tutorial series will describe how to accomplish such a task, enabling a much richer watch app experience.

Thanks to the remarkable amount of example code and documentation provided in the relatively early Pebble SDK v1.12, a lot of the code I will be using and showing here is derived from these examples. No need to fix what isn't broken, and all that! They've done an excellent job on this one already.

As I have mentioned previously, I will only be covering the phone app side from an Android perspective, due to the fact I don't own an iOS device or agree with Apple's pricing policy to enter the ecosystem, but that's just personal opinion.

It is assumed that the reader is already familiar with basic Android app development and the application lifecycle. If not, I could write an Android primer, which would in turn require a working knowledge of Java. We'll see if that is required! Please let me know so I can gauge demand.

<b>AppMessage system overview</b>

On the Pebble platform, this is done using the AppMessage system. On the watch and on the phone, data is stored inside data structures called Dictionaries. When data is send or received, it is stored in data structures called Tuples. A Tuple contains a key and the data itself in what is known as a key-value pair. The key is a 'label' for that data and is constant.

For example, if you were writing an app to show the weather, you might have an <code>int</code> to store the temperature. You create a key (number) to identify this data, and all these keys are the same on both the watch app and the phone app. Lets set the key for the temperature variable to a value of '5'. The phone sends a Dictionary consisting of a tuple with the temperature data contained within, with a key value of '5'. When this data arrives on the watch app, because the key identifying the temperature variable is the same as on the phone app, the Dictionary is searched for the tuple with key value '5', and knows the accompanying data is the temperature to be displayed.

If that explanation leaves you wanting, here's an diagram that will hopefully make it clearer:

![](/assets/import/media/2013/07/key-and-data-life.png)

## Common App Features

In order to make sure that the phone app sends data to the correct watch app, both apps must use the same UUID to identify them. This has already been covered for the watch app, so here is how this is done on the phone app:

![](/assets/import/media/2013/07/uuid-member.png?w=545)

Here is how the phone app would store the keys. Remember that these should be identical to those declared on the watch app!

![](/assets/import/media/2013/07/keys.png)

## Watch App Specifics

On the watch app side of things, as predicted there is a use of handler functions to manage the following events:

• Send successful - AppMessage was sent successfully

• Send failed - AppMessage failed to send (or was not Acknowledged by phone app)

• Receive successful - AppMessage received from phone app

• Receive failed - AppMessage received but dropped due to lack of space or some other error

The first stage to implement this new functionality is to add the following lines to the PebbleAppHandlers in <code>pbl_main()</code>:

![](/assets/import/media/2013/07/pbl_main-additions1.png)

Next, create the handler functions with <strong>matching names to those referenced in the '.message_info' callbacks section in pbl_main()</strong> for each of the four callback scenarios in the bullet points above. Four blank handlers are shown below:

![](/assets/import/media/2013/07/blank-handlers.png?w=545)

## Sending data to the phone app

To send data to the phone app, a Dictionary is constructed and filled with the tuples describing the data to be sent, using the appropriate keys. Here is an example function that takes an <code>int</code> and sends it to the phone app (adapted from the one provided in the SDK examples):

![](/assets/import/media/2013/07/send_cmd.png?w=545)

The argument sent here would be matched with a corresponding action on the phone app. In this example project (link to the source code will be at the end) each of the three buttons is given a key of 0, 1 or 2 (Select, Up, Down). When the up button is pressed,  the watch app sends '1' to the phone app. Because the keys are the same on both sides, when the phone app receives '1' it can use that to perform the action the programmer wants to perform upon an up button press.

## Receiving data from the watch on the phone

On the phone app side, the Dictionary is received in a callback method which is registered with the Android system when the app starts, in <code>onResume()</code>:

![](/assets/import/media/2013/07/onresume.png?w=545)

Hopefully you can see that when the callback is triggered, the data is identified by the key, again it must correspond to the key on the watch app. This value is then used in a switch statement to decide what action to take. <strong>The phone app must first acknowledge (ACK) the data so the watch app doesn't report a timeout.

Another important note is that the callback must be unregistered in <code>onPause()</code> when the phone app is closed to prevent events being missed. Here is how that is done:

![](/assets/import/media/2013/07/onpause.png?w=545)

## Sending data back to the watch app

Going back in the opposite direction, data is sent to the watch app by making use of a PebbleDictionary and key-value tuples. The methods used for this are provided by the PebbleKit SDK packages, which you can use and import by copying the packages into the 'src' folder of your Android project (shown here in Eclipse IDE for Java Developers):

![](/assets/import/media/2013/07/packages.png)

The process for sending data from the phone app to the watch app is largely similar to the same process started from the watch app:

• Create the Dictionary (or PebbleDictionary in this case)

• Populate it with key-value tuples containing the data to be sent

• Send the Dictionary using the UUID (same as the watch app UUID)


This process is summarised in the image below, with comments for clarity:

![](/assets/import/media/2013/07/send-to-pebble.png?w=545)

## Receiving data on the watch app

The final part of this process is receiving data from the phone app. This is done by (you guessed it!) extracting data from a Dictionary sent from the phone app and provided by the callback handler as an argument.

• A DictionaryIterator is used to search the Dictionary for data using the pre-defined key for that identifies the data received.

• This data is stored in a tuple

• The tuple contents can then be used as you wish


In the example below, the Dictionary is searched for the string data associated with the DATA_KEY, which was send from the phone app using the same key. This string is then displayed in a TextLayer for the user to see that the data has arrived successfully. Note that the Pebble OS automatically ACKs the received AppMessage:

![](/assets/import/media/2013/07/using-received-data-on-watch.png?w=545)

## Conclusion

So there you have it! Sending data from watch, receiving it on the phone, then sending data from the phone to the watch and using it. I'll admit, this is the most complicated part of this tutorial series so far, and I hope to provide a bit more of a bridge from API Documentation to understanding the examples.

<a title="Example Project Source Code" href="https://www.dropbox.com/s/8pvxfuuor57x7it/AppMessage%20Source.zip"><strong>The example project source code can be found here!</strong></a>

Please feel free to post any questions here on in my Pebble Forum thread, and I'll do my best to answer. If there is a lot of demand, I may write an Android primer too, but that's probably another series in itself, and there are plenty of superb ones just a Google search away!
