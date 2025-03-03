New App: One-Shot Wi-Fi Lock
2013-05-07 16:42:39
Android,Java
---

![](/assets/import/media/2013/05/oswl-icon.png)

So being forgetful sometimes, (not to mention opportunistic when I see one) I have been known to walk away from my laptop without locking it. Not that I have anything to hide, but I do have some frightening stories from a few years ago, when people would come across my session and take the opportunity to be deviant (be it people who might be of the disposition to enjoy a good Facebook hijacking session, or kids back in school who would take the opportunity when I was at the printer to send a few more hundred pages for kicks).

So with that slight character flaw in mind, and the fact I'd recently created an authenticated Android -> PC link capable of executing anything at all, I had an idea for what I've named the One-Shot Wi-Fi Lock app. Put simply, it uses all the classes I've developed over the last couple of projects to connect to my laptop over Wi-Fi, send the CMD lock command, then disconnect and quit the app. My student house Wi-Fi address always appears to be static in the form 192.168.1.XX, so it is hard coded in as a String.

So, if I walk away and forget to lock the session, I can just take out my phone, tap the app icon on my homescreen and after a brief flicker of an Activity, can be sound in the knowledge that the screen is now locked (After seeing the 'Successful!' toast, of course).
