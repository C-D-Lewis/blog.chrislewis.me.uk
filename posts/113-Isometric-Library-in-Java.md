---
index: 113
title: Isometric Library in Java
postDate: 2015-05-03 19:44:07
original: https://ninedof.wordpress.com/2015/05/03/isometric-library-in-java/
---

A feverish evening spent with little else to do resulted in a quick port of my [isometric Pebble library](http://github.com/C-D-Lewis/isometric) to Java Canvas with Graphics2D. Might prove useful for an isometric tile game or such if the mood takes me. There's something distinctly satisfying about seeing the same results on a different platform.

![](/assets/media/2015/05/screenshot.png)

To use, create a context where a <code>Graphics2D</code> object is available, then use static methods of the <code>Isometric</code> class to draw stuff.

[code language="java"]
public void program(Graphics2D g2d) {
  // Black background
  g2d.setColor(Color.BLACK);
  g2d.fillRect(0, 0, Build.WINDOW_SIZE.width, Build.WINDOW_SIZE.height);

  Isometric.drawRect(g2d, new Vec3(100, 100, 100), new Dimension(100, 100), Color.BLUE);
  Isometric.fillRect(g2d, new Vec3(50, 50, 50), new Dimension(50, 50), Color.RED);

  Isometric.fillBox(g2d, new Vec3(150, 150, 150), new Dimension(25, 25), 25, Color.YELLOW);
  Isometric.drawBox(g2d, new Vec3(150, 150, 150), new Dimension(25, 25), 25, Color.BLACK);
}
[/code]

You can see all the applicable code [on GitHub](https://github.com/C-D-Lewis/isometric-java).
