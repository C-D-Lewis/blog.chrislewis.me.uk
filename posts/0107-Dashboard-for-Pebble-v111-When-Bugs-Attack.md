Dashboard for Pebble v1.11: When Bugs Attack
2014-11-09 05:48:43
Android,Pebble,Releases
---

Over the last week, there have been have been four version of Dashboard released (9, 10, 11 and now 12) following the inclusion of the <a href="http://pbldev.io/wakeup">Wakeup API</a>. I used this shiny new firmware feature to let users of Dashboard schedule daily wakeups to issue an on/off command to the Dashboard Android app, at times they would use the toggles anyway.

![](/assets/import/media/2014/11/pebble-screenshot_2014-11-08_21-37-47.png)    ![](/assets/import/media/2014/11/pebble-screenshot_2014-11-08_21-38-04.png)

![](/assets/import/media/2014/11/pebble-screenshot_2014-11-08_21-38-11.png)
<blockquote>A new 'HOLD' icon prompts access to the scheduling feature, including list of existing events and UI to create new ones.</blockquote>
A personal example of this is that every night at about midnight I turn off WiFi on my phone to save power through the night using Tasker. Now, I can remove the Tasker icon from the status bar and use Dashboard to carry out the action instead. Of course, Tasker didn't require me to keep my Bluetooth on overnight, but it's a small price to pay for automated control of Android radios!

When adding such a complex feature (Dashboard itself went from two main code files to eight and ~600 to ~1300 lines of code), bugs will occur. Some will be code-based, such as not handling setting two wakeups for the same time (which the system will not allow) and warning the user, and some are behavioral.

At the moment, the Pebble appstore will not always update the released watchapp when a new version is uploaded. This can make co-ordinating a release with Google Play Store very difficult. Users were prompted to 'update watchapp from Android app'. What I intended was for them to use the 'Install Watchapp' button in the Dashboard Android app to get the bundled compatible version, but in reality they were unloading and reloading the watchapp from the Pebble app locker, which ended up with them still having the old version. And so the loop continued until some concerned users emailed me about it. In all cases I clarified the correct procedure and every case was fixed. So now that process is hopefully a bit more explicit!
