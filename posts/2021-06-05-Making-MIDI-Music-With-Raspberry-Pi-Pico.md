Making MIDI Music With Raspberry Pi Pico
2021-06-05 12:17
Integration,Raspberry Pi,C++,Python
---

Since some of the earlier years of YouTube, one of the coolest types of project
I've seen is making music using unusual instruments. Typically these could be
floppy disk drives or hard disk drives, which have one common ingredient - high
precision stepper motors. These kinds of motors 'step' one eighth or sixteenth
of an increment whenever a single pulse signal is issued to a driver board
(required since the motors have many wires for multiple sets of windings).

As it happens, the frequency of these steps results in different overall speeds,
but also different musical tones. After all, what are different musical notes
except different frequencies? For example, a middle C is 262 Hz. More recently,
I saw a few more modern projects that use only these motors and driver boards
to produce music.

The common MIDI file format is just a set of notes, with
pitch, instrument type, and duration of notes. The job of machines and musical
instruments that play these files is to emulate those notes without a real
physical instrument. Using stepper motors to do this translation of musical
pitch to step frequency is just another example of such musical synthesis.

This post will go into detail about compiling MIDI files to C++ headers and how
the Pico controls the motors to sound musical notes, but keep reading for a
video medley compilation of some great example songs in action!

## Construction

So, inspired, I decided to have a go myself! The result is the strange gadget
shown below, notionally named
[pico-pipes](https://github.com/c-d-lewis/pico-pipes), alluding to a musical
instrument that is powered by the new Raspberry Pi Pico - a slimmed down
microcontroller-esque incarnation of the popular mini-computer that is closer
to a single-program Arduino than a fully capable Linux PC system.

In its role as a microcontroller it has a large number of digital and analog
input and output pins, which are perfect for issuing high-precision pulses
to the A4988 stepper motor driver boards (designed for 3D Printer drivers, but
suitable enough). It can be programmed in C, or micropython using the official
[Raspberry Pi Pico SDKs](https://www.raspberrypi.org/documentation/rp2040/getting-started/).

Combined with a sticky-back breadboard, a 9V socket and wall adapter, and
minimalistic (to put it kindly) case 3D printed by my brother, it forms a
self-contained, relatively rattle-free unit.

![](assets/media/2021/06/pico-pipes.jpg)

Here are a couple more photos showing the Raspberry Pi:

![](assets/media/2021/06/pico-pipes-pi.jpg)

And stepper motor driver boards in situ, as well as the semi-organised set of
wires connecting the Pi to the driver boards, and the boards to the motors
themselves:

![](assets/media/2021/06/pico-pipes-drivers.jpg)

The intent of the case is to provide a single physical contact point for all the
motors to resonate together, instead of just rattling over a desk-top. They are
held in place with 3mm machine screws, although a couple of the holes didn't
print perfectly, but all are attached with a minimum of three out of four. The
corner posts connect the top and bottom halves of the case, but since I made the
mistake of drilling the semi-printed holes too wide, are super-glued instead.

## Compiling MIDI Files to C++

So, how does the Raspberry Pi Pico know which notes to play? The first step is
to open a MIDI file and get a list of all instruments, and which notes they
play. This is done using the handy
[pretty_midi](https://github.com/craffel/pretty-midi) library.

```python
# Load midi file
midi_data = pretty_midi.PrettyMIDI(file_name)

# Read instruments - skip the drums
non_drum_instruments = []
for i, instrument in enumerate(midi_data.instruments):
  if not instrument.is_drum:
    program_name = PROGRAM_MAP[instrument.program] if instrument.program > 0 else 'Unknown'
    num_notes = len(instrument.notes)
    selected = {
      'pm_instrument': instrument,
      'program_name': program_name,
      'num_notes': num_notes,
      'summary': f"Track {i} ({program_name}): {num_notes} notes"
    }

    non_drum_instruments.append(selected)
```

The <code>PROGRAM_MAP</code> variable is a long map of instrument codes to names
of those instruments.

```python
PROGRAM_MAP = {
  1: 'Acoustic Grand Piano',
  2: 'Bright Acoustic Piano',
  3: 'Electric Grand Piano',
  4: 'Honky-tonk Piano',
  5: 'Electric Piano 1',
  6: 'Electric Piano 2',
  7: 'Harpsichord',
  8: 'Clavinet',

  # And so on...
```

This allows the <code>compile.py</code> program to give
a list of track numbers and instrument names, as well as how many notes each
will play. This is useful because we can only have as many instruments as motors
which in this case is 4, but could be more in the future. An example is shown
below:

```text
$ python3 compile.py ~/Downloads/starlight.mid

file_name: /Users/chrislewis/Downloads/starlight.mid

0: Track 0 (Acoustic Bass): 880 notes
1: Track 1 (Overdriven Guitar): 880 notes
2: Track 3 (FX 6 (goblins)): 320 notes
3: Track 4 (Lead 8 (bass + lead)): 312 notes
4: Track 5 (Electric Guitar (muted)): 808 notes
5: Track 6 (Electric Guitar (jazz)): 128 notes
6: Track 7 (Electric Guitar (muted)): 1 notes
7: Track 8 (Bright Acoustic Piano): 320 notes
8: Track 9 (Pad 1 (new age)): 640 notes
9: Track 10 (Voice Oohs): 512 notes
10: Track 11 (Voice Oohs): 312 notes
```

Re-running the script with four track numbers as the last parameter will cause
it to generate a C++ header file, with an array of notes with track number,
pitch, and duration.

```c
// GENERATED WITH compile.py

#define NUM_NOTES 5155

// Order is track, pitch, on_at, off_at
static const float* NOTE_TABLE[] = {
  (float[]){ 0, 60, 0.0, 1.86046 },
  (float[]){ 0, 63, 0.11628, 1.74418 },
  (float[]){ 0, 67, 0.23256, 1.62791 },
  (float[]){ 0, 72, 0.34884, 1.51163 },
  (float[]){ 0, 75, 0.46512, 1.39535 },
  (float[]){ 0, 79, 0.58139, 0.81395 },
  (float[]){ 0, 84, 0.69767, 0.93023 },
  (float[]){ 0, 87, 0.81395, 1.04651 },
  (float[]){ 0, 91, 0.93023, 1.16279 },
  (float[]){ 0, 87, 1.04651, 1.27907 },
  (float[]){ 0, 84, 1.16279, 2.55814 },

  // and so on...
```

## Timing steppers from notes

This combatted a problem I had earlier on with a version that used micropython
instead of C++ (for ease of use), but sadly there was a limit of the size of
MIDI file that could be read from the onboard memory, and micropython was
incapable of providing enough real-time precision for the step pulses, which
are microseconds-scale in size. Happily the equivalent in C++ compiled to
machine code easily precisely controls four motors, and probably a fair few more
given the 133MHz Cortex M0+ onboard the Pico.

The basic model of the program is as follows:

Each motor is a <code>struct</code> that keeps the state of that motor. When
created, it also initializes the GPIO pin assigned to it, through which it sends
step pulses to the motor driver board. It tracks which GPIO pin to use, whether
the motor is in use, when it last took a step since program start, the delay in
microseconds between steps (calculated from the frequency table corresponding
to the currently playing note), when the note started, and the millisecond
duration of the note.

```c
struct Motor {
  int pin;
  int is_on;
  uint64_t last_step_us;
  uint64_t step_delay_us;
  uint64_t note_start_us;
  uint64_t note_duration_ms;
};

/**
 * Setup a Motor data structure.
 */
struct Motor motor_create(int pin) {
  struct Motor m;
  m.pin = pin;
  m.is_on = FALSE;
  m.last_step_us = 0;
  m.step_delay_us = 0;
  m.note_start_us = 0;
  m.note_duration_ms = 0;

  // GPIO init
  gpio_init(pin);
  gpio_set_dir(pin, GPIO_OUT);

  return m;
};
```

When the program advances through the compiled note list from
<code>compile.py</code>, the motor corresponding to the track number in the MIDI
file is updated with the new note, which contains pitch, on time, and duration.
A separate <code>struct</code> is used with the item in the note list header
file.

```c
/**
 * Update a motor with a new note event.
 */
void motor_set_note(struct Motor *m, struct Note n) {
  m->is_on = TRUE;

  // Duration control
  m->note_start_us = to_us_since_boot(get_absolute_time());
  m->note_duration_ms = (n.off_at - n.on_at) * 1000;

  // Set delay from pitch frequency
  m->step_delay_us = 1000000 / pitch_get_freq(n.pitch);
};
```

Lastly, as long as there are notes left to play, the main program loop 'ticks'
each motor, allowing it to step if enough time has passed from the last step, at
the correct rate for the desired note frequency:

```c
/**
 * Tick a motor.
 */
void motor_tick(struct Motor *m) {
  uint64_t now_us = to_us_since_boot(get_absolute_time());

  // Turn off?
  if (now_us - m->note_start_us > (m->note_duration_ms * 1000)) {
    m->is_on = FALSE;
  }

  // Take a step if step delay elapsed
  if (now_us - m->last_step_us > m->step_delay_us) {
    m->last_step_us = now_us;

    if (m->is_on == TRUE) {
      gpio_put(m->pin, 1);
      sleep_us(5);
      gpio_put(m->pin, 0);
    }
  }
};
```

Thus, the main loop is actually quite succinct, thanks to the choice to use
loops and <code>struct</code>s:

```c
/**
 * Entry point.
 */
int main() {
  // Create motors
  struct Motor motor1 = motor_create(MOTOR_1_PIN);
  struct Motor motor2 = motor_create(MOTOR_2_PIN);
  struct Motor motor3 = motor_create(MOTOR_3_PIN);
  struct Motor motor4 = motor_create(MOTOR_4_PIN);

  // Pre-load first note
  int note_index = 0;
  struct Note next_note = note_create(NOTE_TABLE[note_index]);

  while (true) {
    motor_tick(&motor1);
    motor_tick(&motor2);
    motor_tick(&motor3);
    motor_tick(&motor4);

    // End?
    if (note_index == NUM_NOTES - 1) return 0;

    // Update next event
    if (get_ms_now() > next_note.on_at * 1000) {
      // One motor per track
      if (next_note.track == 0) {
        motor_set_note(&motor1, next_note);
      } else if (next_note.track == 1) {
        motor_set_note(&motor2, next_note);
      } else if (next_note.track == 2) {
        motor_set_note(&motor3, next_note);
      } else if (next_note.track == 3) {
        motor_set_note(&motor4, next_note);
      }

      note_index += 1;
      next_note = note_create(NOTE_TABLE[note_index]);
    }
  }
};
```

## Medley video

Below is a video selection showcasing some great example songs from games such
as The Legend of Zelda: The Wind Waker, Super Mario Sunshine, UNDERTALE, Final
Fantasy VII, Pokemon Yellow, and Portal. Enjoy!

<iframe width="560" height="315" src="https://www.youtube.com/embed/VKjqNz4cVn8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Conclusion

In this manner, virtually any MIDI file can be analysed for instruments and
notes, compiled into a note list as a C++ header file, and played on a variable
number of motors on a Raspberry Pi Pico or similar C-based microcontroller. I've
already had a lot of fun trying many different pieces of music, but obviously
video game music (which makes heavy use of catchy, repeating melodies) sounds
the best.

Check out the
[project repository](https://github.com/C-D-Lewis/pico-pipes) for all the
code and documentation in case you want to run it yourself!
