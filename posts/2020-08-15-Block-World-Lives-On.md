Block World Lives On!
2020-08-15 16:40
JavaScript,Pebble
---

(Project from May 2020)

Back during the development of the Pebble Time smartwatch (the first with a
color e-paper display), there came day when a very first bleeding edge internal
firmware build was available. It wasn't stable, still used most of the UI from
the orignal Pebble, but it finally enabled SDK users to draw color to the
display. Granted, you had to build an SDK build yourself from the firmware,
but this was a really worthwhile reason to do so.

After the obligatory color text, images, laughing at memes on each other's
watches, I came across a simple way to draw isometric shapes:

<!-- language="js" -->
<pre><div class="code-block">
output.x = input.x - input.y
output.y = (input.x / 2) + (input.y / 2) - input.z
</div></pre>

I had a play around with Java2D drawing and found it easy to draw isomatric
rectangles, filling them in by drawing more lines vertically down the drawing
area. Soon after I'd moved on to drawing 3D cubes and even simple image
textures in a similar way.

![](assets/media/2020/08/iso-java.png)

## Teeny Tiny Blocks

So of course, it was natural to port this to the Pebble Time and have some fun
with it. The first person I showed who was also a die-hard Pebble tinkerer
straight away said "Cool! Looks like Minecraft!" and so I had another idea...

A 3D array of blocks, each with different colors and behaviors... And so
[pebble-hacks/block-world](https://github.com/C-D-Lewis/block-world) was born
after a few feverish nights coding.

![](assets/media/2020/08/block-world.jpg)

The buttons are used to moved a tiny wireframe cursor and select one of about
five block types to place, and there were even a few tiny moving clouds gliding
across the top of the box. The total size of the 3D array was limited by the
memory limit for external apps (had I known how to make it in as a firmware app
I could have used much more memory, but by that point the blocks would be too
small).

As is my style, I thought I'd created something useful - and so published the
core drawing routines as a library called
[pebble-isometric](https://github.com/C-D-Lewis/pebble-isometric). I don't think
anyone else used it, but it's a cool concept.

## After Pebble

I recently came back across this project while I was browing for forks in my
GitHub account I no longer needed, and while the <code>pebble-hacks</code> org
is still available, it won't be forever. And there are lots of awesome
open-source repositories it would be a shame to lose.

So I decided to spend an afternoon porting the library <i>and</i> the
block-world demo to a vanilla JavaScript web library and webapp, for posterity.

And so, present to you the imageinatively named
[isometric-js!](https://github.com/C-D-Lewis/isometric-js). It includes all the
same basic drawing routines as well as a few interesting demos including the
block-world demo. It's not interactive in the same way, but still looks awesome.

![](assets/media/2020/08/clouds.gif)

The usage is still basically the same, using routines as and when during Canvas
drawing:

<!-- language="js" -->
<pre><div class="code-block">
Isometric.init('black', { x: 40, y: 100 });

Isometric.renderScene((width, height) => {
  const rect = { x: 0, y: 0, z: 0, width: 50, height: 50 };
  Isometric.filledRect(rect, 'red');

  const box = { x: 0, y: 0, z: 0, width: 30, height: 30 };
  const boxHeight = 100;
  Isometric.filledBox(box, boxHeight, 'blue');
});
</div></pre>

Feel free to check out the repository and see some of the other examples
included, if only to reminisce about how awesome color on Pebble proved to be.
