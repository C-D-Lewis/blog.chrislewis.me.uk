Customising a Pi Pico Keypad
2023-03-26 11:23
Raspberry Pi,Integration,Python
---

This will be a short but sweet post that I kept putting off because part of me
didn't think it qualified as a 'full project' in the usual sense. But, looking
back at old blog posts it's clear it wasn't always that a 'finished' project
was the only subject of a post. 

So anyway, I wrote my own set of functions for customising a Pimoroni 
[Pi Pico Keypad Base](https://shop.pimoroni.com/products/pico-rgb-keypad-base).
After all, it's an excellent combination of Raspberry Pi and something that
would be useful after the project is 'finished'.

## Getting Started

Pimoroni provide great documentation and examples that allowed me to try out
running code when a button is pressed. It can either be done by polling or with
decorator handlers when a key is pressed or released. I chose the latter:

```python
from pmk import PMK
from pmk.platform.rgbkeypadbase import RGBKeypadBase as Hardware

keybow = PMK(Hardware())
keys = keybow.keys

for key in keys:
  @keybow.on_press(key)
  def press_handler(key):
    # Do key action
    handle_key_press(key)

  @keybow.on_release(key)
  def release_handler(key):
    # Turn it off
    key.set_led(key.set_led(0, 0, 0))
```

I took inspiration from one of the examples that modelled different sets of keys
for 'layers' allowing more than 16 functions. Therefore, I chose the left-most
four keys as the layer selection keys, and the remaining area to hold
color-coded functions for the chosen layer:

```python
#
# Attach handler functions to all of the keys for this layer.
#
def set_layer(new_layer):
  global current_layer
  current_layer = new_layer

  # Update colors
  for key in keys:
    key.set_led(*COLOR_OFF)

    # Update layer indicator
    if key.number in INDEX_SELECTION_KEYS:
      key.set_led(*COLOR_SELECTED_LAYER if key.number / 4 == current_layer else COLOR_UNSELECTED_LAYER)

    # Not configured
    if key.number not in KEY_MAP[current_layer]:
      continue

    key.set_led(*KEY_MAP[current_layer][key.number]['color'])
```

Thus, we have four layers:

## Media Control

![](assets/media/2023/03/keypad-media.jpg)

Including pause/play, previous/next track, mute, volume up/down, and at the
bottom convenience functions to activate my keybind for Discord mic mute, and a
function that flashes to simulate rolling dice.

The majority of these are achieved using more library classes:

```python
from adafruit_hid.consumer_control import ConsumerControl
from adafruit_hid.consumer_control_code import ConsumerControlCode
import usb_hid

# ...

consumer_control = ConsumerControl(usb_hid.devices)

# ...

if 'control_code' in config:
  consumer_control.send(config['control_code'])
```

where such a key config might look like this:

```python
{
  'control_code': ConsumerControlCode.PLAY_PAUSE,
  'color': COLOR_GREEN
}
```

## Applications

![](assets/media/2023/03/keypad-apps.jpg)

Allows launching applications via Windows Search. Currrently includes Spotify,
Discord, and Steam, but could be extended to anything that can be launched from
search. For an example key config:

```python
{
  'custom': lambda: run_program('spotify'),
  'color': COLOR_GREEN
}
```

The program can be launched as below:

```python
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keyboard_layout_us import KeyboardLayoutUS
from adafruit_hid.keycode import Keycode

# ...

keyboard = Keyboard(usb_hid.devices)
layout = KeyboardLayoutUS(keyboard)

# ...

#
# Launch a program via Start menu query
#
def run_program(query):
  keyboard.press(Keycode.GUI)
  keyboard.release_all()
  time.sleep(0.2)
  layout.write(query)
  time.sleep(1)
  layout.write('\n')
```

## Windows / System

![](assets/media/2023/03/keypad-windows.jpg)

Includes quick shortcuts for Windows including launching Task Manager, Explorer,
and Sleep, Restart, and Shutdown via key combination sequences. For example:

```python
{
  'sequence': [(Keycode.GUI, Keycode.X), Keycode.U, Keycode.U],
  'color': (32, 0, 0),
  'custom': lambda: go_to_sleep()
}
```

This uses the power menu to enter the combination for Shutdown. It's important
to allow for the configured key repeat speed to be accurate:

```python
if 'sequence' in config:
  for item in config['sequence']:
    if isinstance(item, tuple):
      keyboard.press(*item)
    else:
      keyboard.press(item)
    time.sleep(0.2)
    keyboard.release_all()
    time.sleep(0.5)
```

## Clock Mode

![](assets/media/2023/03/keypad-clock.jpg)

The <code>go_to_sleep()</code> function above puts the keypad into a mode where
minimal keys are lit, to avoid dazzling at night and to save power. It also
activates after one minute, and during daylight hours shows the time with
'hands on a clock' round the edge, which was a fun alorithmic exercise:

```python
# Clock digit LED sequence
DIGIT_LED_SEQ = [2, 3, 7, 11, 15, 14, 13, 12, 8, 4, 0, 1]

# ...

#
# Get clock LED digit for hours
#
def get_hour_digit(hours):
  index = math.floor(math.floor((hours * 100) / 12) / 100 * TOTAL_DIGITS)
  return DIGIT_LED_SEQ[index]

#
# Get clock LED digit for minutes
#
def get_minute_seconds_digit(minutes):
  index = math.floor(math.floor((minutes * 100) / 60) / 100 * TOTAL_DIGITS)
  return DIGIT_LED_SEQ[index]

#
# Show clock animation
#
def show_clock():
  global last_second_index

  # (year, month, mday, hour, minute, second, ...)
  now = time.localtime()
  hours = now[3]
  hours_12h = now[3] - 12 if now[3] >= 12 else now[3]
  minutes = now[4]
  seconds = now[5]

  # Indices around the face
  hours_index = get_hour_digit(hours_12h)
  minutes_index = get_minute_seconds_digit(minutes)
  seconds_index = get_minute_seconds_digit(seconds)

  # Prevent flickering
  if seconds_index != last_second_index:
    last_second_index = seconds_index
    for key in keys:
      key.set_led(*COLOR_OFF)

  # Key to wake
  keys[0].set_led(*COLOR_SLEEPING)

  # Do not dazzle at night
  if hours >= 9 and hours <= 23:
    # Hands
    keys[hours_index].set_led(*darker(COLOR_RED))
    keys[minutes_index].set_led(*darker(COLOR_BLUE))
    keys[seconds_index].set_led(*darker(COLOR_YELLOW))
```

See if you can use the code to figure out the time when the above photo was
taken...

How does it know the time, you may ask? Well, I chose a Pico W with Wi-Fi, and
use the RTC module to obtain the time after connection, using more handily
available libraries!

```python
import adafruit_ntp
import adafruit_requests
import os
import rtc
import socketpool
import ssl
import wifi

# ...

#
# Connect to WiFi
#
def connect_wifi():
  global pool
  global session

  wifi.radio.connect(os.getenv('WIFI_SSID'), os.getenv('WIFI_PASSWORD'))
  pool = socketpool.SocketPool(wifi.radio)
  session = adafruit_requests.Session(pool, ssl.create_default_context())

#
# Update time from NTP
#
def update_time():
  ntp = adafruit_ntp.NTP(pool, tz_offset=0)
  r = rtc.RTC()
  r.datetime = ntp.datetime
```

Where Wi-FI credentials are in the CircuitPython standard
<code>settings.toml</code> environment file.

## Other

![](assets/media/2023/03/keypad-other.jpg)

Lastly, there's pretty much one whole layer free for anything else - perhaps in
the future some web-connected functions for common tasks, notification states,
or smart lighting could be possible...

## Conclusion

Well, that ended up being more detailed than anticipated, and actually shows
it to be more than a quick weekend play around with some Pi accessories - and
I continue to use it daily! It's usefulness can also easily be expanded in the
future when more ideas occur to me.

You can find the entire project
[here](https://github.com/C-D-Lewis/pico-keypad-dev).
