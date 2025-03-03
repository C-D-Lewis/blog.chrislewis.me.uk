Music-coloured Backlighting with the Spotify API
2017-09-03 10:59:07
Integration,JavaScript,Raspberry Pi
---

Adding Raspberry Pi based backlighting to my desktop PC with <a href="https://github.com/C-D-Lewis/backlight-server">backlight-server</a>, and moving to a new flat gave me an interesting idea - add an API to the backlight server to set the lights to the dominant colour of whatever album is playing in my Spotify account. How hard could it be?

The first step was to read up on the Spotify API. I quickly found the <a href="https://developer.spotify.com/web-api/get-the-users-currently-playing-track/">'Get the User's Currently Playing Track'</a> API, which fit the bill. Since it deals with user data, I had to authenticate with their <a href="https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow">Authorization Code Flow</a>, which requires multiple steps as well as a static address for a callback containing the authorization code granted to my application. I experimented with giving the Spotify Developer site the IP address of my Server Pi, but that could change, which would mean editing the application listing each time that happened, which was unacceptable for a seamless 'setup and forget' experience I was aiming for.

The solution was to resurrect my DigitalOcean account to host a small Node.js app with a simple task - receive the callback from Spotify with the authorization code with which access and refresh codes would be granted, and fetch and determine the dominant colour of the album art currently playing. This service would in turn be used by backlight-server to light up my living room with the appropriate colour.

This authorization flow took a long time to get right, both from a code perspective (I used the <a href="https://github.com/thelinmichael/spotify-web-api-node">spotify-web-api-node</a> npm package to make things programmatically easier), as well as a behavioural perspective (when should the token be refreshed? How to propagate errors through different services? How can the app know it is authorized at any given time?), but once it worked, it was very cool to see the room change colour as my playlist shuffled by.

I had a half-hearted attempt at figuring out the dominant colour myself using buckets and histograms, but in the end decided to preserve my sanity and use the <a href="https://github.com/akfish/node-vibrant">node-vibrant</a> package instead, which worked like magic!

So this is basically how the whole thing works, and you can see the code for the <a href="https://github.com/C-D-Lewis/spotify-auth">spotify-auth microservice on GitHub</a>. The diagram below may also help explain:

![](/assets/import/media/2017/09/spotify-auth-flow.png)So what next? Well, those smart RGB light bulbs are looking a lot more interesting now...
