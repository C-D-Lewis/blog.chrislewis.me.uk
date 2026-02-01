Fast Emery Upgrades With pebble-scalable
2026-02-01 11:24
Pebble,Releases
---

It's been a while since the push to upgrade Pebble watchfaces and watchapps for
Pebble Time 2 in 2016, but with the imminent shipping of Core Device's virtually
platform-identical Pebble Time 2 it was time for me to finally get serious. The
task: ensure all watchface/watchapp layouts scale up for the larger 200x228
display while at the same time preserving the existing layout for the original
display size of 144x168.

![](assets/media/2026/02/scalable-tube-status.png)

I had actually done some (but not a lot!) of these in 2016 before I left Pebble
and the company wound up, but since then I had create a lot of new apps, some
of which have quite complex layouts. I had also taken a few divergent approaches
to creating layouts, not always the encouraged best practice:

- Hard-coded coordinates (the worst way!)

- Constants at the top of the file that had values on a per-platform basis (better!)

- Used the <code>Window</code>'s width and height to place layers based on a percentage of each (the best!)

As the documentation writing guy I really should have known better.
Unfortunately this mix of techniques made it almost impossible to quickly and
easily ensure the dozens of apps were ready for Emery without needing to
hand-craft each and every one.

I <i>certainly</i> wanted to avoid doing this for every single project, which
would grow so much larger when new platforms came around:

```c
#if defined(PBL_PLATFORM_EMERY)
  #define CLASS_ICON_SIZE 56
  #define STATUS_ICON_SIZE 22
  #define X_ROOT 6
  #define TIME_Y_ROOT 88
  #define DATE_Y_ROOT 155
  #define STATUS_Y_ROOT 4
  #define DATE_TIME_BG_WIDTH 185
  #define LABEL_BG_HEIGHT 18
  #define STATUS_BG_HEIGHT 66
  #define PROGRESS_BAR_WIDTH 102
  #define SHIELD_BAR_HEIGHT 16
  #define HEALTH_BAR_HEIGHT 19
#else
  #define CLASS_ICON_SIZE 40
  #define STATUS_ICON_SIZE 16
  #define X_ROOT 5
  #define TIME_Y_ROOT 74
  #define DATE_Y_ROOT 135
  #define STATUS_Y_ROOT 2
  #define DATE_TIME_BG_WIDTH 135
  #define LABEL_BG_HEIGHT 15
  #define STATUS_BG_HEIGHT 53
  #define PROGRESS_BAR_WIDTH 78
  #define SHIELD_BAR_HEIGHT 10
  #define HEALTH_BAR_HEIGHT 12
#endif
```

## Solution: Make a Library

Of course, a systematic problem requires a systematic solution. So, I created
a new library (Pebble package) to do the heavy lifting. The idea: make it easy
and repeatable to <i>always</i> use the best technique and use a percentage
of screen dimensions. It should also be easy to adopt and update layouts that
were created with those nasty hard-coded coordinates or already using screen
size percentages.

Thus,
[pebble-scalable](https://github.com/C-D-Lewis/pebble-dev/tree/master/libraries/pebble-scalable)
was born - it knows the size of each platform's display and that never changes.
It accepts percentage values of the dimensions and spits of the pixel-perfect
equivalent. To allow very precise specification down to the pixel, the library
operates with thousandths instead of hundredths. Here's an example:

```c
// Get a percentage (thousands) of the display width and height
const int half_w = scl_x(500);
const int half_h = scl_y(500);
```

Of course, in practice nothing is so easily solved, and especially with font
drawing quirks, I found I needed to shift text or shapes just a few pixels on
some platforms but not others. The library supports this with a familiar object
syntax supported by a bit of macro magic. Supposing I wanted 50% width on basalt
(the original screen size) but 52.5% on Emery:

```c
const int half_w = scl_x_pp({.o = 500, .e = 525});
```

The syntax is <code>o</code> for the original (Aplite, Basalt, Diorite, Flint)
screen size, <code>e</code> for Emery, <code>c</code> for Chalk, etc. The neat
part about this syntax is it becomes possible to add support for new platforms
<i>without breaking existing code</i>! A previous version simply added more
parameters to functions, and was clearly not scalable:

```c
// Adding Gabbro would require ALL of these to be updated! Bad!
const int half_w = scl_x_pp(500, 525);
```

Where this really shines is placing shapes in drawing routines and text in a
very precise manner which usually deal in <code>GRect</code>s. This can be done
with a native <code>GRect</code> and specifying with the library only those
values that need to differ (i.e: 'per platform'):

```c
// Larger only on Emery!
const GRect logo_rect = GRect(
  scl_x(250),
  scl_y(330),
  scl_x_pp({.o = 200, .e = 250}),
  scl_y_pp({.o = 200, .e = 280})
);
```

## Only Half The Battle

As alluded to above, simply placing layers in proportionally-correct locations
and sizes on a larger display doesn't get you all the way to a nice-looking,
readable and usuable Emery upgrade - fonts also need scaling!

![](assets/media/2026/02/scalable-no-fonts.png)

Another problem that would be coming up often was ripe for trying to solve with
the library - but how? System font size choices are very limited
(18, 24, 28, etc.) and custom fonts are specified by the developer in the
package file with unpredictable code symbols IDs.

After some trial and error, I used a similar syntax but give developers the
opportunity to specify which fonts they want used in the <i>same situation</i>,
identifiable using some constant ID which they can choose. Thus, they load the
fonts they want to use and tell the library which one to use on which platform
with their ID.

In this example, choosing between different system fonts, although custom font
sizes can be estimated by increasing the point size by the increase in screen
area as a percentage (for Emery this is about 30%):

```c
// Choose IDs for each font category (such as t-shirt size or use-case)
typedef enum {
  FID_Small = 0,
  FID_Medium,
  FID_Large
} FontIds;

// Load fonts to use in each case
static GFont s_gothic_14, s_gothic_18, s_gothic_24, s_gothic_28;

// During init()
static void init_scalable_fonts() {
  s_gothic_14 = fonts_get_system_font(FONT_KEY_GOTHIC_14);
  s_gothic_18 = fonts_get_system_font(FONT_KEY_GOTHIC_18);
  s_gothic_24 = fonts_get_system_font(FONT_KEY_GOTHIC_24);
  s_gothic_28 = fonts_get_system_font(FONT_KEY_GOTHIC_28);

  // The small font - regular screens use Gothic 14, Emery uses Gothic 18
  scl_set_fonts(FID_Small, {.o = s_gothic_14, .e = s_gothic_18});

  // Same with other categories
  scl_set_fonts(FID_Medium, {.o = s_gothic_18, .e = s_gothic_24});
  scl_set_fonts(FID_Large, {.o = s_gothic_24, .e = s_gothic_28});
}
```

Then, when you need to reach for a font, simply ask the library to give you
the right one:

```c
// Choose size ID, font is selected automatically
graphics_context_set_text_color(ctx, GColorBlack);
graphics_draw_text(
  ctx,
  "This is example text in a scalable position with a scalable font!",
  scl_get_font(FID_Medium),
  scl_grect(0, 330, 1000, 330),
  GTextOverflowModeWordWrap,
  GTextAlignmentCenter,
  NULL
);
```

Of course, this means that some fonts get loaded always but never used - this is
a future problem I want to solve with some more brain power application...

## Images...

Image scaling is a slightly harder problem to solve since they are not generally
created at run-time. The developer needs to create them at a size appropriate
for each display size beforehand.

The Pebble SDK (as usualy demonstrating its incredible foresight) allows the
developer to tag files for use on each platform after defining it just once
in the package file and correctly naming the alternatives:

```json
"resources": {
  "media": [
    {
      "type": "bitmap",
      "name": "IMAGE_RATE",
      "file": "images/rate.png"
    }
  ]
}
```

Thus, you supply <code>rate.png</code> for all platforms, but
<code>rate~emery.png</code> that is selected automatically for Emery builds.

By combining this with positions and sizes using <code>pebble-scalable</code>
functions, you can ensure the right image with the right size is shown in the
right position.

Yes, I was glad that this SDK capability played so well into my hands!

## Conclusion

There we have it - a quick tour of <code>pebble-scalable</code> and the features
it offers. Since creating it, I've found updating older apps a breeze - usually
by simply converting hard-coded positions and sizes into original display
percentages and throwing them into the library!

Here's a gallery of comparisons of what is possible and already out there ready
for when users receive their PT2 units:

![](assets/media/2026/02/scalable-news-headlines.png)

![](assets/media/2026/02/scalable-thin.png)

![](assets/media/2026/02/scalable-muninn.png)

![](assets/media/2026/02/scalable-beam-up.png)

If you're interested, please give it a try! You can find it on NPM, and the
source code
[here](https://github.com/C-D-Lewis/pebble-dev/tree/master/libraries/pebble-scalable).
