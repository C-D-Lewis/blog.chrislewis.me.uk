New Pebble Watchapp: BBC News Headlines
2014-05-29 22:35:06
Integration,Pebble,Releases
---

<strong>Updates:
15/07/14 - Added option to change story detail view font size.

31/5/14 - The news category and number of items is now exposed as a configuration page

18/06/14 - v1.2.0 streams stories instead of pre-loading them for extra speed. Configuration page now shows version numbers and update news.

Most of my Pebble apps so far have either been watchfaces or control watchapps - those that control a camera (<a title="Watch Trigger on Google Play" href="https://play.google.com/store/apps/details?id=com.wordpress.ninedof.watchtrigger">Watch Trigger</a>), SMS sending (<a title="Wristponder on Google Play" href="https://play.google.com/store/apps/details?id=com.wordpress.ninedof.wristponder">Wristponder</a>) or radios (<a title="Data Toggle on Google Play" href="https://play.google.com/store/apps/details?id=com.wordpress.ninedof.datatoggle">Data Toggle</a>). Another (and some would say the primary use of a Pebble smartwatch) is to be a data display device, rather than data input. With this in mind I decided to make a watchapp that I would myself use on a daily basis that involved data fetching and formatting for display. News is the obvious application that came to me, so after studying the BBC's public news RSS feeds I came up with this:

![](/assets/import/media/2014/05/bbc-news.png)When the user opens the watchapp, PebbleKit JS fetches the latest data from the <a title="RSS feed" href="http://feeds.bbci.co.uk/news/rss.xml">RSS feed</a> and creates 15 Story objects that contain the headline and the short description of the news story. These are streamed (using ACK callbacks for maximum speed) to the watch and displayed in a <code>MenuLayer</code> to the user. When the user clicks SELECT on a news item, the full summary is shown. The splash screen also uses my <a title="ProgressBarLayer repo" href="https://github.com/C-D-Lewis/pebble-progressbar-layer">recently developed</a> <code>ProgressBarLayer</code> object to show download progress.

Using the configuration skill recently gained from finally experimenting it is possible (and I'd like to do it) to use the configuration process to allow the user to choose their news category (such as Science and Technology or Sport), but for now the main headlines seem enough.

You can get this app from the <a title="Appstore link" href="https://apps.getpebble.com/applications/5387b383f60819963900000e">Pebble Appstore</a>. Enjoy!

&nbsp;
