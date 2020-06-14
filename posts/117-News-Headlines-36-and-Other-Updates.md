---
index: 117
title: News Headlines 3.6 and Other Updates
postDate: 2016-04-13 12:49:04
original: https://ninedof.wordpress.com/2016/04/13/news-headlines-3-6-and-other-updates/
---

Once again, it's been a while! The last update talked about updating apps for Chalk (Pebble Time Round), and it was around that time that I was aiming for stability on the 'Big Three' apps (namely Dashboard, News Headlines, and Wristponder), as well as a couple of the more popular watchfaces (namely Thin, Beam Up, Isotime, etc), so I could not be doing Pebble development all day and all night.

Happily, I eventually achieved this after a few weekend sessions, and all was good. With some interesting developments in the world of app configuration (see [Clay](https://github.com/pebble/clay)), I added vastly improved color-selection configuration pages to those watchfaces. Color pickers beat manually entering hex strings any day of the week!

Since I'm no longer doing developer documentation/other general advocacy for Pebble (perhaps the massive [Guides rewrite](https://developer.pebble.com/blog/2016/03/09/Dont-Panic-We-Are-Here-To-Guide-You/) was my parting gift?), I have decided to try and pick it up again as a hobby, like I was doing before getting hired. I found it great fun, and very rewarding when I saw people using my apps. In general, they start life as apps I want to use my watch for, then I polish and publish them so other can find them useful.

The trouble I was running into was finding time to meet the maintenance demands of bugs/feedback from users, so now I have more time for that. Indeed, I've picked up a few processes/skills from my time managing my projects at Pebble that should make this process much easier. It is yet to be seen if Sheets is more efficient for a single person than JIRA, but I think I know what the answer is...

![](/assets/media/2016/04/region.png)

Anyway, just now I released version 3.6 of News Headlines. For some time, I've received the question "Can it show news from outside the UK?". Since it started life as 'BBC News', that makes more sense. Yesterday I saw that the BBC has feeds for [multiple regions](http://www.bbc.co.uk/news/10628494), and so a fun exercise in adding a new feature presented itself, with a lot of potential value for users who aren't interested in the [latest scandal at Westminster](http://www.bbc.co.uk/news/uk-politics-35994283).

In adding this new feature, I was reminded how complicated News Headlines is as an app, but it made the end result that much more satisfying. The process went something like this:


	- Add new enumerations for the region values.
	- Add new defaults and internal APIs for passing around the region value.
	- Add new UI items and logic to the Settings Window.
	- Add new keys for AppMessage and Persistent Storage APIs.
	- Add region-passing to the initial sync communication phase.
	- Generalise JS feed download to choose either a selected region, or a 'category' if the region is 'UK'.
	- Ensure all these things played nicely for new users and also upgrading users (the latter where I've been stung far too many times before).
	- And as usual get massively sidetracked with refactoring and code style updates.


So now we have that. Readers around the world can make their headlines-reading experience a tad more localised if they wish. Another request I've been getting recently in general is to accept donations. Historically (excepting the paid version of Watch Trigger) I've not dabbled in donations, but since I'm not paid by Pebble anymore I will use this update to do a little experimentation. It can always be removed if nothing happens. Another experiment is making a /r/pebble subreddit post, so we'll also see how that's received.
