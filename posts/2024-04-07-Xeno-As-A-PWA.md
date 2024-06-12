Xeno As A PWA
2024-04-07 11:35
JavaScript,TypeScript
---

My lightweight Reddit client [xeno](https://github.com/C-D-Lewis/xeno) has
received some much needed upgrades, and now more closely reselmbles the tidy
bloat-free content-focused 3rd party browsers that used to be available. As
ever, it continues to be my daily driver and help field test the more complex
application of Fabricate.js and driving new features.

## Improved Drawer

The app drawer has been improved - it used to fixed at the top of the page and
rely on the page length to show all the user's subscribed subreddits. Now,
it follows the user as they scroll and doesn't require scroll to top as the list
of subreddit names and colors is itself scrollable.

![](assets/media/2024/04/drawer.png)

## Faster Feed

The feed page takes all the user's subreddits, fetches the top 100 new posts,
and throws them together for relevant content viewing. In the past, it fetched
in groups of ten, which could take a long time if the user has 100+
subscriptions. Since the free rate limit is 600 requests per 10 minutes per
client, I made it fetch them all at once, and it's a lot faster!

## Edit Susbcriptions

The list page for a given subreddit now allows the user to subscribe or
unsubscribe. This is the only non-read-only feature, but it feels appropritate
as an app designed for content consumption that a new discovery can be kept
and not require going to a PC or another client to add it to the subscription
list.

![](assets/media/2024/04/subscribe.png)

## Extra Settings

A new settings item has been added - landing page. You can now choose whether
to show the last viewed subreddit or the feed back each time the app is
loaded. Saves a few repetitive taps for a regular feed user.

![](assets/media/2024/04/settings.png)

The existing components for these settings made this extra trivial and
satisfying - simply add the new state, use it during app load, and a few new
Settings components:

```js
/**
 * LandingPageSetting component.
 *
 * @returns {FabricateComponent} LandingPageSetting comment.
 */
const LandingPageSetting = () => SettingsWrapper({
  title: 'Landing page',
  children: [
    Option({
      label: 'Last subreddit',
      setting: 'landingPage',
      value: '/list',
    }),
    Option({
      label: 'Feed',
      setting: 'landingPage',
      value: '/feed',
    }),
  ],
});
```

```js
/**
 * SettingsCard component.
 *
 * @returns {FabricateComponent} SettingsCard component.
 */
const SettingsCard = () => Card()
  .setStyles({ padding: '8px' })
  .setChildren([
    ViewModeSetting(),
    SortModeSetting(),
    LandingPageSetting(),
  ]);
```

## Install as PWA

Since the web app is designed to be a lightweight alternative to classic 3rd
party Reddit apps that were available in app stores, the last step to making
the transition is to add a
[web manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) that
allows browsers to suggest the user install the app to their homescreen, provide
theme colors and icons, and open with no browser chrome or toolbars at all,
making it feel very much like a native application.

```json
{
  "name": "Xeno",
  "short_name": "Xeno",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#333",
  "description": "A minimal Reddit web client",
  "icons": [
    {
      "src": "assets/icons/app_icon_256.png",
      "sizes": "256x256",
      "type": "image/png"
    }
  ]
}
```

Of course, proper PWAs also maintain local databases of content to be
'offline first' as well as other offline and accessability features. Since each
app load the content is different, that feels a little less important. For now!

![](assets/media/2024/04/install.png)
