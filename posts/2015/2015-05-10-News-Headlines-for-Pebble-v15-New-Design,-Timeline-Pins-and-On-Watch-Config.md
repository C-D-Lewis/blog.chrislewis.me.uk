News Headlines for Pebble v1.5: New Design, Timeline Pins & On-Watch Config
2015-05-10 22:52:59
JavaScript,Pebble,Releases
---

On <a title="New Pebble Watchapp: BBC News Headlines" href="https://ninedof.wordpress.com/2014/05/29/new-pebble-watchapp-bbc-news-headlines/">May 29th, 2014</a> I released 'BBC News Headlines', an app I had used personally for a while to read BBC News stories on my wrist to keep up on current affairs with minimal effort. With the config page, I added some settings (category selection, font size, etc.) and it worked well.

When I learned about the concept behind the timeline, one of my first thoughts was "I can use this!". I had the idea to add timeline pins to the app, as well as update it for Pebble Time to use colors, pins, as well as a new 'cards' design (as recommended by Pebble's new <a title="D&I Guides" href="https://developer.getpebble.com/guides/design-and-interaction/">Design and Interaction</a> guides, which you should check out!) to replace the unnecessary menu screen. I did this, which <a title="First Pebble Timeline App – BBC News" href="https://ninedof.wordpress.com/2015/04/05/first-pebble-timeline-app-bbc-news/">you can read about</a> when the app was half-way through redesign.

Now the re-design is finished, the timeline integration improved (reduced push interval, custom colors, aggressive de-duplication and status reporting to the watchapp), and config page moved into the app itself, removing a need for an external page entirely. I also added a whole bunch of polish behind the scenes, with persistent storage of the last downloaded news stories, timeout and disconnection handling, adaptive scrolling and subtle animations etc.
![](/assets/import/media/2015/05/1-5-flow.png)
With a new name 'News Headlines', this version is now available as a straight update to 'BBC News Headlines' for existing and new users, and is fully compatible with Aplite (Pebble & Pebble Steel).
As a stretch goal, I have implemented all the necessary code to download the (conveniently sized 144x81) thumbnails for each news story for display in a sort of 'viewer pane' within the app, but discovered too late that neither the HTML5 Canvas object (which could be used to get JPEG pixel data once rendered to the object), or on-board JPEG de-compression is an option, so that feature, while exciting, will have to wait for now.

In the meantime, you <a title="News Headlines on Pebble appstore" href="https://apps.getpebble.com/applications/5387b383f60819963900000e">can find it on the Pebble appstore</a>!
