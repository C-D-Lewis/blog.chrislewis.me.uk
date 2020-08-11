Simpler Inter-service Communication with MBus
2017-12-24 13:33:29
Integration,JavaScript,Raspberry Pi
---

A problem I had found when setting up my Node.js services on a new Raspberry Pi (or resetting one that had gotten into a bad state) was keeping track of the individual port numbers of each one. This might typically look like this:

 • New Headlines Backend - 5000

 • Tube Status Backend - 5050

 • LED Server - 5001

 • Backlight Server - 5005

 • Attic - 5500

 • Spotify Auth - 5009

...and so on. This wasn't only a problem with setup, but also with maintaining all the numerous <code>config.json</code> files for each app that needed to talk to any of the other ones.

So to do something about it, I decided to have a go implementing a central message broker service (nominally called Message Bus, or MBus) from scratch (one of the key features of my hobbyist development, as you tend to learn a lot more this way). This new service had to be generic to allow all kinds of messages to flow between the services that they define themselves. It had to be fault tolerant and so should use JSON Schema to make sure the messages are all of the correct format. And lastly, it shouldn't care what the connection details are for each app at startup.

&nbsp;

## Client Registration and Message Exchange

To solve this last problem, each app uses a common Node.js modules that knows the port of a local instance of MBus and requests a port assignment. MBus responds with a randomly rolled port number from a range (making sure it isn't already allocated to another app), and the client app then creates an Express server that listens on the allocated port. If MBus receives a message with a known client app as the destination, it simply sends it on to that port within the local machine, where the client app will be listening as expected. These two processes are summarised below:

![](/assets/import/media/2017/12/2-client-registration-and-exchange.png)

&nbsp;

## Client Implementation

To implement a new client to talk to MBus, it includes the <code>mbus.js</code> common module, and registers itself at runtime. It also specifies the message schema it will expect from MBus using conventional JSON Schemas:

<!-- language="js" -->
<pre><div class="code-block">
const mbus = require('../node-common').mbus();

const GET_MESSAGE_SCHEMA = {
  type: 'object',
  required: [ 'app', 'key' ],
  properties: {
    app: { type: 'string' },
    key: { type: 'string' }
  }
};

const SET_MESSAGE_SCHEMA = {
  type: 'object',
  required: [ 'app', 'key', 'value' ],
  properties: {
    app: { type: 'string' },
    key: { type: 'string' },
    value: {}
  }
};

async function setup() {
  await mbus.register();

  mbus.addTopic('get', require('../api/get'), GET_MESSAGE_SCHEMA);
  mbus.addTopic('set', require('../api/set'), SET_MESSAGE_SCHEMA);
}
</div></pre>

Once this is done, the <code>config.json</code> is also updated to specify where it can find the central MBus instance and the name it is to be identified as when messages are destined for it:

<!-- language="js" -->
<pre><div class="code-block">
{
  "MBUS": {
    "HOST": "localhost",
    "PORT": 5959,
    "APP": "LedServer"
  }
}
</div></pre>

The <code>mbus.js</code> module also takes care of the message metadata and the server checks the overall packet schema:

<!-- language="js" -->
<pre><div class="code-block">
const MESSAGE_SCHEMA = {
  type: 'object',
  required: [ 'to', 'from', 'topic', 'message' ],
  properties: {
    status: { type: 'integer' },
    error: { type: 'string' },
    to: { type: 'string' },
    from: { type: 'string' },
    topic: { type: 'string' },
    message: { type: 'object' },
    broadcast: { type: 'boolean' }
  }
};
</div></pre>

&nbsp;

## Example Implementations

You can find the code for <a href="https://github.com/C-D-Lewis/mbus">MBus</a> in the GitHub repository, and also check some example clients including <a href="https://github.com/C-D-Lewis/attic">Attic</a>, <a href="https://github.com/C-D-Lewis/led-server">LED Server</a>, and <a href="https://github.com/C-D-Lewis/monitor">Monitor</a>.

Barring a few client app updates (luckily no very serious user-facing apps depend on these services for core functionality right now), all the main services now use MBus to talk to each other. The image below shows these setups for the main machines they are deployed on:

![](/assets/import/media/2017/12/services-1.png)

Finally, over the next few months I'll be updating what clients there are to talk to their remote counterparts in this manner, and also take advantage of the fact it is now each to add and address future services in the same manner without needing to configure ports and addresses for every individual service.
