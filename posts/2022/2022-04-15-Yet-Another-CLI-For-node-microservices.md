Yet Another CLI: for node-microservices
2022-04-15 16:02
Raspberry Pi,JavaScript
---

I like CLIs - at this point there's no getting away from it. There's something
quite satisfying about knowing you saved a bit of time and confusion by using
a specialised tool for common and precise interactions with services and APIs.
<code>git</code>, <code>npm</code>, <code>aws-cli</code>, and all the usual bash
tools are all great examples.

When you know what you're doing, you can be fast and productive, and when you
don't yet, the CLI can provide hints, help, and structure to help guide you
to what you want to be doing.

To date, I've worked on a few:

- [evrythng-cli](https://github.com/c-d-lewis/evrythng-cli) (my fork) for the EVRYTHNG API.

- [todo-cli](https://github.com/c-d-lewis/todo-cli) for in-terminal todo list items (read more [here](https://blog.chrislewis.me.uk/?post=2021-12-20-Reminders-As-You-Code-With-todo-cli))

- parl: an unfinished but still interesting pluggable CLI that uses configuration to allow it to be outfit for virtually any REST-style API with resources and parameters (I may yet one day complete it)

## Helping light the way

As an example of why CLIs can be more helpful, here's an example request to
the EVRYTHNG API to read a product by ID, with its <code>scopes</code> visible:

```shell
curl -X GET https://api.evrythng.io/v2/products/Utqn3nTHsRfCwtarDSkf9nRe?withScopes=true \
  -H Authorization:$OPERATOR_API_KEY
```

There's a lot to remember when making this request:

- The correct HTTP method for the operation.

- The API domain and route to use.

- The query parameter names and value format (could require encoding).

- Any required headers, such as <code>Authorization</code> or <code>Content-Type</code>.

- Making sure the required API key is present and correct.

With <code>POST</code> or <code>PUT</code> the problem gets more complicated
with the addition of request body format, syntax, etc.

<code>evrythng-cli</code> helps make it easier to make this request by
simplifying the syntax. Because it's domain-specific, it can also invisibly
handle payload formatting, required headers, and even remember one or more API
keys and insert them as needed.

Assuming I didn't know how to accomplish the above request, I can use the
successive help texts to find my way, first just by running <code>evrythng</code>:

![](assets/media/2022/04/nms-cli-evrythng.png)

So, I run <code>evrythng products</code>, and the CLI tells me all the
available operations, and the syntax of each one:

![](assets/media/2022/04/nms-cli-products.png)

I know I want to read a single product by ID, so this is my choice:

```text
evrythng products|pr $id read|r
```

I can see also that there is a short version available for a power user:

```text
evrythng pr $id r
```

Lastly, I know that I need to add a modifying parameter, and can use the help
text to discover how to also get the <code>scopes</code> in the response:

![](assets/media/2022/04/nms-cli-switches.png)

And so I arrive at my fully formed request:

```shell
evrythng products Utqn3nTHsRfCwtarDSkf9nRe read --with-scopes
```

```json
{
  "id": "Utqn3nTHsRfCwtarDSkf9nRe",
  "createdAt": 1607113258640,
  "updatedAt": 1607113258640,
  "properties": {},
  "fn": "Test product",
  "name": "Test product",
  "tags": ["test"]
}
```

And from there, I could delete the product, or copy and update the data to easily
update it:

```shell
evrythng pr Utqn3nTHsRfCwtarDSkf9nRe u '{"tags":["test", "blog-featured"]}'
```

## nms-cli

So, the reason for all the above explanation is to demonstrate the value in the
newest part of the ongoing
[node-microservices](https://github.com/c-d-lewis/node-microservices) project -
<code>nms-cli</code>. With the growth of the individual apps available (now
totalling 9!) and the requirements to launch, stop, interact, and test them it
seems an appropriate time to make the same savings in time and required
knowledge (because even I can forget how to use a new feature implemented less
than three months prior, it seems!) by creating a specialist CLI tool to help.

![](assets/media/2022/04/nms-cli.png)

Evidently the charm of hand-crafting <code>curl</code> requests each time I
wanted to interact with these apps, or even to quickly start and stop them, has
worn off. So, a quick rundown of features (I'll let the CLI do the talking!).

Start, stop, and list running apps:

```text
$ nms apps
Available operations for 'apps':
  nms apps $appName start
  nms apps $appName stop
  nms apps list
  nms apps stop-all
```

Set and get app data in <code>attic</code>:

```text
$ nms attic
Available operations for 'attic':
  nms attic set $app $key $value
  nms attic get $app $key
```

Send a conduit packet to any app:

```text
$ nms conduit
Available operations for 'conduit':
  nms conduit send $to $topic $message
```

List, create, and delete user tokens:

```text
$ nms guestlist
Available operations for 'guestlist':
  nms guestlist list
  nms guestlist create $name $apps $topics $adminPassword
  nms guestlist delete $name $adminPassword
```

Show all devices/instances registered to the fleet (useful for discoverability):

```text
$ nms fleet
Available operations for 'fleet':
  nms fleet $host list
```

Change the mode and color of any attached Mote RGB lighting setups:

```text
$ nms visuals
Available operations for 'visuals':
  nms visuals off
  nms visuals demo
  nms visuals spotify
  nms visuals setAll $r $g $b
  nms visuals fadeAll $r $g $b
```

## Conclusion

All of the above commands will save me time when developing/using/debugging the
apps, and represents just the beginning as more will be saved in the future, I
am sure.

As is the nature of the CLI itself, it is specialist in nature, but now I will
not have to do the following to start and interact with an app:

```shell
# What's running?
curl localhost:5959/apps

# Oh, conduit's running but not attic
cd apps/attic && npm start &

# Ah, it crashed, how to I stop it?
ps -e | grep node

# Get lucky with the process ID
sudo kill 8374

npm start &

# Check the saved Spotify token
curl -X POST localhost:5959/conduit \
  -H Content-Type:application/json \
  -d {
    "to": "attic",
    "topic": "get",
    "message": {
      "app": "visuals",
      "key": "spotify_access_token"
    }
  }

# Stop all apps (and possibly crash VS Code and remote containers too)
sudo killall node
```

Instead, use the CLI:

```shell
# Check what's running
nms apps list

# Forgot to start attic
nms apps attic start

# Check the saved Spotify token
nms attic get visuals spotify_access_token

# Stop all apps
nms apps stop-all
```

Lovely. And reduces the risk that an anticipated evening after work spent adding
a new feature won't be instead replaced with frustrated revision and debugging
of what should be the easy to obtain working state.

If you're interested (and got this far!) you can see the current state of the
whole project [here](https://github.com/c-d-lewis/node-microservices), including
a handy ecosystem diagram.
