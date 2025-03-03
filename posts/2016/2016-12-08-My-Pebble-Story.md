My Pebble Story
2016-12-08 22:29:48
Pebble
---

This post was originally going to be a lot gloomier, but the <a href="https://www.kickstarter.com/projects/597507018/pebble-2-time-2-and-core-an-entirely-new-3g-ultra/posts/1752929">official announcement</a> yesterday (after a few days of utter FUD) has proven that the worst-case scenario has not come to be, and there's reason to be optimistic about Pebble's future.

So what better time to summarise my part of the Pebble story?

## The Beginning

I backed the original Pebble in the <a href="https://www.kickstarter.com/projects/597507018/pebble-e-paper-watch-for-iphone-and-android/description">first Kickstarter campaign</a>, after a few weeks on the fence I was finally convinced by the promise of an open SDK. I'd had a bit of experience with C as part of my degree course, and played with Java in the second year (including prodding the Android SDK to see if I could make it do anything interesting). Why not try and make my watch do some cool things?

After the now legendary delays, I finally got my watch. It had screen tearing from the moment I turned it on, but I found that by pressing a certain part of the case I could get it to behave (Pebble replaced it within two weeks, so props to them for that). The original 1.x SDK was a bit harder to grasp than the one we have now, but even so, I eventually got my first app working:

![](/assets/import/media/2016/12/img_20130420_121302.jpg)

What a moment! I could put any message I wanted on my wrist! Over the next couple of weeks I worked on a couple of watchfaces, most notable of which was Split Horizon. Back then we had MyPebbleFaces in place of an official app store, which involved the community uploading the build PBW files and then users downloading them and installing via the Android/iOS apps, which were also quite primitive at the time. Also due to the lack of app configuration, watchfaces were released in multiple listings, so Split Horizon has a Seconds Edition (animation every 15 seconds), Minutes Edition, and Plain Edition.

Once SDK 1.12 was released (two-way communication, woo!) I was able to use the first version of PebbleKit Android to do interesting things with Android APIs. The first outcome of this was Watch Trigger, the first app that allowed you to capture a photo remotely using your Pebble as the remote. This was since superseded by better efforts (PebbleCam, etc), but it was a big thing for me at the time to have this futuristic capability. I would then go on to a paid app experiment by offering a video capture upgrade (Watch Trigger +) for £0.99, and the main lesson learned was that 95% of my users loved free stuff! Here's the second iteration (the first was just the logo!):

![](/assets/import/media/2016/12/img_20130902_160916.jpg)

Hot on the heels of this was my exploration of other Android APIs. At the time, I had an Android phone (Galaxy S) that would suck power if it was connected to the wrong network. To solve this problem, I created Data Toggle to allow me to turn off WiFi when I went outside, and switch over to 3G. This would later become Dashboard as we now it today.

![](/assets/import/media/2014/03/photo1.jpg)
...became...
![](/assets/import/media/2016/12/img_20140907_124913.jpg)

At the same time I also begun work on Wristponder to allow initiating and replying to SMS messages (before it was integrated into the firmware!):

![](/assets/import/media/2016/12/img_20140228_171926.jpg)

## The SDK Tutorials

It was that summer I started working on my <a href="https://ninedof.wordpress.com/pebble-sdk-tutorial/">SDK tutorials</a>. Little did I know that these pieces (drafted on a notepad in Tuscany, and originally quite popular with other community members, being the only real tutorials at the time) would <strong>literally change my life</strong>.

Not shown in the image below is the pad I was writing feverishly my ideas for structured learning content that would guide through the exciting Pebble SDK opportunities:

![](/assets/import/media/2016/12/img_20130704_184311.jpg)

When SDK 2.0 came out (along with PebbleKit JS, localStorage, and a better C style API) I wrote another whole multi part series out of the same motivation as the 1.x tutorial - <strong>now that I'd learned how to make this revolutionary device do my bidding, I wanted to help everyone else do the same to theirs</strong>. I still maintain that the ability to make Pebble fit into your own lifestyle (down to news stories, train delay alerts, even scheduling when your phone switches to Silent for the night) was it's most potent feature. Especially the potential of being paired with the whole Android platform, which I hope Dashboard and the Dash API demonstrate as well as I was able.

## Getting Hired

After I was almost done with the SDK 2.0 tutorials, I was contacted out of the blue on Twitter by Pebble's lead Developer Evangelist - Thomas Sarlandie:

![](/assets/import/media/2016/12/thomas.png)

Originally the deal was to write some tutorials for Pebble's Developer Blog, but that quickly turned into a full job offer. I was torn - I was in my last year of University with no job lined up, but I'd never lived out of the country before. It was such a huge opportunity I had no idea what to do. My mind was made up when one of my best uni friends said "You know your friends who are off doing amazing things travelling the world? This is your opportunity to do that too. Take it!".

So I did.

After a few months of sorting visas, I arrived in Palo Alto and was greeted into the arranged shared accommodation by Joseph Kristoffer. The effect was incredible. I'd practically run myself into the ground finishing my fourth year of university - physically and emotionally. Being on the other side of the world in sunny California surrounded by people who <em>wanted</em> me there so badly was very good for me. A chance to start again, make new friends, and new first impressions.

The welcome was extremely friendly wherever you looked at Pebble, everyone wanted to know who I was and how I'd come to be in the office. I was quickly given a Macbook (which I had very little idea of how to use) and tasked with managing the original drab docs for the colourful Pebble Developer site design you see now:

![](/assets/import/media/2016/12/devgpcom.png)

After a few weeks, and a very quick crash course in git, we did it, and shipped the new site. It was bright and colourful and full of opportunity for new content. We had a company retreat and the famous 2014 Developer Retreat (<a href="https://www.youtube.com/watch?v=Xpuop931GuM">with ROBOTS!!1</a>). I got to go to Maker Faire, see the East Coast and New York on my way to YHack in Connecticut. I was having the time of my life, and knew how lucky I was at every turn.

## Pebble Time

But there was little time to rest. After SDK 2.5 and the Compass API, the company threw itself into the Pebble Time project, which gradually sifted out from the Design team to the whole company. It would be more powerful, with a <em>colour screen</em>, a <em>web API</em>, and a <em>microphone</em>! I think the excitement started to climb when the film crew came in to film the second Kickstarter video, which if you look really carefully, you can see me in:

![](/assets/import/media/2016/12/ks2.png)

We launched the campaign, and there was much celebration with every million the campaign earned. It was a sign of how passionate everybody was, and how badly they wanted to make this awesome new kind of Pebble a reality, if only for at least themselves. Many of the engineers worked long hours and weekends, and famously took no voluntary holidays, their passion was that great. The same engineers who managed to fit firmware 3.x into the original hardware with <strong>mere bytes to spare</strong>. After the manufacturing started, we got some samples in the office and tried building some colour apps. I say 'tried', because the SDK was on the bleeding edge of what firmware functionality was built each and every day. Each new API brought more possibilities, such as the block game demo, and an early version of Isotime:

![](/assets/import/media/2016/12/img_20150226_160104.jpg)

Finally, the backers started receiving watches, and the developer community responded admirably. Every day someone would be going round showing off the latest cool colour app they'd found on the app store, and I worked in my spare time to update all my apps and watchfaces to use the new colour functionality. After this we finished working on timeline, culminating in a 4AM final merge of a monstrous documentation Pull Request.

## Product Owner

Sometime while writing the Smartstrap guides and the Design guides I began planning my own work and execution, with input from the rest of the team. This was completely new to me, but with a few well-maintained Google Sheets, project after project came together without issue. It was good to be more at the helm of the documentation, and being able to help all developers with useful guides, tutorials, and example apps. I also loved (and still do love!) chatting with the more active developer community members in the then Slack chat (now on <a href="https://discordapp.com/invite/aRUAYFN">Discord</a>) and giving one on one feedback and help as much as I could.

It was during this time that we had the 2015 Developer Retreat in San Francisco, and I did fresh re-writes of the Big Four (Dashboard, News Headlines, Wristponder, and Beam Up) to make them more modular and maintainable. I'm glad I did now! I can can dive in, change some things, and only have to look at small parts of the app at any one time. I took great pleasure in perfecting my modular pattern and module interfaces, such as data_get_news_story(), or splash_window_reload_data(), allowing easy exchange of data and actions from anywhere in an app. I guess that was the result of getting better with each app I made, which is a natural part of software development, apparently.

## Moving Up

Right as the office moved from Palo Alto to Redwood City (and myself getting my first apartment in RWC), we were already two months into a complete re-write of the Guides section. Reducing 78 guides crammed into ageing categories in inconsistent styles into about 60 new ones, written from the ground up show how to do everything in the same manner, from button input, to JS/Android/iOS communication (including images!), to bespoke frame-buffer drawing. I did such a thorough job that even now I frequently find myself using the snippets from those new guides in my own apps. MenuLayer? Sure, chuck that snippet in. No problem!

This last huge project was completely planned and executed by me, and I consider my last great gift to the community in an official capacity. I'm very proud of it, I won't lie! Here's where the magic happened, until the end:

![](/assets/import/media/2016/12/img_20160127_170000.jpg)

## Moving On

In March, <a href="http://arstechnica.com/gadgets/2016/03/pebble-to-lay-off-25-percent-of-workforce/">Pebble made 25% (about 40 people) redundant</a>, but it was made very clear it was <strong>not from a lack of good work</strong>. At the time it felt like a cost-saving measure, and now we can look back with full clarity. Since my visa was tied to my job, I had to leave the country, my apartment, my bills/utilities, furniture rental, etc, as soon as possible. I had the option of trying to transfer my visa by getting another job in the Valley, but I was quite put out by the shock of it all, so just decided to pack it all in and come home. I also had to say rushed goodbyes to about 100 people I'd come to know over the last two years. Hardest of all was the Developer Relations team, who I'd shared many adventures, days out, travel trips, etc. with. It was very hard to do, but had to be done.

I came back to the UK with everything I could fit into two airport style cases, and it was all I wanted - except my beloved walnut bass guitar, which was two inches too large (and would have cost half its value to transport properly), so I left it behind.

![](/assets/import/media/2016/12/img_20160120_011241.jpg)

After Easter (which I'd spookily already booked flights and leave for), I went back to the US for a gallop around Yosemite with my Dad. We'd planned it in November 2015, planning to use my apartment to lessen the cost, but decided to go for it anyway, and boy, was it worth it!

![](/assets/import/media/2016/12/img_20160606_102910.jpg)

Coming back from this trip I had no idea what I was going to do with my Pebble development. I'd sunk so much time, and accrued too many thousands of users to stop completely. But my sudden ejection back to the UK left me without any energy to do anything. Days blurred into weeks. Eventually I got it together and started looking for jobs. After about 12 attempts, I found an extremely warm and welcome home at EVRYTHNG. I can say with confidence that I wouldn't have this job if it weren't for Thomas taking a chance on hiring me for Pebble and giving me the credential on my CV!  I also created the <a href="https://ninedof.wordpress.com/2016/07/20/dash-api-for-easy-pebble-and-android-integration/">Dash API</a> to let C app developers use Android APIs, which was an interesting extension to the ecosystem.

## Keeping My Hand In

I decided to maintain my apps, and only do improvements if I got the burst of energy and inspiration required to crack the dusty covers off monsters like Dashboard or News Headlines and gently coerce the insides into accepting new features. I reconnected with the developer community in my original role as a third party developer, but with some insight into how Pebble worked. But I still didn't see the recent acquisition coming. With so many days of just rumours to go off, the community admirably began simultaneously panicking and trying to preserve everything it could in case the servers and SDK ecosystem vanished overnight. Happily, <a href="https://developer.pebble.com/blog/2016/12/06/developer-community-update/">it did not</a>, but we don't know how long it will last.

## The Future

We're at a cross roads. It's time for developers to keep the flame alive, as I know they can and want to do. I foresee a time when the servers are gone (no app login, timeline, lockers, dictation, etc), but we can still keep going with side-loaded apps (remember MyPebbleFaces? Ahead of its time, perhaps) until the watches die!

And that's what I intend to do. I'll still maintain my apps (since the most popular ones I happen to use myself every day) as long as it is possible to do so with the SDK ecosystem. I used to have an Android app to distribute my Pebble app/face's PBW files, but it was a nightmare to keep in sync with the app store. Now the latter may one day disappear (or it may not!), I will dust it off and use it to preserve my offerings for all who are interested.

In addition to this maintenance, I will also be completing my open-source collection - including the Big Four! Well, Beam Up is already open source, so that leaves <strong>Dashboard</strong>, <strong>News Headlines</strong>, and <strong>Wristponder</strong>. Understand that this <strong>isn't</strong> because I'm abandoning them - this recent shift has put emphasis on the community carrying the torch, and this is the best way to keep contributing to the whole and helping others learn how things are done. And maybe now it'll force me to clean the code up! So look out for those in the next few weeks, when I get round to them in my free time. And I'll save time by not needing to upgrade them to Emery's display... bitter sweet.

For now, you can see all my open source apps <strong><a href="http://github.com/C-D-Lewis">on my GitHub account</a></strong>.

## Thanks

I hope it's passively become clear in reading this piece how much of a personal impact Pebble has had on my life. The experience of living and working in Palo Alto patched me up after my gruelling final year of uni. I got to see and experience things and places I never would have otherwise. I got to meet and make friends with so many Team Pebble members, and so many Pebble Developer community member too, who I very much hope to keep collaborating with into 2017 and hopefully beyond. So many people, places, occasions captured in so many photos -  I would never be able to post them all. But I am lucky to be able to look back fondly on all the good times.

![](/assets/import/media/2016/12/cjw_5824.jpg)

In the words of what I imagine Eric said at the company's inception: "Let's see how far we can take this thing!"

&nbsp;

#PDR15
