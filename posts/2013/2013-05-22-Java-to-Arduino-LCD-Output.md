Java to Arduino LCD Output
2013-05-22 22:01:40
Integration,Java,C++
---

So, seeing as I enjoy programming and system integration more than semi-conductor physics (Here's looking at you, exam!) I decided to find a new use for an old GDM1601c 16x1 LCD display from an old kit I had when I was younger.

From experience (Digital Logic labs from the second year of university) I know that these types of displays have a standard interface, so it was easy enough to make whatever text I wanted come up on the display, especially with help from the Arduino LCD library, which replicates the protocol I reverse engineered (almost) in that second year lab experiment. If there's one thing you learn from practical electronic system integration, it's never to trust a datasheet!

The main quirk with this 'type' of display is that the memory locations for the left half and right half of the display are not analogous with their real world counterparts. This means that characters 1 - 8 are the 'top line' and characters 9 - 16 are the 'bottom line'. Apparently this means they are easier to manufacture (<a href="http://web.alfredstate.edu/weimandn/lcd/lcd_addressing/lcd_addressing_index.html">source: this article</a>), and once again highlights the quirks of electronic manufacturing, another example being that CMOS logic used in most integrated circuits is all inverted (NAND instead of AND!). To get around this limitation (as can be seen in the source code attached), I wrote a function that decides how to display the input text based on its length. If its between 8 and 16, the function splits up the text into two halves, and draws them on the screen accordingly (Curse wordpress and not allowing indents in code sections!):

<code>
/* Print a string between 7 and 16 characters to a 'Type 1' 16x2 LCD
* Author: Chris Lewis
*/
void printToLCD(String input) {
//Clear both sections
lcd.setCursor(0,0);
lcd.print(" ");
lcd.setCursor(0,8);
lcd.print(" ");

//Check message will fit
if(input.length() > 16) {
lcd.setCursor(0,0);
lcd.print("TooLong");
}

//If length between 8 and 16, split it up for displaying
else if(input.length() > 8) {
String firstHalf = input.substring(0,8);
String secondHalf = input.substring(8);

lcd.setCursor(0,0);
lcd.print(firstHalf);
lcd.setCursor(0,8); //Crazy Type 1 Addressing...
lcd.print(secondHalf);
}

//If length less than 8, just print it!
else if(input.length() < 8) {
lcd.setCursor(0,0);
lcd.print(input);
}
}
</code>

Anyway, the real fun came when I modified the Arduino sketch to accept Serial data from a computer (a lá what was achieved in the third year MEng group project this year, which I may get around to writing an entry about, although it was the bane of my life for about six months, but well worth it in terms of what I learned from it) and show that Serial data on the display.

![](/assets/import/media/2013/05/lcdoutput2.jpg?w=545)

Again, this wasn't a huge challenge, so I took it one step further, which to me was to write a Java class I could use in any general project to send text from a Java application to the LCD display. After some experimentation with the <a href="http://users.frii.com/jarvi/rxtx/">RXTX library</a> I got this to work, and it was a nice novelty to type something into the command prompt and see it appear instantaneously on the LCD display.

So far so good, the class is ready for use in a more advanced project, such as a network enabled application. Examples that come into my head right now are:

• An external health meter, ammo counter or score counter for a single/multiplater Java game

• A notification display for received chat messages if I get around to finishing my Java chat client

• Some sort of readout for a future project involving my Pebble watch, once I get my hands on the replacement.

So, without further adieu, here are some more pictures, and <a href="https://www.dropbox.com/s/r4lgnvx8y9qwykg/LCDoutput.zip?v=0mcn">source code</a>!

![](/assets/import/media/2013/05/lcdoutput4.png?w=545)

![](/assets/import/media/2013/05/lcdoutput1.jpg?w=545)![](/assets/import/media/2013/05/lcdoutput3.jpg?w=545)
