Stack Chat - A Simple Chat Webapp
2021-01-18 19:05
React,JavaScript
---

I know it's a cliche use-case, but a simple chat application is something I have
yet to try, and I like trying common things in a reasonably from-scratch way to
see how they work and tackle some relatively 'safe' problems myself as a way of
keeping my problem solving skills sharp. Sure, as with this example, common
use-cases have been well-solved, but it's still a fun and rewarding experience.

And as with all such projects, I get ultimate say over the look, functionality,
features, schema, etc. and can call upon the result for personal use as well as
sharing with any other interested parties.

And if the world starts to end and I need a private, known quantity for
communication, well...

## Getting Started

So after a quick refresher on WebSockets after my
[last encounter for PGE games](https://github.com/C-D-Lewis/pge/blob/master/pge-ws-server/app.js)
I got stuck in. There were three main objectives:

1. A server that receives messages from clients, and re-transmits them to other clients.

2. A simple frontend webapp that allows users to identify themselves, see recent chat messages, and send new messages.

3. Be simple to set up and deploy.

## Backend

As it turns out, a WebSockets server that just has to re-broadcast messages
isn't very complicated:

<!-- language="js" -->
<pre><div class="code-block">
/**
 * Broadcast data to all clients.
 * 
 * @param {string} data - Data to send
 */
const broadcast = data => server.clients.forEach(p => p.send(data));

/**
 * When a client sends a message.
 * 
 * @param {object} client - Client that sent the message.
 * @param {string} data - The message.
 */
const onClientMessage = (client, data) => {
  console.log(`message: ${data}`);

  // Re-broadcast message to all clients
  broadcast(data);
};

// Other server starting and connection listening code...
</div></pre>

If in the future the server cares about who sends the messages, which channels
exist and contain which users, then some more filtering, caching of user/channel
data will be required - but this is a task for future me!

## Frontend

As a quick project and demonstrator, I chose React as a familiar and
quick-to-start framework for the chat webapp itself. I opted to not use higher
level concepts such as routing and pages, or a proper state store such as
<code>react-redux</code> since all I needed was two states:

1. Connecting and choosing a username.

2. Sending messages and viewing incoming messages in a list.

For this, passing component state and conditionally showing two main layouts
was enough to get things going. I already had an idea in my head how the UI
should be clean, with an emphasis on colors to denote participants and leaving
the space relatively clutter free. Here's an example conversation some may
find familiar:

![](assets/media/2021/01/stack-chat-mobile.png)

And of course, use of Flexbox means that a simple column app can also easily
look good on larger screens too:

![](assets/media/2021/01/stack-chat-desktop.png)

Evidently, not even a simple UI and uncluttered workspace can guarantee that
any attempt at conversion is completely successful...

## Communication

The use of WebSockets in the frontend is also nice and simple - and a little
abstraction in the right places always goes a long way to making shared code
accessible and useful! For example, the connection process:

<!-- language="js" -->
<pre><div class="code-block">
/** Generated config.js using webpack at build time */
const { HOST, PORT } = window.config;

/**
 * Connect to the configured server.
 * 
 * @param {function} setConnectedState - Callback to update connectedState.
 * @param {function} onWebsocketMessage - Callback when a message is received.
 */
export const connect = (setConnectedState, onWebsocketMessage) => {
  const protocol = HOST.includes('https') ? 'wss://' : 'ws://';
  
  try {
    socket = new WebSocket(`${protocol}${HOST}:${PORT}`);
    
    socket.addEventListener('open', () => setConnectedState(true));
    socket.addEventListener('message', event => onWebsocketMessage(JSON.parse(event.data)));
    socket.addEventListener('error', (event) => {
      alert(event);
      setConnectedState({ error: event });
    });
  } catch (err) {
    console.log(err);
    setConnectedState({ error: err.message });
    setTimeout(() => alert(err.stack), 500);
  }
};
</div></pre>

And sending messages uses an established message schema (I do like a good
message schema...):

<!-- language="js" -->
<pre><div class="code-block">
/**
 * Send a chat event message to the server.
 * 
 * @param {string} userName - This client's userName.
 * @param {string} draft - Draft message.
 * @param {string} color - This client's color.
 */
export const sendMessage = (userName, draft, color) => {
  const event = {
    type: 'ChatMessage',
    data: {
      from: userName,
      content: draft,
      backgroundColor: color,
      timestamp: Date.now(),
    }
  };

  socket.send(JSON.stringify(event));
};
</div></pre>

This means that all messages sent can be easily interpreted by both the backend
(who may need to perform filtering in the future), as well as all the identical
connected clients.

And lastly, it also help define special messages that also use the schema:

<!-- language="js" -->
<pre><div class="code-block">
/**
 * Send an event message reporting this new user.
 * 
 * @param {string} userName - This client's username.
 */
export const reportNewUser = (userName) => {
  const event = {
    type: 'NewClient',
    data: { userName },
  };

  socket.send(JSON.stringify(event));
};
</div></pre>

Messages using this schema can be seen in the server logs:

<!-- language="none" -->
<pre><div class="code-block">
message: {"type":"NewClient","data":{"userName":"Dr Rumack"}}
message: {"type":"NewClient","data":{"userName":"Captain Oveur"}}
message: {"type":"ChatMessage","data":{"from":"Dr Rumack","content":"Captain, how soon can you land?","backgroundColor":"rgb(109,52,62)","timestamp":1610983392283}}
message: {"type":"ChatMessage","data":{"from":"Captain Oveur","content":"I can't tell","backgroundColor":"rgb(7,177,67)","timestamp":1610983399336}}
message: {"type":"ChatMessage","data":{"from":"Dr Rumack","content":"You can tell me, I'm a doctor.","backgroundColor":"rgb(109,52,62)","timestamp":1610983409378}}
message: {"type":"ChatMessage","data":{"from":"Captain Oveur","content":"No, I mean I'm just not sure.","backgroundColor":"rgb(7,177,67)","timestamp":1610983419296}}
message: {"type":"ChatMessage","data":{"from":"Dr Rumack","content":"Well, can't you take a guess?","backgroundColor":"rgb(109,52,62)","timestamp":1610983428647}}
message: {"type":"ChatMessage","data":{"from":"Captain Oveur","content":"Well, not for another two hours.","backgroundColor":"rgb(7,177,67)","timestamp":1610983442314}}
message: {"type":"ChatMessage","data":{"from":"Dr Rumack","content":"You can't take a guess for another two hours?","backgroundColor":"rgb(109,52,62)","timestamp":1610983453649}}
</div></pre>

## Future ideas

For now it's relatively barebones. And nobody is clamouring to use it, but as
with all my projects I have other ideas for improving it:

1. User login

2. Discrete channels to separate chats, such as <code>#captains_chat</code> in the URL.

3. Automated deployment with Terraform and CloudFront, using configuration and pipeline code from [other recent projects](https://github.com/c-d-lewis/pixels-with-friends).

As always, check out all the source code in the
[GitHub repository](https://github.com/C-D-Lewis/stack-chat).
