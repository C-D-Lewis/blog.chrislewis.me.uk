Rendering Minecraft Worlds on AWS Fargate
2021-01-31 13:31
JavaScript,Integration,Java,AWS
---

![](assets/media/2021/01/chunky-fargate-sample.png)

This personal project is one of those rare beasts - one that has long-lasting
usefulness beyond the initial building of it. It doesn't have to be the case to
be a worthwhile project, but it helps!

For a long time I've been keeping an eye on a niche open source project in the
Minecraft community called [Chunky](https://chunky.llbit.se/). It's a Java-based
app that loads chunks from a Minecraft world, allows you to set up a scene with
aspects such as lighting, camera, material properties, etc., and finally to
perform ray-traced rendering of that scene. The results offer a very pretty
view of a world that myself or a group of friends have worked hard on and gives
an opportunity to showcase it. Here's an example of a recent world rendered from
a Christmas community server:

![](assets/media/2021/01/chunky-fargate-village.png)

## Chunky

After arranging a scene in Chunky, the output is a JSON file containing all the
parameters that set up the shot including all the factors mentioned above. You
can run the <code>ChunkyLancher.jar</code> file with many parameters to perform
the same rendering from a terminal as in the Chunky GUI. The number of samples
per pixel (iterations) and the name of the scene are the main parameters:

<!-- language="shell" -->
<pre><div class="code-block">
java \
  --module-path "/usr/share/maven-repo/org/openjfx/javafx-controls/11/:/usr/share/maven-repo/org/openjfx/javafx-base/11/:/usr/share/maven-repo/org/openjfx/javafx-graphics/11/:/usr/share/maven-repo/org/openjfx/javafx-fxml/11/" \
  --add-modules=javafx.controls,javafx.base,javafx.graphics,javafx.fxml \
  -Dchunky.home="$(pwd)" \
  -jar ChunkyLauncher.jar \
  -f \
  -target $TARGET_SPP \
  -render $SCENE_NAME
</div></pre>

This is the first step towards automation. On to Docker!

## Dockerisation



## Conclusion

As always, check out all the source code in the
[GitHub repository](https://github.com/C-D-Lewis/stack-chat).
