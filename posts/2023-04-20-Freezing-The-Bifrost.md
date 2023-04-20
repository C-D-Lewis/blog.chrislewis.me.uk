Freezing The Bifrost
2023-04-20 19:23
Integration
---

Time for something a bit different: a project that did not pan out and I
decided to put back on the shelf. Anyone familiar with the sunk cost fallacy
will know that it's hard to stop doing something when you have already invested
a lot of time or money into something, but it may be wisest to actually stop.

It makes sense on the surface - so much is spent, how far can the end really be?

It's something I've been familiar with on more than one occasion and have found
myself on both sides of the fence at different times. In this case, it's a new
app in the <code>node-microservices</code> project aimed to replace the way apps
communicate with each other and apps on remote devices - from HTTP to
WebSockets. The reasons seemed good:

- Real-time communication.

- Knowledge of current connected state.

- Ability to communicate with a device on a home network without needing to know the address or configure firewall rules.

- Upgrading something that's been in place for at least five year, which should be fun.

This almost came true with a new app called <code>bifrost</code>. It fully
achieved all this for local apps, and had a cool bifrost-like randomly generated
graphic whenever it started!

![](assets/media/2023/04/bifrost.png)

So why didn't I finish it?

## Open the Bifrost!

The concept behind <code>bifrost</code> was derived from the addition of an
existing app called <code>clacks</code> which simply allows apps to subscribe
to a global set of topics and be notified. I had a problem with it sort-of
duplicating the role of <code>conduit</code> which is to be the way all apps
communicate.

Using WebSockets worked well instead of sending request to a local instance
of <code>conduit</code> and then forwarding it to another remote instance
(requiring knowledge of the IP address and assuming it is reachable) which made
it an attractive method for all apps to communicate no matter their location.
Currently, all apps on all devices that care about such topics (currently just
actuation of some smart lighting) connect to one central <code>clacks</code>
but what if it could be made to do all app communication?

The major obstacle to achieving this was to ensure it would be very easy to
update apps to use the new communication method. The nice thing about HTTP was
the ability to <code>POST</code> data and <code>await</code> the response data.
But with WebSockets, messages are sent and it's almost impossible to have such a
wait at the language level. To solve this, all messages sent had an
<code>id</code> in addition to the usual <code>to</code>, <code>from</code>,
<code>topic</code> etc. that <code>conduit</code> packets have always had. This
ID is used to register the Promise callback when a response is sent with the
same ID - the callback is called and <code>await</code> can be used.

```js
/**
 * Send a packet to the server for another application.
 * ID is attached to allow awaiting of other app response data, so it can be
 * used in the same way as HTTP.
 */
const send = (data) => {
  if (!connected) throw new Error('bifrost.js: not yet connected');

  // Send this message to the chosen app
  const {
    to, from, topic, message = {}, token = TOKEN, toHostname,
  } = data;
  const id = generateId();
  const packet = {
    // System generated
    id,
    fromHostname: hostname(),

    // User data
    to,
    from,
    topic,
    message,
    token,
    toHostname,
  };
  localHostSocket.send(stringifyPacket('>>', packet));

  // Allow awaiting the response - handled in onSocketMessage
  return new Promise((resolve, reject) => {
    // Reject if no response message arrives soon
    const timeoutHandle = setTimeout(() => {
      delete pending[id];
      reject(new Error('No response'));
    }, SEND_TIMEOUT_MS);

    /**
     * Callback when a message is received with this outgoing ID.
     *
     * @param {object} response - Response data from app who answered.
     */
    pending[id] = (response) => {
      clearTimeout(timeoutHandle);

      if (response.error) {
        delete pending[id];
        reject(new Error(response.error));
        return;
      }

      resolve(response);
    };
  });
};
```

And when a message had the right ID, the Promise callback was called and the
app could just <code>await</code> it:

```js
/**
 * When the localHostSocket receives a message.
 *
 * @param {*} buffer - Data buffer.
 * @returns {Promise<void>}
 */
const onSocketMessage = async (buffer) => {
  const packetStr = buffer.toString();
  const packet = JSON.parse(packetStr);
  const {
    replyId, topic, message = {},
  } = packet;
  log.debug(`bifrost.js << ${formatPacket(packet)}`);

  // Did we request this message response? Resolve the send()!
  // If we were't expecting this reply, ignore
  if (replyId) {
    if (pending[replyId]) {
      pending[replyId](message);
      delete pending[replyId];
    }
    return;
  }

  // Topic does not exist in the app
  const found = topics[topic];
  if (!found) {
    log.error(`bifrost.js: No topic registered for ${topic}`);
    return;
  }

  // Check topic schema
  const { topicSchema, cb } = found;
  if (!schema(message, topicSchema)) {
    log.error(`bifrost.js: Schema failed:\n${JSON.stringify(topicSchema)}\n${JSON.stringify(message)}`);
    return;
  }

  // Pass to the application and allow it to return a response for this ID
  const response = (await cb(packet)) || { ok: true };
  reply(packet, response);
};
```

This made the upgrade for all apps virtually find-and-replaceable and I was
quite pleased with it. But soon the complexities grew...

## Completing the Upgrade

After creating the WebSocket app, updating all other apps and their tests to
use it, I moved onto the two dashboards in the same project - one for smart
lighting control, and another the allowed more complex interrogation and control
of all apps running on all devices in the fleet. This required two things:

- Ability to connect to all devices.

- Ability to send packets to a remote app and device, and receive the response to each.

I thought this would be fairy easy - just do the same as <code>conduit</code>
and configure the app to send packets with a host identifier to that host,
provided it was connected to the instance receiving the initial request.

However, I had made the mistake of writing much of the application with the same
library of functions and functionality in the <code>node-common</code> set of
common modules. I thought this was smart - things like creating packets, sending
them and attaching IDs and registering Promise callbacks, receiving and
validating responses and handing them back to the calling app were all things
the server app needed.

But only once I got all the way to updating the
<code>service-dashboard</code> to try and discover apps running on a remote
device via a local and remote instance of <code>bifrost</code> did I realise
that the process was silently acting as if each server-server connection was
a client app, <i>not</i> another server. I also had a nightmare trying to unpick
the logic deciding if a packet was for the local or another host, and
marshalling all the fields in a packet for this purpose. A packet would be
forwarded to another device's <code>bifrost</code> okay, but the response was
arriving via the library and being treated as a client app packet - no topic
found!

![](assets/media/2023/04/whathaveidone.jpg)

## Putting a Pin In It

After several nights with many terminal windows open I decided I'd had enough
and tried creating a special additional WebSocket connection for all servers
a local <code>bifrost</code> may want to send/receive packets from, but this
required advance knowledge of who they are and what they might send - not ideal
or scalable.

This was the final messy nail in the coffin and I stopped trying to get 5+
processes to work nicely together. Perhaps some TypeScript would have helped
understand the data flow, but when messages dissapear into the ether and never
receive responses, I ran out of energy.

For about two months one of the Raspberry Pis in the rack lay forlorn and bereft
of a purpose - it had been my test ground and taken out of automation. It was
a constant reminder I had either yet to finish the puzzle or to decide to
swallow the sunk time cost and give up. It bothers me when unfinished projects
are just hanging around as yet another unresolved problem in my mind.

## Letting Sunk Cost Sink

About a week ago I made a decision to give in - and I had some surprisingly
agreeable reasons for doing so:

- HTTP works just fine for low volume messages, and WebSockets would not have significantly increased speed or fixed any reliability problems, which I did not have.

- I already have a good-enough method of inter-device communication, simply forwarding HTTP requests that can be easily <code>awaited</code>.

- Extra moving parts with establishing and housekeeping WebSocket connections increased risk and I was not confident my code would catch and handle all close and error events.

- Lots of code duplication between server and client dashboard meant I had to basically write half the <code>bifrost</code> library in each dashboard application.

- Some clear thinking on sunk costs told me I was better off immediately redirecting my energy (and precious off-work hours) now instead of another few months from now.

- The end result would have been functionally idential - was it worth that much more effort, stress, and time?

So it's shelved - the finished application can be found in the
<code>unused</code> directory in the project, but all app upgrades will just
live in the <code>bifrost-ify</code> git branch just in case I have a brainwave
solution or a more definite need for that kind of communication protocol.

Now I've restored the Pi stack and mentally freed myself of the unresolved
project burdern I can look to the next in my list of projects and feel that bit
more energised in doing so...