Ready For The Next Pebble Chapter
2025-09-01 15:18
Pebble
---

Back in March, the RePebble (Core Devices) announcement gave way to the second
Rebble hackathon, and much fun was had in digging out old code and porting some
newer watchfaces from Fitbit to Pebble.

During that time, I re-purposed my <code>pebble-archive</code> repository to
become a one-stop location for all my Pebble projects, old and new, including
watchfaces, watchapps, and libraries. Thus it became
[pebble-dev](https://github.com/C-D-Lewis/pebble-dev)!

After the week was out, I had accomplished a lot, but there was still a lot to
be done to achieve that goal. For one, there were still a majority of projects
that were in an unknown state, did not compile at all, or were otherwise
unusable. Very few projects had survived the last 9 years!

As I wait to begin a new job, I appropriately had a lot of time on my hands...

## It's All In One

After some additional work (read: fun!) I have now realized this goal. The only
projects that were not included in <code>pebble-dev</code> were
<code>thin</code>, <code>beam-up</code>, <code>dashboard</code>, and
<code>pge</code>. But now they are! Admittedly, I think this was mostly due to
the more high-profile nature of them. Viewing my GitHub repo list is not a huge
leap for anyone who ends up looking for the code in the old locations.

The <code>README.md</code> file for the repository shows a nice table of every
one of my published watchfaces, watchapps, and libraries, with screenshots where
appropriate as well as a list of compatible watch platforms and a link to the
latest built PBW file. I also aim to include a launcher icon for each one in
due course.

![](assets/media/2025/09/watchface-list.png)

The list of watchapps uses the same format:

![](assets/media/2025/09/watchapp-list.png)

Lastly, for libraries I aim to provide a test app within each one to verify
that it is working correctly, although currently that process is slightly
awkward as the currently available Pebble SDK tool does not correctly build
[pebble packages](https://developer.rebble.io/guides/pebble-packages/).

## Resurrections

As part of this latest round of work, quite a number of projects were brought
back to life so they would compile and even be structured in the same way as
latter projects. In the process, I made use of some handy libraries I had also
fixed and made useful once more:

- [InverterLayerCompat](https://github.com/C-D-Lewis/pebble-dev/tree/master/libraries/InverterLayerCompat), a new type of <code>Layer</code> that provides the same functionality of the old <code>InverterLayer</code> before it was removed in SDK 3. Especially useful for watchfaces that expected SDK 2!

- [pebble-universal-fb](https://github.com/C-D-Lewis/pebble-dev/tree/master/libraries/pebble-universal-fb), which allows a universal get/set set of methods for working with the Pebble framebuffer, no matter the watch platform or color mode of the display.

- [pebble-isometric](https://github.com/C-D-Lewis/pebble-dev/tree/master/libraries/pebble-isometric), which provides many easy to use methods for drawing rects and boxes in an isometric perspective. It was used
chiefly in the [Isotime](https://apps.rebble.io/en_US/application/554574943bbdc6c8560000bf?native=false&query=isotime&section=watchfaces) watchface, and also in a new one (see below!)

In total, nine watchfaces were resurrected! They are:

- [Brackets](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchfaces/brackets)

- [Cards](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchfaces/cards)

- [CMD Time](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchfaces/cmd-time)

- [CMD Time Typed](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchfaces/cmd-time-typed)

- [Events](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchfaces/events)

- [Index](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchfaces/index)

- [Past Present Future](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchfaces/past-present-future)

- [Potential Divider](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchfaces/potential-divider)

- [Split Horizon](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchfaces/split-horizon)

Some of these go back to the very earliest watchfaces I published, and it's so
great to see them compile and live on my wrist once more! Some of them had some
delightful animations I'd forgotten, and some had old HTML config pages that I
migrated to Clay which should enhance their longevity even more!

## Some New Faces?

One of the activities I found most fun and enjoyable back in 2016 when I was not
working on the Pebble devrel team was coming up with new and striking watchfaces.
I am not a designed by any definition at all, so they mostly rely on minimal
concepts, animations, and clean lines. During the Rebble hackathon 002 I brought
some Fitbit watchfaces to Pebble and they very much were iterations on that
theme.

So, I made it a mission to create a brand new watchface to bring back a little
of that feeling and mark the occasion that such a large majority of my Pebble
projects are back and working once more. In particular I enjoyed working with
the isometric library, so I came up with another way to use it similar to
Isotime, but with upright statues instead of laying down digits.

![](assets/media/2025/09/void-statues.jpg)

The result is
[Void Statues](https://apps.rebble.io/en_US/application/68a492f024908f00096bb0b2?native=false&query=void&section=watchfaces)!
In addition to the digits (and the novel way to describe each one in code) it
also shows the corresponding 'shadow' on the ground from some unseen light
source. It inverts the color scheme during night hours, and switches to a cool
wireframe rendering mode when the watch is disconnected.

Drawing the digits required a good bit of abstraction, since each digit had a
position, a value, and 15 segments within it that needed to be 'on' or 'off'.
I eventually came up with a neat way to do this.

The first step is to translate each number into an array representing the
cells that need to be visible:

```c
void drawing_draw_number(int number, GPoint pos) {
  switch (number) {
    case 0: {
      int cells[15] = {
        1, 1, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 1, 1
      };
      draw_digit_shadow(pos, cells);
      draw_digit_blocks(pos, cells, number);
      break;
    }
    case 1: {
      int cells[15] = {
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
      };
      draw_digit_shadow(pos, cells);
      draw_digit_blocks(pos, cells, number);
      break;
    }

    // etc...
```

Two other functions shown above then translate that into a series of drawing
calls for the blocks and the shadow respectively, making use of
<code>pebble-universal-fb</code> functions where needed. They're nothing special
but made the leap from drawing a single cell to whole digits much easier indeed.

```c
static void draw_digit_shadow(GPoint pos, int cells[15]) {
  if (cells[0] == 1) draw_shadow(Vec3(pos.x + (5 * B_W), pos.y + (2 * B_W), 0));
  if (cells[1] == 1) draw_shadow(Vec3(pos.x + (5 * B_W), pos.y + B_W, 0));
  if (cells[2] == 1) draw_shadow(Vec3(pos.x + (5 * B_W), pos.y, 0));
  if (cells[3] == 1) draw_shadow(Vec3(pos.x + (4 * B_W), pos.y + (2 * B_W), 0));
  if (cells[4] == 1) draw_shadow(Vec3(pos.x + (4 * B_W), pos.y + B_W, 0));
  if (cells[5] == 1) draw_shadow(Vec3(pos.x + (4 * B_W), pos.y, 0));

  // etc...
```

```c
static void draw_digit_blocks(GPoint pos, int cells[15], int number) {
  // Must be drawn bottom right to top left
  if (cells[14] == 1) draw_box(get_block_position(14, pos));
  if (cells[13] == 1) draw_box(get_block_position(13, pos));
  if (cells[12] == 1) draw_box(get_block_position(12, pos));
  if (cells[11] == 1) draw_box(get_block_position(11, pos));
  if (cells[10] == 1) draw_box(get_block_position(10, pos));
  if (number == 0 || number == 6 || number == 8) {
    isometric_fill_box_faces(get_block_position(10, pos), BOX_SIZE, B_H, s_clarity_color, false, true, false);
    isometric_draw_box(get_block_position(10, pos), BOX_SIZE, B_H, s_box_color, true);
  }
  if (cells[9] == 1) draw_box(get_block_position(9, pos));
  if (cells[8] == 1) draw_box(get_block_position(8, pos));
  if (cells[7] == 1) draw_box(get_block_position(7, pos));
  if (number == 0) {
    isometric_fill_box_faces(get_block_position(7, pos), BOX_SIZE, B_H, s_clarity_color, false, true, false);
    isometric_draw_box(get_block_position(7, pos), BOX_SIZE, B_H, s_box_color, true);
  }

  // etc...
```

What's special about <code>draw_digit_blocks</code> is that the nature of the
isometric rendering from bottom-right to top-left matters a lot. Some digits
that have holes in them (6, 8, 9, 0) are very hard to read, so there are a few
special draw calls to draw inverted wireframe boxes to make them more legible.

And with the excitement around the Pebble Time 2 coming soon, it was a great
opportunity to make my first watchface with support for 'Emery' built in...

![](assets/media/2025/09/vs-emery.png)

## More Documentation Contributions

Another long post but we're almost there! The last thing to report on is that
after nine years I've had the pleasure of beginning to make contributions to
the Pebble developer documentation once more. The fact it was kindly
open-sourced and has a community-created build and deploy process greatly adds
to the incentive!

I've raised PRs in the new
[developer.rebble.io](https://github.com/pebble-dev/developer.rebble.io) repo
to address a number of things, including fixing up the tutorials (let's not
talk about the errors and broken things that got left there for all these years!),
updating the mobile navigation, removing the references to CloudPebble
(although a new solution is just starting to emerge), and more.

## Conclusions

I hope to continue these contributions into the future to help developers old
and new once more, especially those that are enthused by the new watches! As
I've always said, the ability to relatively easily create anything you want for
a watchface or watchapp is something Pebble does with a unique level of
flexibility and forethought, so I encourage everyone to try it!

That link again to the complete repository: [here](https://github.com/c-d-lewis/pebble-dev).
