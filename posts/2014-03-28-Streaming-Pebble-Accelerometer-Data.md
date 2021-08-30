Streaming Pebble Accelerometer Data
2014-03-28 19:46:25
Android,Pebble,Integration,C++
---

<strong>Updates
## - 30/3/14 - Added links to source code

It's been a long term aim of mine to try and speed up <code>AppMessage</code> as fast as I can, in order to transfer more than mere signal messages between the phone and the watch. An example of this is the long time it takes to send responses to the watch in <a title="Wristponder on Google Play" href="https://play.google.com/store/apps/details?id=com.wordpress.ninedof.wristponder">Wristponder</a> (although now that only applies when a change takes place, thanks to the <a title="Persistent Storage" href="https://developer.getpebble.com/2/api-reference/group___storage.html">Persistent Storage API</a>).

An ideal use case for this is some sort of accelerometer data stream, so I set to it. I realised that the key to the fastest possible <code>AppMessage</code> speed is to send the next message as soon as possible, when the last one has been received on the other side. If a waiting period is not observed, there will be problems, such as <code>APP_MSG_BUSY</code> or <code>APP_BSG_BUFFER_OVERFLOW</code>. The solution I used uses the <code>app_message_outbox_sent()</code> callback to send the next message. This function is called as soon as the other side <code>ACK</code>nowledges the last message, signalling that it is ready for the next.

Gathering the accelerometer data asynchronously into a global storage array:

<!-- language="cpp" -->
<pre><div class="code-block">
static void accel_new_data(AccelData *data, uint32_t num_samples)
{
  for(uint32_t i = 0; i < num_samples; i++)
  {
    latest_data[(i * 3) + 0] = (int)(0 + data[i].x);  //0, 3, 6
    latest_data[(i * 3) + 1] = (int)(0 + data[i].y);  //1, 4, 7
    latest_data[(i * 3) + 2] = (int)(0 + data[i].z);  //2, 5, 8
  }
}
</div></pre>

And sending it when the previous message has been <code>ACK</code>nowledged:

<!-- language="cpp" -->
<pre><div class="code-block">
static void send_next_data()
{
  DictionaryIterator *iter;
  app_message_outbox_begin(&iter);

  for(int i = 0; i < NUM_SAMPLES; i++)
  {
    for(int j = 0; j < 3; j++)
    {
      int value = 0 + latest_data[(3 * i) + j];
      Tuplet t = TupletInteger((3 * i) + j, value);
      dict_write_tuplet(iter, &t);
    }
  }

  app_message_outbox_send();
}

static void out_sent_handler(DictionaryIterator *iter, void *context)
{
  //CAUTION - INFINITE LOOP
  send_next_data();

  //Show on watch
  static char buffs[3][32];
  snprintf(buffs[0], sizeof("X: XXXXX"), "X: %d", latest_data[0]);
  snprintf(buffs[1], sizeof("Y: YYYYY"), "Y: %d", latest_data[1]);
  snprintf(buffs[2], sizeof("Z: ZZZZZ"), "Z: %d", latest_data[2]);
  text_layer_set_text(x_layer, buffs[0]);
  text_layer_set_text(y_layer, buffs[1]);
  text_layer_set_text(z_layer, buffs[2]);
}
</div></pre>

An additional measure that helps speed things up is temporarily reducing the 'sniff interval' of the Bluetooth module to '<code>SNIFF_INTERVAL_REDUCED</code>':

<!-- language="cpp" -->
<pre><div class="code-block">
app_comm_set_sniff_interval(SNIFF_INTERVAL_REDUCED);
</div></pre>

And collecting accelerometer data at a faster rate than it is consumed, to avoid sending duplicate frames. This appears to be about 15 <code>AppMessage</code>s per second, each packed with 30 <code>int</code>s representing 10 time-spliced samples from the accelerometer, with a total throughput of approximately 1.6 KBps.

The end result looks like this (using the excellent <a href="http://android-graphview.org/" title="GraphView">Android GraphView library</a>):
![](/assets/import/media/2014/03/screenshot_2014-03-26-19-21-09.png?w=545)The next step may be to implement some sort of gesture recognition to enable movements to control some external application. We shall see!

## Source code
<a href="https://github.com/C-D-Lewis/accelstream-android" title="Android source">Android</a>
<a href="https://github.com/C-D-Lewis/accelstream-pebble" title="Pebble source">Pebble</a>

&nbsp;
