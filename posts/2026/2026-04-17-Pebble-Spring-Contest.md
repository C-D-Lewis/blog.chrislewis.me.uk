Pebble Spring Contest
2026-04-17 19:08
Pebble,Releases
---

On April 2nd, Pebble
[announced](https://repebble.com/blog/spring-2026-pebble-app-contest) the launch
of a springtime developer contest to celebrate Pebble Time 2 entering mass
production (a large milestone from what I can remember) and it's been a lot of
fun. And of course, many prizes are up for grabs!

In the same way I remember the in-person hackathons I attended in San Francisco,
Mountain View, and over at Yale (for that fateful night I discovered why coffee
is so great), the sense of speed, fun, creativity, and experimentation is alive
and well, with hundreds of developers entering their new watchfaces and
watchapps.

## Joining In

That includes me! There have been two rounds - week one and week two. I was
quite late to the party (four days in). I didn't expect to win this time but it
was a good opportunity to try an idea I had for a while - using the
[pebble-isometric](https://github.com/C-D-Lewis/pebble-dev/tree/master/libraries/pebble-isometric)
library (once again!) for a watchface with a moving, multi-level background of
blocks on a much larger scale than Isotime or Void Statues.

The result was
[Patchwork](https://apps.repebble.com/patchwork_4b5cfd6f43024c438591c2c7)! It
was relatively simple to achieve and add a time/date display to, but I found
that the sheer amount of line drawing that was required meant the animation was
extremely slow. So, instead I focused on making it look good and making it
customizable, so there are a range of themes to choose from!

![](assets/media/2026/04/patchwork.png)

So that was a fun and decent entry for week one. But week two loomed...

## Getting Serious

```callout
As of writing week two is still ongoing! And competition is fierce. I would not
be surprised if it came down to alphabetical sorting if many top-5 positions
tied.
```

That said, my position is favorable, but I don't know if I can last another two
days - so if you want to help (and earn my great appreciation!) you can give my
entry [Skyarc](https://apps.repebble.com/cac3689b5691473da9e3410b) a heart, and
share it with your friends and connections!

![](assets/media/2026/04/please.gif)

![](assets/media/2026/04/leaderboard.png)

Now that's out of the way, I can speak a bit more about it. The idea was to make
a design that was round-first - meaning the upcoming Pebble Round 2 and Pebble
Time Round from back in the day. It's something I haven't really done very
seriously. I had an idea that the arcs could show a whole day of weather (which
I know has been done before a few times) but with a twist - try and show many
levels of data at a glance <i>without</i> over-cluttering the display.

After downloading data from [OpenMeteo](https://open-meteo.com/) and playing
around with which data I wanted (made easier once again with PKTS!), I worked
on drawing arc segments according to the following schemes:

- Outer ring showing general weather conditions (grays for cloud, blues for rain, white for fog and snow etc.) or clear if clear

- Inner ring showing relative temperatures with deeper colors for the extreme min/max, and a couple of lighter shades for temperatures within one and two degrees of those.

- Markers in pink and orange for sunrise and sunset times respectively.

In addition, general things you need to have:

- Clear time and date in the middle

- Battery life meter in green on gray

- Above meter changes to gray if the watch becomes disconnected.

![](assets/media/2026/04/skyarc1.png)

So far, so good. Another thing watches can do is react to a tap or shake, so I
opted to use this state to show more things:

- Rain chance for the day, using the thickness of the outer arc segments that increases with chance.

- Current conditions (high/low, wind speed, humidity, current conditions) in the middle.

![](assets/media/2026/04/skyarc2.png)

The first version of that had whole segments with gradations of blue but after a
user suggestion, thickness of the arc feels a lot more expressive.

## Enhancements

After a couple of initial releases and more late nights, I added more new
features and settings including:

- Option to enable/disable animations.

- Choice of units for temperature and wind speed.

- Choice of a number of deep shades for a background color.

This last one really helps the watchface pop! While I was at it, I found that it
would not be too impossible to support black and white watches, with some
guidance needed - as color would be limited to three (white, black, dithered
gray).

The new rules for black and white:

- Outer arc shows grey for cloud, black for clear, and white for anything interesting (rain, snow, storm, fog etc.)

- Inner arc still shows gradations for temperatures close to the min/max for the
  day, but with the knowledge that the coldest extreme is probably earlier in
  the day than the hottest one, so it can be worked out.

- On shake/tap, the thickness of the rain arc speaks for itself as it did before

![](assets/media/2026/04/collection.png)

## Conclusion

I'm quite proud of this one! Thanks to the fun, spirit, interactivity of the
ongoing contest, it has grown from the seeds of an idea to a well fleshed-out
watchface, and there is still more scope for more settings, showing more data
(angled lines for wind speed?) and more.

But for now, I'm left wondering if sheer momentum can carry me to the end and
remain in the top five, or if I'll spend so long in the running and be squeezed
out right at the end. But it will have been for a good reason because all the
submissions near the top deserve their spots as they are fun, creative, and
well executed.

So once again I will ask for a heart if you like this watchface and/or enjoyed
this post about it! I hope for more such contests/hackathons in the future as
they are great for enthusing the Pebble developer community!

[Skyarc](https://apps.repebble.com/cac3689b5691473da9e3410b) can be tried (and
hearted!) for all Pebble watches. Your support is appreciated!

As always, the [souce
code](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchfaces/skyarc) is
also available.
