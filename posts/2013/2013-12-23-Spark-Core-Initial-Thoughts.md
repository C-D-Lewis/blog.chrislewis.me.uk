Spark Core: Initial Thoughts
2013-12-23 23:47:44
Integration,Spark Core,C++
---

As with the Pebble smartwatch, I also backed another project called <a title="Spark Core" href="http://spark.io">Spark Core</a>, which promised the idea of a small, compact and easy to use Wi-Fi-enabled Arduino like device. And I must say, they certainly delivered!

![](/assets/import/media/2013/12/img_20131223_140517.jpg?w=545)

After a few initial problems programming the device from the Spark Cloud (a browser based IDE) which turned out to be mainly my fault (The device appears to rely on a rapid <code>loop()</code> completion to stay in contact with the Spark Cloud and I was inhibiting it with a habitual <code>while(true)</code> loop within that loop, preventing Cloud access) I have succeeded in my first very minor project - interfacing with an Arduino Uno.

The idea is simple: The Adruino sends the characters '1', '2' and '3' in sequence and the Core flashes an attached LED the corresponding number of times.

The Arduino sketch:

```cpp
void flash(int pin)
{
  digitalWrite(pin, HIGH);
  delay(50);
  digitalWrite(pin, LOW);
  delay(50);
}

void setup()
{
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}

void loop()
{
  Serial.print('1');
  flash(13);
  delay(1000);
  Serial.print('2');
  flash(13);
  delay(1000);
  Serial.print('3');
  flash(13);
  delay(1000);
}
```

And the Core code:

```cpp
int output_led = D0;
int onboard_led = D7;

void flash(int pin);

void setup()
{
    Serial1.begin(9600);
    pinMode(output_led, OUTPUT);
    pinMode(onboard_led, OUTPUT);
}

void loop()
{
    if(Serial1.available() > 0)
    {
        flash(onboard_led);

        char c = (char)Serial1.read();

        switch(c) {
            case '1':
            {
                flash(output_led);
                break;
            }
            case '2':
            {
                flash(output_led);
                flash(output_led);
                break;
            }
            case '3':
            {
                flash(output_led);
                flash(output_led);
                flash(output_led);
            }
        }
    }
}

void flash(int pin)
{
    digitalWrite(pin, HIGH);
    delay(50);
    digitalWrite(pin, LOW);
    delay(50);
}
```

And finally a video!

http://www.youtube.com/watch?v=HL9Hp41IuzY

Aside from taking a while to discover that the TX RX pins are actually Serial1 and not Serial, the project was simple enough to implement. The Spark Cloud IDE is easy to use and satisfyingly hands-free!
