Update: Pebble Spark Core Control
2014-04-05 17:07:35
Integration,Pebble,Spark Core
---

<strong>Updates:

## - <del>Appears the return_code from the Core is not always that which is requested. Works well for Pin D0 though.</del>

## - Source code repo updated. All Dx pins now work. Uses jQuery. <del>Still READY-TIMEOUTs though...</del>

I've revisited my control of the <a title="Spark Core" href="http://spark.io">Spark Core</a> Dx pins, with some polishing up and JS driven UI updating so I know the response has been received from the Spark Cloud.

![](/assets/import/media/2014/04/pebble-screenshot_2014-04-05_17-55-09.png)

I'm loving working with it again, and can't wait to build some real remote controlled device, but that will have to wait for another day. I plan to release this app eventually, possibly under the name of PebbleTinker, derived from the stock <a title="Tinker" href="http://docs.spark.io/#/start/tinkering-with-tinker">Tinker app</a> for Spark Core, and all looks to be working fine, but I'm being haunted by the READY-TIMEOUT, where PebbleKit JS is killed after about ten seconds after install. Once this is fixed, I look forward to releasing!

If you want to give it a go early, the source code is partly available on <a title="Source" href="https://github.com/C-D-Lewis/pebble-tinker">GitHub</a>.
