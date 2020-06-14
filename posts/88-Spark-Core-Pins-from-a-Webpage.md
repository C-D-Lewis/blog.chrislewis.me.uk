---
id: 1848
title: Spark Core Pins from a Webpage
postDate: 2014-04-07 16:12:43
original: https://ninedof.wordpress.com/2014/04/07/spark-core-pins-from-a-webpage/
---

Building on the small amount of JavaScript code developed by controlling the Spark Core pins from my Pebble, I decided to write a basic webpage to allow me to perform the same control functions but from a browser. Sure, it's been done before, but as I have no real expertise or experience of JavaScript beyond that used for PebbleKit JS apps, and virtually none at all for HTML, it seemed like a good learning opportunity.

And it turned out to be easier than expected! After a couple of hours, the basic code was in place. The webpage looks like this:

![](http://ninedof.files.wordpress.com/2014/04/jquery-core.png)Nothing too pretty to look at, but does the job well.

During the aforementioned Pebble project,  [I sought help with a problem](https://community.spark.io/t/pin-argument-for-spark-function-is-always-0-solved/3794) in getting the same pin number back as I sent to the Spark Cloud. The solution to this turned out to be specifying the Spark.function() parameter string as a key-value dictionary, making the core (aha) code segment in this webpage as so:

[code language="js"]
//Send the request to the Core
var sendRequest = function(pin, on, device_id, access_token) {
	var url;
	if(on) {
		url = &quot;https://api.spark.io/v1/devices/&quot; + device_id + &quot;/on?access_token=&quot; + access_token;
	} else {
		url = &quot;https://api.spark.io/v1/devices/&quot; + device_id + &quot;/off?access_token=&quot; + access_token;
	}

	console.log(&quot;jQuery AJAX: Requesting pin &quot; + pin + &quot; &quot; + (on == true ? &quot;on&quot; : &quot;off&quot;) + &quot;...&quot;);

	//Send request using jQuert AJAX
	$.ajax({
	  type: &quot;POST&quot;,
	  url: url,
	  data: {&quot;args&quot;:pin},
	  success: success,
	  dataType: &quot;json&quot;
	});
};
[/code]

The entire project (three files!) can be found on  [GitHub here](https://github.com/C-D-Lewis/core-pins-js/tree/master). I may expand it to include more functions in the future, but at the moment it provides a good platform to play around with, and I've learned a small amount about HTML forms and using jQuery. Time well spent!

&nbsp;
