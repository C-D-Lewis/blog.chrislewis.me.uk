---
index: 87
title: Update: Pebble Spark Core Control
postDate: 2014-04-05 17:07:35
original: https://ninedof.wordpress.com/2014/04/05/update-pebble-spark-core-control/
---

Updates:

## - <del>Appears the return_code from the Core is not always that which is requested. Works well for Pin D0 though.</del>

## - Source code repo updated. All Dx pins now work. Uses jQuery. <del>Still READY-TIMEOUTs though...</del>

I've revisited my control of the [Spark Core](http://spark.io) Dx pins, with some polishing up and JS driven UI updating so I know the response has been received from the Spark Cloud.

![](http://ninedof.files.wordpress.com/2014/04/pebble-screenshot_2014-04-05_17-55-09.png)

I'm loving working with it again, and can't wait to build some real remote controlled device, but that will have to wait for another day. I plan to release this app eventually, possibly under the name of PebbleTinker, derived from the stock [Tinker app](http://docs.spark.io/#/start/tinkering-with-tinker) for Spark Core, and all looks to be working fine, but I'm being haunted by the READY-TIMEOUT, where PebbleKit JS is killed after about ten seconds after install. Once this is fixed, I look forward to releasing!

If you want to give it a go early, the source code is partly available on [GitHub](https://github.com/C-D-Lewis/pebble-tinker).
