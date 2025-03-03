Android App: GClient (Working Title)
2013-07-25 22:08:52
Android,Java,Pebble,Raspberry Pi
---

![](/assets/import/media/2013/07/gclientlogo.png)While developing a number of different minor projects that involved communication between Android and my laptop, Pebble or Raspberry Pi I found myself almost writing a new app for each project, with names like 'PebbleButtonDemo' or 'AndroidTestClient'.

It occurred to me 'why keep inventing the wheel?', meaning that this was a wasted practice. The vast majority of these situations simply called for a TCP Socket connection that sent pre-defined commands as text strings. With that in mind, I conspired to create a general purpose app that did these things and did them well.

But in order to solve the problem of writing a new app for every application when the underlying mechanism remained the same, it needed more 'customisability' than simply an EditText for address and port. The next logical step to this is to allow each project/application (server, that is) to customize the general client on the Android phone to it's purpose, and in this first incarnation offers the following 'customisables':

• Android Activity title in the Action bar by sending "TITLE" + the new title String

• A set of three customizable Buttons by sending 'BUTTON" followed by the button number, button text and the command it should trigger to be sent back to the application server.

• Protocols agreed for these actions in both Java and Python servers I've written.

More features are possible with a more advanced protocol, such as sending vectors to draw on the remote Canvas, or even images, but those will have to come later when a specific project calls for it.

So, upon opening the app, this is what is seen:

![](/assets/import/media/2013/07/screenshot_2013-07-25-22-37-13.png)The key UI elements to note are:

• The customizable Activity title.

• The 'I/O Traffic' section, which contains a customized SurfaceView element (actually a subclass of my <a title="Android Engine Update" href="http://ninedof.wordpress.com/2013/07/08/android-engine-update/">Android Game Engine</a>), which fills up green when a connection is established and animates blue 'bits' left and right whenever data is sent or received.

• The 'Connection Settings' section, which contains EditText fields for host address and port number, a Spinner for language selection on the application server side, and connect/disconnect Buttons.

• The 'Log History' section contains a ScrollView housing a TextView that shows all events that take place, be they received data, sent commands or local events such as IOExceptions and disconnects.

• The 'Custom Buttons' section, which houses the three customizable Buttons that can be setup from the application server side with details I'll now detail below.

To continue the spirit of a general purpose app, I created static methods for setting up these customizable UI elements, shown below:

```java
public class GClientTools {
  //Protocol configuration
  private static final String PROTOCOL_TITLE = "TITLE";
  private static final String PROTOCOL_BUTTON = "BUTTON";
  private static final String PROTOCOL_SEP_1 = ":";
  private static final String PROTOCOL_SEP_2 = ";";
  private static final String PROTOCOL_SEP_3 = ".";

  /**
   * Use the GClient syntax to set the GClient Activity title
   * @param inStream   Established output stream.
   * @param inTitle  Title to set to.
   */
  public static void setTitle(PrintStream inStream,String inTitle) {
    String packet = PROTOCOL_TITLE + PROTOCOL_SEP_1 + inTitle;
    inStream.println(packet);
    System.out.println("Title now '" + inTitle + "'. (" + packet + ")");
  }

  /**
   * Configure a GClient custom button
   * @param inStream    Established output stream.
   * @param inButtonNumber  Which button to customise. No range checking.
   * @param inText    Text to display on the button.
   * @param inCommand    Command the button will send back to this server.
   */
  public static void setCustomButton(PrintStream inStream, int inButtonNumber, String inText, String inCommand) {
    String packet = PROTOCOL_BUTTON + PROTOCOL_SEP_1 + inButtonNumber + PROTOCOL_SEP_2 + inText + PROTOCOL_SEP_3 + inCommand;
    inStream.println(packet);
    System.out.println("Button " + inButtonNumber + " now '" + inText + "' --> <" + inCommand + ">. (" + packet + ")");
  }

}
```

As a test case, I wrote a quick application server that accepts the GClient connection and makes use of these static methods to set the Activity title and one custom Button. The I/O Traffic bar has filled up green and the Log History shows all events:

![](/assets/import/media/2013/07/screenshot_2013-07-25-22-36-50.png)That's it for now. The major things I learned writing this app were:

• A much more stable and UI friendly threaded approach to networking, using four threads (UI, sending, receiving and connecting)

• Precise Android XML UI design including nested layouts and more features of the RelativeLayout.

• Setting Android UI views to use <a title="9-Patch Images" href="http://developer.android.com/tools/help/draw9patch.html">9-Patch images</a> and custom background styles and colours.

First version source code<a title="GClient Source Code" href="https://www.dropbox.com/s/2kfu6mh7xwqrv57/GClient%20Source.zip"> is available here</a>! The GClientTestServer port is a constant field in the class file. The GClientTestServer also contains the GClientTools class in the util package, which I'll be next using for adapting current project servers and eliminating a few test apps altogether!
