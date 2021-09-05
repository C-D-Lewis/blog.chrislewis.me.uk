Block Game using Pebble Accelerometer
2014-04-24 16:35:38
Android,Integration,Pebble,Games
---

<strong>Edit: A gist of the PebbleGestureModel.java file is <a title="PGM" href="https://gist.github.com/C-D-Lewis/ba1349bb0ebdee76b0cf">now available</a>, but not polished.

In snatches of down time over the last few weeks I <a title="Streaming Pebble Accelerometer Data" href="http://ninedof.wordpress.com/2014/03/28/streaming-pebble-accelerometer-data/">created a stream of Pebble accelerometer data</a> and integrated it into a new version of my Android game engine, which I have plans for using over the summer for a proper implementation of a few game ideas I've toyed with over the last year or so.

After further small bits of work, I created a class called PebbleGestureModel, which receives new X, Y and Z data and performs threshold and duration checks (to prevent continuous firing) before executing abstract actions, implemented upon instantiation. Below is an example with no actions assigned for an acceleration threshold of 800 (g is approximately 1000), a minimum duration between firing actions and operating in the tilt mode :

```java
PebbleGestureModel model = new PebbleGestureModel(800, 1000L, PebbleGestureModel.MODE_TILT) {

  @Override
  public void onWristUp() {

  }

  @Override
  public void onWristRight() {

  }

  @Override
  public void onWristLeft() {

  }

  @Override
  public void onWristDown() {

  }

  @Override
  public void onActionEnd() {

  }

};
```

The result of this is a simple 'game' consisting of a randomly generated 'world' of 10 x 10 blocks, with two blocks nominated as the Finish and Player respectively. Touching the 'world' generates a new random one. At the moment the Player and Finish are randomly placed on valid non-solid tiles, but are not path-checked. If no path connects them, I just touch for a new one until a valid one is found.

![](/assets/import/media/2014/04/screenshot_2014-04-22-01-48-53.png?w=545)

The Player block is controlled by accelerometer data from the Pebble, and can operate in two modes: <code>MODE_FLICK</code> and <code>MODE_TILT</code>. In <code>MODE_FLICK</code> a flick of the extended watchface-up wrist in each direction will trigger an abstract method to allow an action to be taken. Similarly in <code>MODE_TILT</code> the actions are triggered when the wrist is tilted left or right, or the arm is pointed up or down. The START button is used to start the data stream and the INSTALL button is used to install the streaming watchapp. The four black squares show the current actuating direction induced by the watch, and the first sample of the last received <code>AppMessage</code> (currently 5 samples per message) is shown at the bottom.

Here is a video of the 'game' in action, showing the accelerometer control:

https://www.youtube.com/watch?v=fuRA4R5xI2o

I'm not releasing the source code to this yet, as it's untidy due to it's ad-hoc development and it doesn't do much game-wise, but may tidy it up and release it soon.
