---
index: 47
title: Watch Trigger + for Pebble: Initial Release 
postDate: 2013-09-22 20:56:21
original: https://ninedof.wordpress.com/2013/09/22/watch-trigger-for-pebble-initial-release/
---

<p style="text-align:left;">![](http://ninedof.files.wordpress.com/2013/09/logosrc.png)Introduction</p>
After the success of the first Watch Trigger, and a good deal of requests, I spent another two weeks to build upon and improve the experience. The result of all this work is Watch Trigger + (or Plus), and boasts this list of improvements:


	- Remote triggering of video capture, as well as photo capture
	- New landing screen for mode selection and a single access point to the Settings menu
	- Settings menu has been re-vamped to enable expansion with new settings in the future using PreferenceHeaders.
	- Included Gingerbread devices in the Media Gallery scanning functionality, as there were problems previously. Gingerbread devices will use Intent driven media scanning instead of Honeycomb + devices using a MediaScanner connection and callback method.
	- File names are now based on the time and date they were taken.
	- Removed watch-app autostart when entering either of the viewfinder Activities. This approach led to some AppSync difficulties with the improvements in the next bullet point;
	- Enhanced Watch App that adapts its layout depending on which shooting mode the Android app is currently in.
	- More stability fixes, including slightly faster Photo Viewfinder startup time.


<p style="text-align:left;">Screenshots</p>
<p style="text-align:left;">The new landing screen for mode selection:</p>
<p style="text-align:left;">![](http://ninedof.files.wordpress.com/2013/09/shot11.png)This Activity is fitted with some smooth and subtle animations to make it feel a lot nicer to use. Also note the single access point to the Settings menu on the ActionBar at the top right.</p>
<p style="text-align:left;">The new Video Viewfinder:</p>
<p style="text-align:left;">![](http://ninedof.files.wordpress.com/2013/09/shot3.png)Mostly similar to the Photo Viewfinder, but lacking the timer UI, as it is rendered pretty much moot by definition, as the video captured can be of any length.</p>
<p style="text-align:left;">The new enhanced adapting watch app:</p>
<p style="text-align:left;">![](http://ninedof.files.wordpress.com/2013/09/wtp-watchapp.jpg)Excuse the state of my screen protector! So far it's done its duty perfectly. I haven't found any function to assign the UP and DOWN buttons on the Pebble Action Bar so far, so if you can think of one, let me know!</p>
<p style="text-align:left;">Notes on Android </p>
<p style="text-align:left;">First, the process for capturing video on Android is very different from photo capture. There are two methods I can think of for capturing photos/videos on Android:</p>

<ol>
	- Start an Intent to launch the device's built-in Camera app, which then waits for the user to press the capture button and then go back, which hands the resulting image data back to the previous Activity. Useless for this purpose, since once the Intent is launched, the Watch Trigger app and hence Pebble cannot control the built-in Camera app, which leaves us with the alternative;
	- Re-implement the Camera app as a custom Activity to enable access to all stages of preview, capture, write and gallery scan. This involves creating a new SurfaceView subclass that opens the Camera and displays the preview images. Once the basic layout is complete, and the Camera.Parameters API probed to expose the requires settings to the user, this isn't too much work.
</ol>
<div>The problems start to appear if you want to do approach #2 above with video capture. Whereas the Camera API has the takePicture() method, which calls the supplied callbacks to get and save the image data to internal storage, the capturing of video data requires continuous storage functionality, which is managed with the MediaRecorder class.</div>
<div></div>
<div></div>
<div>On paper ( [in the API documentation](http://developer.android.com/guide/topics/media/camera.html)), the video capture process is [simple enough](http://developer.android.com/guide/topics/media/camera.html#capture-video), if you tread with caution. Even following this admittedly precision orientated procedure, I spent at least two days wrestling with 'setParameters failed' and 'start failed -19' errors. One thing I like about the Java language is with a suitable debugger the stack trace is nearly always informative enough to show you exactly what failed and why. But these errors were near meaningless, and according to sites such as Stack Overflow, could occur due to a wide variety of reasons.</div>
<div></div>
<div></div>
<div>Eventually I managed to get video capture to work after making assumptions about camera hardware, encoder options and file formats, which when considering to release to a device-fragmented ecosystem such as Android, is scary enough. A few more days work enabled me to eliminate most of these assumptions which should provide the best compatibility. In case you were led here by struggles re-creating the Camera app for video recording, here is my code which works (at least for a CM10.1 Galaxy S, stock HTC One, stock 2.3.3 Galaxy Ace and stock Galaxy Y (I still pity Galaxy Y users):</div>
<div></div>
[code language="java"]
	/**
	 * THANK YOU: http://stackoverflow.com/a/17397920
	 * @return true if successful
	 */
	private boolean prepareMediaRecorder() {
		try {
			//Create
			mRecorder = new MediaRecorder();

			//Select camera
			mRecorder.setCamera(camera);
			if(Globals.DEBUG_MODE)
				Log.d(TAG, &quot;Camera instance is: &quot; + camera.toString());

			//Setup audio/video sources
			mRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
			mRecorder.setVideoSource(MediaRecorder.VideoSource.CAMERA);

			//Set quality
			CamcorderProfile profile = CamcorderProfile.get(0, CamcorderProfile.QUALITY_HIGH);
			mRecorder.setProfile(profile);

			//Get next name
			nextName = getTimeStampName() + &quot;.mp4&quot;;

			//Output file
			if(Globals.DEBUG_MODE)
				Log.d(TAG, &quot;Opening media file...&quot;);
			File dir = new File (prefPath + &quot;/&quot;);
			dir.mkdirs();
			currentFile = new File(dir, nextName);

			if(Globals.DEBUG_MODE)
				Log.d(TAG, &quot;Media file is: &quot; + currentFile.getAbsolutePath().toString());
			mRecorder.setOutputFile(currentFile.getAbsolutePath().toString());

			//Setup Surface
			mRecorder.setPreviewDisplay(sHolder.getSurface());

			//Prepare
			if(Globals.DEBUG_MODE)
				Log.d(TAG, &quot;Preparing MediaRecorder...&quot;);
			mRecorder.prepare();

			//Finally
			if(Globals.DEBUG_MODE)
				Log.d(TAG, &quot;MediaRecorder preparations complete!&quot;);
			Globals.addToDebugLog(TAG, &quot;MediaRecorder preparations complete!&quot;);
			return true;
		} catch (Exception e) {
			Log.e(TAG, &quot;Error preparing MediaRecorder: &quot; + e.getLocalizedMessage());
			Globals.addToDebugLog(TAG, &quot;Error preparing MediaRecorder: &quot; + e.getLocalizedMessage());
			e.printStackTrace();
			releaseMediaRecorder();
			return false;
		}
	}

	private void releaseMediaRecorder() {
		mRecorder.reset();
		mRecorder.release();
		mRecorder = null;

		if(Globals.DEBUG_MODE)
			Log.d(TAG, &quot;MediaRecorder released successfully.&quot;);
		Globals.addToDebugLog(TAG, &quot;MediaRecorder released successfully&quot;);
	}

[/code]

## If you are working in this area of Android app development heed my warning and ALWAYS USE TRY/CATCH TO RELEASE THE CAMERA LOCK AND MEDIARECORDER LOCK IF ANY CODE SEGMENT INVOLVING THEM FAILS! Failure to do this means if your app FCs or ANRs and you have to kill it, you will be unable to access the Camera in ANY app until you restart your device!

Finally in this section, notes on supporting Android 2.3.3 Gingerbread and upwards. In Android 3.0 Honeycomb and upwards, there are a lot of nice features and conveniences I originally took for granted when building this app. Examples include:


	- The ActionBar API
	- The newer Media Scanner API functions
	- Some methods involved with the Camera API


After a few requests and accepting that I should support all the devices that Pebble do themselves, I worked to include those older devices into the Watch Trigger fold. In doing so, I had to write replacement imitation ActionBar layout items and buttons to provide the closest possible similarity between device versions. Originally I had great difficulties with implementing media scanning (to add the captures media files to the system Gallery so they can be viewed immediately) on Gingerbread, but no problems with Honeycomb upwards. I got round this like so:

[code language="java"]
	//Check Android version
	public static boolean isHoneycombPlus() {
		return android.os.Build.VERSION.SDK_INT &gt;= android.os.Build.VERSION_CODES.HONEYCOMB;
	}

.............................................................

	if(Globals.isHoneycombPlus()) {
		MediaScannerConnection.scanFile(getContext(), paths, mimes, new MediaScannerConnection.OnScanCompletedListener() {

			@Override
			public void onScanCompleted(String path, Uri uri) {
				if(Globals.DEBUG_MODE)
					Log.d(TAG, &quot;Finished scanning &quot; + path + &quot; to gallery&quot;);
				Globals.addToDebugLog(TAG, &quot;Finished scanning video into Gallery&quot;);
				VideoViewfinder.overlayNotify(&quot;Media scan complete.&quot;);

				//Finally
				readyToCapture = true;
			}

		});
	} else {
		//Media scan intent?
		Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
		intent.setData(Uri.fromFile(currentFile));
		getContext().sendBroadcast(intent);

		VideoViewfinder.overlayNotify(&quot;Media scan requested.&quot;);

		//Finally
		readyToCapture = true;
	}

[/code]

Thus, in many other places including the one shown above, the app takes a different path depending on the device platform version.

So, that's the big upgrade! All that's left now is to provide a link to get your teeth into taking loony videos of yourself. [Hopefully nothing like this](http://www.youtube.com/watch?v=4beRDIteCTM).
<p style="text-align:left;">Download</p>
![](https://developer.android.com/images/brand/en_generic_rgb_wo_60.png)
