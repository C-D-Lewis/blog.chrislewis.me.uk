Isometric Library in Java
2015-05-03 19:44:07
Java,Pebble,Releases
---

A feverish evening spent with little else to do resulted in a quick port of my <a href="http://github.com/C-D-Lewis/isometric">isometric Pebble library</a> to Java Canvas with Graphics2D. Might prove useful for an isometric tile game or such if the mood takes me. There's something distinctly satisfying about seeing the same results on a different platform.

![](/assets/import/media/2015/05/screenshot.png)

To use, create a context where a <code>Graphics2D</code> object is available, then use static methods of the <code>Isometric</code> class to draw stuff.

```java
public void program(Graphics2D g2d) {
  // Black background
  g2d.setColor(Color.BLACK);
  g2d.fillRect(0, 0, Build.WINDOW_SIZE.width, Build.WINDOW_SIZE.height);

  Isometric.drawRect(g2d, new Vec3(100, 100, 100), new Dimension(100, 100), Color.BLUE);
  Isometric.fillRect(g2d, new Vec3(50, 50, 50), new Dimension(50, 50), Color.RED);

  Isometric.fillBox(g2d, new Vec3(150, 150, 150), new Dimension(25, 25), 25, Color.YELLOW);
  Isometric.drawBox(g2d, new Vec3(150, 150, 150), new Dimension(25, 25), 25, Color.BLACK);
}
```

You can see all the applicable code <a title="GitHub repo" href="https://github.com/C-D-Lewis/isometric-java">on GitHub</a>.
