---
index: 85
title: Streaming Pebble Accelerometer Data
postDate: 2014-03-28 19:46:25
original: https://ninedof.wordpress.com/2014/03/28/streaming-pebble-accelerometer-data/
---

Updates
## - 30/3/14 - Added links to source code

It's been a long term aim of mine to try and speed up <code>AppMessage</code> as fast as I can, in order to transfer more than mere signal messages between the phone and the watch. An example of this is the long time it takes to send responses to the watch in [Wristponder](https://play.google.com/store/apps/details?id=com.wordpress.ninedof.wristponder) (although now that only applies when a change takes place, thanks to the [Persistent Storage API](https://developer.getpebble.com/2/api-reference/group___storage.html)).

An ideal use case for this is some sort of accelerometer data stream, so I set to it. I realised that the key to the fastest possible <code>AppMessage</code> speed is to send the next message as soon as possible, when the last one has been received on the other side. If a waiting period is not observed, there will be problems, such as <code>APP_MSG_BUSY</code> or <code>APP_BSG_BUFFER_OVERFLOW</code>. The solution I used uses the <code>app_message_outbox_sent()</code> callback to send the next message. This function is called as soon as the other side <code>ACK</code>nowledges the last message, signalling that it is ready for the next.

Gathering the accelerometer data asynchronously into a global storage array:

[code language="cpp"]
static void accel_new_data(AccelData *data, uint32_t num_samples)
{
	for(uint32_t i = 0; i &lt; num_samples; i++)
	{
		latest_data[(i * 3) + 0] = (int)(0 + data[i].x);	//0, 3, 6
		latest_data[(i * 3) + 1] = (int)(0 + data[i].y);	//1, 4, 7
		latest_data[(i * 3) + 2] = (int)(0 + data[i].z);	//2, 5, 8
	}
}
[/code]

And sending it when the previous message has been <code>ACK</code>nowledged:

[code language="cpp"]
static void send_next_data()
{
	DictionaryIterator *iter;
	app_message_outbox_begin(&amp;iter);

	for(int i = 0; i &lt; NUM_SAMPLES; i++)
	{
		for(int j = 0; j &lt; 3; j++)
		{
			int value = 0 + latest_data[(3 * i) + j];
			Tuplet t = TupletInteger((3 * i) + j, value);
			dict_write_tuplet(iter, &amp;t);
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
	snprintf(buffs[0], sizeof(&quot;X: XXXXX&quot;), &quot;X: %d&quot;, latest_data[0]);
	snprintf(buffs[1], sizeof(&quot;Y: YYYYY&quot;), &quot;Y: %d&quot;, latest_data[1]);
	snprintf(buffs[2], sizeof(&quot;Z: ZZZZZ&quot;), &quot;Z: %d&quot;, latest_data[2]);
	text_layer_set_text(x_layer, buffs[0]);
	text_layer_set_text(y_layer, buffs[1]);
	text_layer_set_text(z_layer, buffs[2]);
}
[/code]

An additional measure that helps speed things up is temporarily reducing the 'sniff interval' of the Bluetooth module to '<code>SNIFF_INTERVAL_REDUCED</code>':

[code language="cpp"]
app_comm_set_sniff_interval(SNIFF_INTERVAL_REDUCED);
[/code]

And collecting accelerometer data at a faster rate than it is consumed, to avoid sending duplicate frames. This appears to be about 15 <code>AppMessage</code>s per second, each packed with 30 <code>int</code>s representing 10 time-spliced samples from the accelerometer, with a total throughput of approximately 1.6 KBps.

The end result looks like this (using the excellent [Android GraphView library](http://android-graphview.org/)):
![](http://ninedof.files.wordpress.com/2014/03/screenshot_2014-03-26-19-21-09.png?w=545)The next step may be to implement some sort of gesture recognition to enable movements to control some external application. We shall see!

## Source code
 [Android](https://github.com/C-D-Lewis/accelstream-android)
 [Pebble](https://github.com/C-D-Lewis/accelstream-pebble)

&nbsp;
