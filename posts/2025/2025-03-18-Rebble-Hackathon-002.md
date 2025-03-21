Rebble Hackathon 002
2025-03-03 14:01
Pebble,Releases
---

At the start of March I took part in the second
[Rebble Hackathon](https://rebble.io/hackathon-002/) amidst the excitement of
[RePebble](https://repebble.com/) and a resurgence of interest in the Pebble
developer platform.

![](assets/media/2025/03/hackathon.png)

It was an awesome week hanging out in the [Discord](https://rebble.io/discord)
seeing names old and new go past, and seeing all the awesome new projects being
worked on - new watchfaces with bold new designs, new apps and integrations
with modern platforms, work on the recently open-sourced
[Pebble firmware](https://github.com/google/pebble), and even a new assistant app reminiscent of Snowy!

## Contributions

For my part I had a few main ideas:

- Resurrect old watchfaces from the [repository](https://github.com/c-d-lewis/pebble-dev).

- Port some watchfaces from the FitBit era to Pebble (in a fit of irony!).

- See what the developer documentation would look like with a more modern, documentation-focused static site builder than the original Jekyll one.

## Resurrections

I reworked my [pebble-dev](https://github.com/C-D-Lewis/pebble-dev) repository
to clearly sort the projects by type, and updated the README file to show which
are buildable, with known issues, and link to freshly built PBW files for
installation.

![](assets/media/2025/03/resurrections.png)

In total I reckon about 8 projects were fixed up - involving SDK layout updates,
updating build scripts, converting manifests, and fixing references to old SDK
symbols where necessary. I will continue to add new projects here and to try and
resurrect more in the future!

## Re-imaginings

Since the original demise of Pebble Inc, I made a
[decent number](https://gallery.fitbit.com/search?terms=chris%20lewis) of
watchfaces (sorry, clocks) and moved big apps like News Headlines
and Tube Status to the FitBit platform, though it was a significantly different
environment - JS only, little device accessory support, XML and SVG for layouts
etc.

![](assets/media/2025/03/fitbit.png)

After some pleasant effort back in the Pebble SDK world (of windows, layers,
subscriptions!) I moved across the Pseudotime, Dayring, and Hollywatch.

![](assets/media/2025/03/pseudotime.jpg)

![](assets/media/2025/03/dayring.jpg)

![](assets/media/2025/03/hollywatch.jpg)

One last watchface - Deep Rock - is in progress though, so another will make it
across eventually.

![](assets/media/2025/03/deeprock.jpg)

## Documentation

Thanks for effort by other participants, it is now possible to build and run
the original <code>developers.getpebble.com</code> repository (ah, memories!)
used for the Rebble documentation
[mirror](https://developer.rebble.io/developer.pebble.com/guides/index.html).

At least now it will be possible to add forgotten details, remove inaccuracies
and mistakes (my bad!) and even new examples and references for any upcoming
new devices or platforms.

However, I wondered if it would be easier to take the content and move it to
a new static site builder (before the above was possible again) since there
was a lot of special handlebars and Ruby magic that went into making it build,
such as platform-specific paragraphs, code snippets, images, as well as a
custom way to link pages and the C docs, which were built from the Pebble
firmware repository.

I selected [mkdocs](https://www.mkdocs.org/) given the focus on documentation
and a wide ecosystem of plugins, themes, and extentions. A project that had
a thin configuration and then just plain old Markdown content would be easy
for anyone to edit and contribute, and should be searchable and easy to build
and deploy as well.

Though I had to go away half-way through the week, I managed to prove out
something using the App Resources section of the guides and a Rebble-esque
color palette on the Material theme:

![](assets/media/2025/03/rebble-docs.png)

It built fast, was easy to customize, and looked reasonably neat and tidy! I
also added the tutorials as a way to test moving across the more complex sets
of pages, which was relatively painless with some good use of multi-find and
replace.

![](assets/media/2025/03/tutorial.png)

Late in the day, I tried including the <code>mkdoxy</code> plugin to generate
pages from the Doxygen docs included in the firmware, in the <code>applib</code>
directory that has most of the SDK exposed methods, although the initial results
were promising, far too much content was output. Maybe in time it can be
refined.

If there's demand, it can be a starting point for a new effort, but ultimately
served its purpose to find out how hard it would be - not very!

## Conclusion

So there it is - a fun week and hopefully a lot more fun to come! You can find
the projects involved with the links below:

- [Pebble open-source firmware](https://github.com/google/pebble/tree/main)

- [Devsite source code](https://github.com/google/pebble/tree/main/devsite)

- [My pebble-dev repo](https://github.com/c-d-lewis/pebble-dev/)

- [Experimental new devsite](https://github.com/C-D-Lewis/rebble-docs)
