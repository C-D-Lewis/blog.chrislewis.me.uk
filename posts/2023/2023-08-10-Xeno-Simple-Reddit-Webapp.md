Xeno: Simple Reddit Webapp
2023-08-10 20:27
TypeScript
---

It's been several weeks since the changes to Reddit's API that forced several
top third party apps to shut down, and while I miss my app of choice (RIF!) it
did present an opportunity to take my typical home-grown approach for a solution
and create my own simplified version. My favourite thing about RIF was the
minimal stripped down interfact that escewed complex design for functionality -
lists are simple, pages are focussed on content, and comments are easily read
and collapsed to get the most out of the conversation.

So, what is the new free rate limit? Oh, that much? I'm sure we can work with
that...

## Getting Started

This part took the longest. I knew I wanted to take the chance to give
[fabricate.js](https://github.com/c-d-lewis/fabricate.js) another run around,
and probably in its most complex application yet. And, as a result I did end
up adding a few minor features and fixing some previously undiscovered bugs.
The end result is fast and snappy, so I'd call it a success once again for
Fabricate!

First, data must be read from the Reddit API. While the
[documentation](https://www.reddit.com/dev/api/) is detailed but not very
easy to get started with and in a few places contradictory, I eventually
suceeded in getting post data. You need to get an access token, and then use it
in subsequent API requests.

This took me a good while to get working, so hopefully the example below can
help others...

```js
/**
 * Fetch a user-less access token.
 *
 * @param {string} clientId - Saved client ID.
 * @param {string} clientSecret - Saved client secret.
 * @returns {Promise<string>} The access token.
 */
const fetchAppToken = async (clientId: string, clientSecret: string) => {
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (res.status >= 400) throw new Error(
    `fetchAppToken failed: ${res.status} ${(await res.text()).slice(0, 256)}`
  );

  const json = await res.json();
  // console.log(json);
  return json.access_token;
};
```

Oh, did I not mention? The application is built (and a lot easier to refactor
and improve) with TypeScript and Fabricate.js' new TypeScript type definitions,
which made creating components and applying styles and event handlers a breeze.

The core structure of the webapp is based on three pages - <code>ListPage</code>
for a list of posts, <code>PostPage</code> for a detailed view of a post and
comments, and <code>SettingsPage</code> for entry of the user's credentials.
Until credentials are entered, nothing else can be done.

## Walkthrough

Once entered and tested, the user is shown the list page on the default
subreddit '/r/all'.

![](assets/media/2023/08/gallerypost.png)

Cats are cuter than the chaos of the front page though, so you are getting that.

From here the user can scroll through posts, clicking each for a detailed view
and a view of the comments. This is a collapsible tree of comments that tries
to emulate the minimalist and functional style of RIF.

![](assets/media/2023/08/comments.png)

Pressing the back button in the top left, the user goes back to the list page.
In its place is the drawer toggle button, revealing a list of subreddits the
user has saved for convenience, as well as two quick toggles - display mode and
sort (hot, new, top) modes.

![](assets/media/2023/08/drawer.png)


After a second reload, posts that were created since the last app load are
shown with an orange flash at the top, and subreddits saved that have new posts
are shown in the drawer with a 'new' badge icon.

![](assets/media/2023/08/listpage.png)

## Conclusion

While it took a few weeks, this one was quite fun to put together; putting
fabricate.js to the test again, fixing bugs and missing types, getting
TypeScript playing nicely with eslint, etc. 

And the goal has been realised - I've been using the webapp exclusively to use
Reddit (mostly lurking anyway) for a couple of weeks, and it completely meets
my needs. As usual, the best part is that if there is something I don't like
or I have new ideas nothing stops me from implementing them.

The code is all
[available on GitHub](https://github.com/C-D-Lewis/xeno), so check it out if you
want to give it a try - the instructions are quite simple!
