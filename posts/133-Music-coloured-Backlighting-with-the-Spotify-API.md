---
index: 133
title: Music-coloured Backlighting with the Spotify API
postDate: 2017-09-03 10:59:07
original: https://ninedof.wordpress.com/2017/09/03/music-coloured-backlighting-with-the-spotify-api/
---

Adding Raspberry Pi based backlighting to my desktop PC with [backlight-server](https://github.com/C-D-Lewis/backlight-server), and moving to a new flat gave me an interesting idea - add an API to the backlight server to set the lights to the dominant colour of whatever album is playing in my Spotify account. How hard could it be?

The first step was to read up on the Spotify API. I quickly found the ['Get the User's Currently Playing Track'](https://developer.spotify.com/web-api/get-the-users-currently-playing-track/) API, which fit the bill. Since it deals with user data, I had to authenticate with their [Authorization Code Flow](https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow), which requires multiple steps as well as a static address for a callback containing the authorization code granted to my application. I experimented with giving the Spotify Developer site the IP address of my Server Pi, but that could change, which would mean editing the application listing each time that happened, which was unacceptable for a seamless 'setup and forget' experience I was aiming for.

The solution was to resurrect my DigitalOcean account to host a small Node.js app with a simple task - receive the callback from Spotify with the authorization code with which access and refresh codes would be granted, and fetch and determine the dominant colour of the album art currently playing. This service would in turn be used by backlight-server to light up my living room with the appropriate colour.

This authorization flow took a long time to get right, both from a code perspective (I used the  [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node) npm package to make things programmatically easier), as well as a behavioural perspective (when should the token be refreshed? How to propagate errors through different services? How can the app know it is authorized at any given time?), but once it worked, it was very cool to see the room change colour as my playlist shuffled by.

I had a half-hearted attempt at figuring out the dominant colour myself using buckets and histograms, but in the end decided to preserve my sanity and use the [node-vibrant](https://github.com/akfish/node-vibrant) package instead, which worked like magic!

So this is basically how the whole thing works, and you can see the code for the [spotify-auth microservice on GitHub](https://github.com/C-D-Lewis/spotify-auth). The diagram below may also help explain:

![](/assets/media/2017/09/spotify-auth-flow.png)So what next? Well, those smart RGB light bulbs are looking a lot more interesting now...
