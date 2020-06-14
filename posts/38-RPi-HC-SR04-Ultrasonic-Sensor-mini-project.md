---
index: 38
title: RPi: HC-SR04 Ultrasonic Sensor mini-project
postDate: 2013-07-16 22:50:08
original: https://ninedof.wordpress.com/2013/07/16/rpi-hc-sr04-ultrasonic-sensor-mini-project/
---

In an almost biblical revelation, I have found it IS indeed possible to post source code in a proper fashion on Wordpress, making a virtual mockery of my Pebble SDK Tutorial pages, which I might update, but not for now. The code segments are available in source links in each post. 

So, what better reason to make a new post using this newly discovered feature than to write about my latest Raspberry Pi escapade. I have a cheap [HC-SR04 ultrasonic sensor](http://letsmakerobots.com/node/30209) that I used with an Ultrasonic library with my Arduino. Having since obtained a Pi, why not have it work with this new piece of kit?

After observing the [timing requirements](http://jaktek.com/wp-content/uploads/2011/12/HC-SR04.pdf), it seemed simple enough to replicate that behavior with a short C program, shown below in all it's copyable glory!

[code language="cpp"]
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;wiringPi.h&gt;

#define TRUE 1

#define TRIG 5
#define ECHO 6

void setup() {
        wiringPiSetup();
        pinMode(TRIG, OUTPUT);
        pinMode(ECHO, INPUT);

        //TRIG pin must start LOW
        digitalWrite(TRIG, LOW);
        delay(30);
}

int getCM() {
        //Send trig pulse
        digitalWrite(TRIG, HIGH);
        delayMicroseconds(20);
        digitalWrite(TRIG, LOW);

        //Wait for echo start
        while(digitalRead(ECHO) == LOW);

        //Wait for echo end
        long startTime = micros();
        while(digitalRead(ECHO) == HIGH);
        long travelTime = micros() - startTime;

        //Get distance in cm
        int distance = travelTime / 58;

        return distance;
}

int main(void) {
        setup();

        printf(&quot;Distance: %dcm\n&quot;, getCM());

        return 0;
}
[/code]

Which results in this output:

![](http://ninedof.files.wordpress.com/2013/07/ultrasonic.png?w=545)

So now I know the distance to the ceiling!
