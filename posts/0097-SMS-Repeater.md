SMS Repeater
2014-06-15 00:22:14
Android
---

![](http://ninedof.files.wordpress.com/2014/06/smsrepeater.png)

My mum recently got a new phone, a Moto G, after my recommendation. It's a big step up from Samsung S8000 Jet she had before (one of Samsung's last phones before adopting Android, and which had a beta version of Android 2.1 a.k.a JetDroid installed, <a title="JetDroid Guide" href="http://www.jetdroid.org/forum/viewtopic.php?f=11&t=18">which I had a small hand in</a>).

One of the features she liked most about it was the option to have the SMS tone repeat every minute, which was useful if it went off when she was out of hearing range (this handset was before notification LEDs or smartwatches!). This feature was markedly missing from Android 4.4.2 KitKat which is currently on here phone, so I offered to create an app to emulate this feature, because I could and wanted to see if I could.

After two hours, a brief foray into <code>Timer</code>s, <code>AlarmManager</code>s, <code>AsyncTask</code>s and <code>Handler</code>s, I arrived at a solution that uses a <code>BroadcastReceiver</code> to detect an incoming SMS, start a <code>Service</code> once every 1, 2, 5 or 10 minutes using an <code>AlarmManager Alarm</code> and re-emit the default notification tone. This cycle is broken when the keyguard is removed when the phone is unlocked to answer the SMS. She was very pleased to have the feature back, which makes up for the predictive keyboard I forced on her!

![](http://ninedof.files.wordpress.com/2014/06/repeater-screeny.png?w=545)

If anyone is interested in using this or taking it further (I'm sure there are already many apps like this!), you can <a title="Source Code" href="https://github.com/C-D-Lewis/sms-repeater">find the source code here</a>.
