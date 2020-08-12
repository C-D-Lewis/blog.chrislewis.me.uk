Configurable Spark Core-connected LCD
2014-05-04 20:52:37
Android,C++,Integration,Spark Core
---

After blowing up my last LCD module <a title="Raspberry Pi: IP Address to LCD Display" href="http://ninedof.wordpress.com/2013/07/13/raspberry-pi-ip-address-to-lcd-display/">used for a project</a>, I decided to buy a new one, and decided on this RGB back-light module <a title="Sparkfun RGB LCD" href="https://www.sparkfun.com/products/10862">from Sparkfun</a>. It shares the standard pin-out as any Arduino compatible module (the 4/8-bit parallel Hitachi HD44780 interface), and includes a back-light that can be illuminated using an RGB LED.

I made the requisite connections for use on my Spark Core, and after discovering that the LED K connection is to ground and that the contrast adjustment pin requires a voltage of more than 4.5V (So grounding on a 3.3V system such as the Core is not enough) I had the module running nicely. As an additional feature, I connected the blue LED terminal via a BC457b transistor to allow control via software. Future expansion could include RGB PWM control for some funky effects, perhaps.

After playing around with setting text in the Spark IDE, I expanded the firmware to allow reception of text from a POST request, and then created such a request in Android to allow control of the back-light and text shown in app form. After a bit of layout attention, this was the result. The font size and margins are chosen to wrap the same as the LCD (Word wrapping is a novel feature of the Core firmware I wrote).

![](/assets/import/media/2014/05/screenshot_2014-05-04-21-31-28.png?w=545)The small size of the LCD module image is due to the fact I couldn't find any on the internet larger (later I may create my own), and scaling it up proved unsightly. Still quite legible on my Nexus 5 display, however. Entering the above text and hitting 'SET' gives the following real-world result:

![](/assets/import/media/2014/05/img_20140504_213246.jpg?w=545)The font isn't exactly the same, but close enough for my own use. I think that on any other sized display some more advanced layout management would be required, but that is for a future time. Also featured in the above picture, but unused, is the ADXL362 accelerometer I also used with the Core after tweaking the Arduino library to run, but haven't written about yet.

Two useful code snippets I created for re-use in future LCD projects are sending the Spark Cloud request in Android:

<!-- language="java" -->
<pre><div class="code-block">
public static String cloudRequest(String deviceId, String accessToken, String functionOrVariableName, String argString) {
  try {
    //Setup connection
    URL url = new URL("https://api.spark.io/v1/devices/" + deviceId + "/" + functionOrVariableName);
    HttpsURLConnection con = (HttpsURLConnection) url.openConnection();
    con.setRequestMethod("POST");
    String urlParameters = "access_token=" + accessToken + "&args=" + argString;
    con.setDoOutput(true);

    //Send request
    DataOutputStream wr = new DataOutputStream(con.getOutputStream());
    wr.writeBytes(urlParameters);
    wr.flush();
    wr.close();

    //Receive response
    con.getResponseCode();
    BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
    String inputLine;
    StringBuffer response = new StringBuffer();
    while ((inputLine = in.readLine()) != null) {
      response.append(inputLine);
    }
    in.close();

    return response.toString();
  } catch (Exception e) {
    System.err.println(SparkUtils.class.getName() + ": Exception:");
    e.printStackTrace();
    return "FAILED";
  }
}
</div></pre>

And also performing simple word wrapping between lines 0 and 1 of the LCD display:

<!-- language="cpp" -->
<pre><div class="code-block">
//Check overrun
if(msg.charAt(15) != ' ' && msg.charAt(16) != ' ')
{
    //Find start of offending word
    int index = 15;
    while(msg.charAt(index) != ' ' && index >= 0)
    {
        index--;
    }

    String one = msg.substring(0, index);
    String two = msg.substring(index + 1);

    lcd.print(one);
    lcd.setCursor(0, 1);
    lcd.print(two);
}
</div></pre>

