Mimicker - A Simple Twitter Personality
2020-11-09 19:43
Integration,JavaScript,AWS
---

I'm a big fan of novelty Twitter accounts. Accounts like
[@RikerGoogling](https://twitter.com/RikerGoogling),
[@PicardTips](https://twitter.com/PicardTips), and even accounts linked to
some kind of smart device, garden plant monitoring, or based on large data set
statistics all interest me and help break up the extreme swings between
smiling and despairing that is the modern Twitter experience.

![](assets/media/2020/11/rikergoogling.png)

So naturally, unlike my failed attempt to make a Slack bot a few years ago, I
decided I would have a go at creating my own. But I've learned that the key to
successfully completing a side project is to keep it simple. If I want to go on
and make it more complex or add more features, later is the time for that. Also
it means you can put it in front of others sooner.

## Imitating the Imitator

I decided upon a simple use-case inspired by @RikerGoogling (which is
human-created) - a Twitter account posing as a character from a TV show, with a
profile photo, bio, and image to match, and with tweet content derived from a
very long list of quotes fitting the account's character. And it had to be
completely automated so that I could set it up, follow it, and be pleasantly
amused at unpredictable times in the future when scrolling though my feed.

But which character to imitate? I settled on Dennis Reynolds from It's Always
Sunny in Philadelphia.

![](assets/media/2020/11/dennis.jpg)

Why? Well, he's extremely quotable and random outbursts
of delusion and vanity I find very amusing, and can work in pretty much any
context. If you're not acquainted with Dennis,
[here's a fine introduction](https://www.youtube.com/watch?v=hbtg3ZNSzts).

So, of course, the first step was to procure (read: spend a happy hour chuckling
at top ten quote lists, rundowns, gif blogs, and best-of videos) a list of
fitting quotes for my own pet Golden God. But I only selected those that would
suit a Dennis who is permanently enraged at everything he's seeing online, and
in his own life. This list eventually reached around 90 items - not a bad
number.

## Hello, World

The next step was to actually write some code. After creating the fictitious
Twitter account and enrolling in Twitter's developer program (which already had
a category for bot accounts), I found that there were several libraries
available to choose from to make the tweeting process easy to do from Node. In
the end I selected [twitter-lite](https://www.npmjs.com/package/twitter-lite)
for its simple interface and being recently maintained.

```js
// Create the client
const client = new TwitterLite({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

// Send a tweet!
const data = { status: 'I am a Golden God!' };
const res = await client.post('statuses/update', data);
console.log({ res });
```

The result is worth the effort so far!

![](assets/media/2020/11/golden-god.png)

## Like Clockwork

For the platform - AWS Lambda is the obvious choice for a script that does one
thing on a regular basis, and takes very little actual runtime. When combined
with EventBridge, it is trivial to create a trigger for the Lambda function
based on a cron-like schedule, such as every six hours.

![](assets/media/2020/11/lambda-config.png)

The final piece of the puzzle was to include the list of possible quotes for the
bot to use. Originally this was going to be a fixed part of the project
repository, but I decided to make it generic - given any Twitter credentials and
simply a URL where to find the list of quotes and the same code can easily be
re-used for any other popular character, or other instances where regular bits
of random text or data should be inflicted upon the wider world. The natural
choice for this is Amazon S3.

```js
try {
  // Fetch quotes file
  const quotes = await fetch(QUOTES_FILE_URL)
    .then(r => r.text())
    .then(d => d.split('\n'));

  // Choose one at random
  const index = Math.floor(Math.random() * quotes.length);
  const quote = quotes[index].trim();

  // Tweet it
  const res = await client.post('statuses/update', { status: quote });
  console.log({ res });
  return res;
} catch (e) {
  console.log('I am untethered and my rage knows no bounds!');
}
```

And so, we can now observe Dennis' inevitable descent into complete mania at
regular intervals.

![](assets/media/2020/11/golden-feed.png)

Perhaps the reusable nature of the project begs the question as to who should
be portrayed as one of billions of exasperated internet voices next... If you
are inspired -
[check out the complete project here](https://github.com/c-d-lewis/mimicker).
