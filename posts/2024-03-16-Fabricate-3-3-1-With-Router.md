Fabricate.js 3.3.1 With Router
2024-03-16 16:23
JavaScript,TypeScript,Releases
---

A new version of [fabricate.js](https://github.com/C-D-Lewis/fabricate.js) is
available - v3.3.1. This one centers around a large new feature - introduction
of a <code>router</code> component. As some of the apps that use fabricate now
require multiple pages, instead of re-inventing the wheel it's a good indicator
that the library itself should support this feature, inspired of course by my
use of other frameworks.

## Router instead of Pages

The <code>router</code> component accepts an object that describes some routes
and the builder functions / components that present those pages. One route is
essential - <code>'/'</code> for an initial page.

```js
const App = () => fabricate.router({
  '/': HomePage,
  '/settings': SettingsPage,
  '/status': StatusPage,
});
```

In [Xeno](https://github.com/c-d-lewis/xeno) for example, this allows a quite
verbose collection of conditional components to be reduced syntactically and
be a lot nicer to work with. Before, it looked like this:

```js
const App = () => fabricate('Column')
  .setChildren([
    AppNavBar(),
    Drawer(),
    fabricate.conditional(
      ({ page }) => page === 'InitPage',
      InitPage,
    ),
    fabricate.conditional(
      ({ page }) => page === 'LoginPage',
      LoginPage,
    ),
    fabricate.conditional(
      ({ page }) => page === 'ListPage',
      ListPage,
    ),
    fabricate.conditional(
      ({ page }) => page === 'FeedPage',
      FeedPage,
    ),
    fabricate.conditional(
      ({ page }) => page === 'PostPage',
      PostPage,
    ),
    fabricate.conditional(
      ({ page }) => page === 'SettingsPage',
      SettingsPage,
    ),
  ]);
```

With the router, this is a lot more succinct, and as a bonus the plumbing of
<code>page</code> can be removed completely from the app:

```js
const App = () => fabricate('Column')
  .setChildren([
    AppNavBar(),
    Drawer(),
    fabricate.router({
      '/': InitPage,
      '/login': LoginPage,
      '/list': ListPage,
      '/feed': FeedPage,
      '/post': PostPage,
      '/settings': SettingsPage,
    }),
  ]);
```

The keen-eyed will notice that the router does not have to be at the top level
of an app - it can be within the heirarchy of another component and present
multiple views alongside other components above. Right now there can be only
one router per app.

## Working with components

Of course, some components need to know which route is currently in effect. For
this, I finally got around to exporting constants for the build-in state keys.

```js
const { StateKeys } = fabricate;

const RouteView = fabricate('Text')
  .onUpdate((el, state) => {
    const route = state[StateKeys.Route];
    el.setText(`Current route is: ${route}`);
  }, [StateKeys.Route]);
```

I might make this nicer to work with in the future, but it fits in line with
the other two cases when components need to know library-wide events, including
<code>fabricate.StateKeys.Init</code> (<code>'fabricate:init'</code>) when the
app is started, and
<code>fabricate.StateKeys.Created</code> (<code>'fabricate:created'</code>) when
a given component has been created and might want to do something straight away.

## Navigating further

To go from one page to another, simply <code>navigate()</code>:

```js
const HomeButton = fabricate('Button', { text: 'Go Home' })
  .onClick(() => fabricate.navigate('/home'));
```

In addition, there are two other new methods for use with the router. First, the
ability to go back one navigation step:

```js
const BackButton = fabricate('Button', { text: 'Go Back' })
  .onClick(() => fabricate.goBack());
```

And the ability to examine the navigation history:

```js
const history = fabricate.getRouteHistory();

const currentRoute = history.slice(-1);
const previousRoute = history.slice(-2);
```

Again, I may make this nicer in the future, but for now the rarity of this
requirement makes it okay for now.

## What's next

As opposed to some like <code>react-router</code>, this doesn't actually update
the URL. I currently have no need for that. When it does, it'll also need to
accomodate a lot more things, like hash, query params, etc. I'll save that
for another day!
