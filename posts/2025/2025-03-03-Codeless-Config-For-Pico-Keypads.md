Codelss Config For Pico Keypads
2025-03-03 14:01
Raspberry Pi
---

After completing a
[project](https://blog.chrislewis.me.uk/?post=2023-03-26-Customising-a-Pi-Pico-Keypad)
involving assembling a Raspberry Pi Pico W with a Pimoroni Keybow keypad kit and
creating a script to allow specifying macros and key combos for Windows
functions and applications, I spent quite some time happily using it. I quickly
found I preferred using the media keys, muting/unmuting audio and Discord, and
sleeping my PC using it to the equivalent keyboard and GUI shortcuts.

![](assets/media/2025/03/keypad.jpg)

After getting interest from a couple of people I decided to make copies for
them to use with their own PCs. However, although it was 'easy' for me to
specify which key did which command, it did require knowledge of Python
dictionaries and intuition to debug the Pico when it crashed - it has no console
log and no other visual clues to help!

The customization aspect involved changing a global dictionary that looked like
this:

```python
# Map of keys on each layer
KEY_MAP = {
  # Media/utilty
  0: {
    1: {
      'control_code': ConsumerControlCode.SCAN_PREVIOUS_TRACK,
      'color': (0, 0, 64)
    },
    2: {
      'control_code': ConsumerControlCode.PLAY_PAUSE,
      'color': COLOR_GREEN
    },
    ...
  },
  # Applications
  1: {
    1: {
      'custom': lambda: run_program('spotify'),
      'color': COLOR_GREEN
    },
    ...
  },
  # System
  2: {
    1: {
      'combo': (Keycode.CONTROL, Keycode.SHIFT, Keycode.ESCAPE),
      'color': (0, 32, 0)
    },
    ...
    15: {
      'sequence': [(Keycode.GUI, Keycode.X), Keycode.U, Keycode.U],
      'color': (32, 0, 0),
      'custom': lambda: go_to_sleep()
    }
  }
}
```

So, you have to know how to edit the dictionary and add members of the imported
classes for key codes, not mess up placing commas or brackets etc...

## A Better Way

I asked if JSON would be easier and after a brief example it seemed that it
would a lot easier for others to customize their keypads for their own shortcuts
and applications if all that had to be done was edit a JSON file containing
the macro definitions. As a bonus, it would also mean when I give them new code
files they won't have to splice in their changes to the above dictionary and
risk messing it up.

After <i>much</i> trial and error with JSON/YAML loading modules that either
couldn't be used with the particular flavour of Micropython/CircuitPython I
discovered there was some built-in functionality I could
use - <code>json</code>! The more you know!

To put a long story short (reworking most of the code to work with the JSON
specific data types and new structures) loading of the file looks like this:

```python
#
# Load macros from JSON file
#
def load(keys):
  global macro_map
  global num_layers
  
  try:
    with open(constants.MACROS_JSON_PATH, 'r') as json_file:
      json_arr = json.load(json_file)
      
      num_layers = len(json_arr)
      macro_map = [int_keys(item) for item in json_arr]

      keys[8].set_led(*constants.COLOR_GREEN)
  except Exception:
    keys[8].set_led(*constants.COLOR_RED)
    raise Exception('Failed to load macros')
```

At least if the user gets JSON syntax wrong (and many validators are available)
they will see LED 8 go red and tell them where to look in a general sense. The
valid example file looks a little something like this:

```json
[
  {
    "1": { "type": "control_code", "value": "SCAN_PREVIOUS_TRACK", "color": "COLOR_BLUE"   },
    "2": { "type": "control_code", "value": "PLAY_PAUSE",          "color": "COLOR_GREEN"  },
    "3": { "type": "control_code", "value": "SCAN_NEXT_TRACK",     "color": "COLOR_BLUE"   },
    ...
  },
  {
    "1":  { "type": "text", "value": "7", "color": "COLOR_GREY"       },
    "2":  { "type": "text", "value": "8", "color": "COLOR_GREY"       },
    "3":  { "type": "text", "value": "9", "color": "COLOR_GREY"       },
    ...
  },
  {
    "1": { "type": "search", "value": "spotify", "color": "COLOR_GREEN" },
    "2": { "type": "search", "value": "steam",   "color": "0,0,16"      },
    "3": { "type": "search", "value": "discord", "color": "0,32,64"     },
    ...
  },
  {
    "1":  { "type": "combo",    "value": ["CONTROL", "SHIFT", "ESCAPE"], "color": "0,32,0"       },
    "2":  { "type": "combo",    "value": ["GUI", "E"],                   "color": "COLOR_YELLOW" },
    "13": { "type": "sequence", "value": [["GUI", "X"], "U", "S"],       "color": "0,0,32"       },
    ...
  }
]
```

As can be seen, the names of properties of classes such as
<code>ConsumerControlCode</code> must be an exact match, and there are some
built-in color constants that can be used that start with <code>COLOR_</code>. I
think it's not only more readable but quicker and safer to modify, even for
myself!

Eagle-eyed readers will also notice the JSON file is an array of pages of
macros - this means not only can there be any number of pages (facilitated by
a new feature of a 'page up' and 'page down' on the left hand column of buttons)
but they can also be re-arranged super easily! I also added layer that functions
as a numpad.

The JSON module allows the entire data structure to be loaded as a dictionary
and so accessed with the predictable if verbose syntax and interpreted based
on the type. I was very glad to learn of <code>getattr</code> to lookup a string
property of an imported class and saved many lookup tables.

```python
#
# Parse and handle a macro config when pressed, based on 'type'
#
def handle(config, keys):
  # Validate
  if not all(key in config for key in ['type', 'value', 'color']):
    raise Exception('Missing config values')

  # Send control code for media actions
  if config['type'] == 'control_code':
    consumer_control.send(getattr(ConsumerControlCode, config['value']))
    return

  # Write some text as a keyboard
  if config['type'] == 'text':
    layout.write(config['value'])
    return

  # Key combo
  if config['type'] == 'combo':
    values = [getattr(Keycode, value) for value in config['value']]
    keyboard.press(*tuple(values))
    keyboard.release_all()
    return

  # Sequence of keys or key combos
  if config['type'] == 'sequence':
    for item in config['value']:
      if isinstance(item, list):
        values = [getattr(Keycode, value) for value in item]
        keyboard.press(*tuple(values))
      else:
        keyboard.press(getattr(Keycode, item))
      time.sleep(0.2)
      keyboard.release_all()
      time.sleep(0.5)
    return

  # Run a custom function - must be runnable from this scope
  if config['type'] == 'custom':
    eval(config['value'])
    return

  # Search in Start menu and then press enter to launch
  if config['type'] == 'search':
    utils.start_menu_search(keyboard, layout, config['value'])
    return
```

## Conclusion

As before, this project is one of a few that keep on giving and I keep on
using - in multiple locations. I don't have any new features or improvements in
mind right now, but in the future if more come along I'm sure another post
will be warranted.

In the meantime, I should return to my projects for the second
[Rebble hackathon](https://rebble.io/hackathon-002/)...
