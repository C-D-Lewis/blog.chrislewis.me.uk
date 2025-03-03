Pebble Watchface: Potential Divider
2013-05-26 23:34:57
Pebble
---

So, after receiving my replacement watch from the guys at <a href="http://getpebble.com">Pebble</a>, I cracked on with an idea for a watch face I've had since I backed the project last May. Presenting the 'Potential Divider' watchface!

![](/assets/import/media/2013/05/divider.png?w=545)In electronics, the potential divider is a simple circuit that lets you take one input voltage (here seen as a static 24 volts and step it down to a smaller value by dropping it across two resistors. The salient facts are that the larger of the two resistors gets the larger share of the input voltage. By choosing correct values for the two resistors, you can change (for example) the 24 volts to 12 volts on the output (right hand side) by setting the two resistances exactly equal. Half and half.

What I've done here is set the top resistor to the hours value, and the lower resistor to the minutes value, making the time shown here to be 20:46, or 8:46 PM. Thus R1 (top) has the value of 20 ohms, and R2 (bottom) a value of 46 ohms. The calculation of the output voltage is just an added detail that amuses me as an electronics student, but also has value in saying "Oh yes, it's 17.6 volts o'clock", to many facepalms. The maths is simple:

![](/assets/import/media/2013/05/dividermaths.png)The real challenges were getting that output voltage onto the screen. If you don't know, at the moment Pebble watch faces are written in standard C, which is quite a complex, low level and generally confusing language to be introduced to programming in. It involves a lot of complexities that aren't necessary to get across to someone starting their programming journey what a language is and how it works. But personal minor grievances aside, in C if you want to store text, it isn't a simple <code>String text = "This is my text!";</code> , it's an array of characters: <code>static char text[17] = "This is my text"; </code>.

So what, you might ask? How does that make putting a number on the screen a challenge? Well the answer to that question is this: To take '17.6V' and store it in a character array, because C is such a low level language, there is usually a pre-written function to take the floating point value and store it in a character array. But with the Pebble SDK in its current state, these standard string libraries aren't linked, so they can't be used (yet)!. So the solution was to do each character separately.

In the five character array used for 17.6V for example, characters 3 and 5 are always the same. 3 is always a decimal point, and 5 is always 'V'. So <code>outputText[3] = '.';</code> and <code>outputText[5] = 'V';</code> are done. Easy. The others are not so simple. A method I already knew to get a character from a number is to simply do the modulo of that number by 10. So for the second character, I'd do <code>int secondCharacter = 17.6 % 10;</code> which would yield the remainder of 17.6 divided by 10, which equals 6. For the first character I'd divide the voltage by 10, then repeat the process. 17.6 / 10 = 1.76. 1.76 % 10 = 1. So now I can use <code>outputText[1] = '0' + secondCharacter;</code> for example. Same for the first decimal place, except that would require multiplying by 10 to get 176 % 10 = 6.

But once again the infantile nature of the Pebble SDK flies in the face of my ambitions. It also turns out that the Math.h library (also standard in C) isn't linked either! So I would have to do the modulo function manually. This is easy. It can be seen in full in the source code at the end of this post, but the essence is this: for 17.6 modulo (%) 10, divide 17.6 by 10, subtract the integer part (1), then multiply by 10 again to get the remainder, which is 7. This 'integer stripping' part is done by iteratively comparing the result of the first division against one. When the iterative divisor results in less than one, the integer part is found. Here is the code fragment:

<code>
float stripInteger(float input) {
float stripLoopTemp = 0.0F, intResult = 0.0F, result = 0.0F;
float safeKeeping = input;
float i = 1.0F;
int maxInt = 100;

for(i=1.0F;i<maxInt;i++) {
stripLoopTemp = safeKeeping; //Keep original argument safe

stripLoopTemp /= i; //Divide by this iteration's divisor

if(stripLoopTemp < 1.0F) { //Found integer part! intResult = i - 1.0F; //For i = 3 -> 2.5/3 < 0 ==> integer part = i - 1 = 2
result = input - intResult;
return(result);
}
}

//Failed
return(0.0F);
}
</code>
This, in combination with the manual modulo, enabled me to slot the individual characters of the result float voltage value into the character array slots for display by the watch. Job done! Whew!

So, finally, we can see the results. Here is a YouTube video, showing the watch face in action, plus a little 'electron seconds marker' that travels around the circuit. I'll leave the details on how that works for those who want to peek into the <a title="Divider source code" href="https://www.dropbox.com/s/1stdwzel26vlsxy/Divider.zip?v=0mcn">source code (link)</a>, because it is nothing innovative here. The source code download also includes the watchface package incase you want to use it yourself! Enjoy!

&nbsp;

http://www.youtube.com/watch?v=Zgwwcegn_Vc
