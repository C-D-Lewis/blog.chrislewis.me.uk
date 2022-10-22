Meet Norren: The Tame Discord Bot
2022-10-22 09:42
JavaScript,Raspberry Pi
---

An idea I've had for a long time, but never found a practical use-case for is
creating a Discord bot. I see them all the time, sometimes performing useful
features or management for a Discord server, or just for amusement. After
recently adding some more novelty sounds to a soundboard webapp for my regular
gaming group, we organically arrived at the idea of converting the soundboard
into a bot - and other gaming related ideas also quickly arrived soon
afterwards.

## Meet Norren

After a couple of evenings trial-and-error with <code>discordjs</code> and its
pretty decent [documentation](https://discordjs.guide/#before-you-begin) (a
rare example of example-based documentation that we need more of as a species)
I produced a rudimentary bot. I named it Norren after a helpful guiding
character my brother thought up during our DnD campaign a couple of years ago.

![](assets/media/2022/10/norren-bot.png)

So, what can he do? As of writing, several things relating to playing novelty
sounds and music, but also a few other useful functions for the server and
while gaming. The <code>/help</code> command shows all the possibilities:

![](assets/media/2022/10/norren-help.png)

## Architecture

The first thing to note is that Discord's API has a notion of these commands
as RESTful resources - meaning you can declare what they are so users can view
and choose from them even while the bot is offline. The library makes the
process of creating these easy:

```js
const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const { clientId, token } = require('../config.json');

const [SERVER_ID] = process.argv.slice(2);

const commands = [
  new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a d<n> die')
    .addNumberOption((option) => option.setName('d')
      .setDescription('The die maximum value, such as d20')
      .setRequired(true)),

  // Other command omitted for brevity
]
  .map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, SERVER_ID), { body: commands })
  .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
  .catch(console.error);
```

The fact that these slash commands are registered on a per-server basis means
when they are updated you must run the above for each server - but a quick bit
of scripting takes care of that.

When a user wants to see how to use the <code>/roll</code> command as an
example, the Discord client can show them the format and arguments:

![](assets/media/2022/10/norren-roll.png)

Whatever text you choose to return from the command is relayed back to the
channel where the command was invoked, or as a message only the calling user
can see:

![](assets/media/2022/10/norren-results.png)

Another notable example in the context of the gaming group is a command that
allows users to search the roll20.net compendium. The results are fetched
and transformed into usable output for the response:

![](assets/media/2022/10/norren-search.png)

## Parsing commands

Handling commands is made easy by <code>discordjs</code> via events that are
delivered over WebSockets instantaneously to the bot process that is listening
after initial connection:

```js
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('../../config.json');

/**
 * Initialise discord.js client.
 *
 * @param {object} opts - Function opts.
 * @param {Function} opts.onCommand - Callback on slash command received.
 * @param {Function} opts.onMessage - Callback on message received.
 * @returns {Promise}
 */
const setupClient = async ({ onCommand, onMessage }) => new Promise((resolve) => {
  // Create a new client instance
  const newClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });

  // When ready
  newClient.once('ready', () => {
    client = newClient;
    client.user.setStatus('online');
    log('Connected to Discord');
    resolve();
  });

  // When a command received
  newClient.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, user: { username }, options } = interaction;
    await onCommand(commandName, interaction);
  });

  // Server general message
  newClient.on('messageCreate', async (interaction) => {
    const { author: { id: callerId }, mentions, content } = interaction;
    const { id: botId } = getClient().user;

    // If mentioning me, and it wasn't me
    if (mentions.users.get(botId) && callerId !== botId) return onMessage(interaction);

    // Some other chat going by
    return undefined;
  });

  // Log in
  newClient.login(token);
});
```

The implementation of <code>setupClient</code> abstracts out a callback for when
a command or message mentioning the bot (and importantly isn't the bot
itself - that was a messy event) is received, allowing application logic to be
easily built upon that. For example, a separate handler file for each unique
command addressable with a map:

```js
const handleRoll = require('../commands/roll');
const handleSearch = require('../commands/search');
const handleAudio = require('../commands/audio');
const handleJoin = require('../commands/join');
const handleLeave = require('../commands/leave');
const handlePin = require('../commands/pin');
const handleAsk = require('../commands/ask');
const handleHelp = require('../commands/help');
const handlePing = require('../commands/ping');
const { AUDIO_TYPE_SOUND, AUDIO_TYPE_MUSIC } = require('../constants');

/**
 * Find the command handler function for the named command.
 * Corresponds to all those registered with deploy-slash-commands.js
 *
 * @param {string} name - Command name.
 * @returns {Function} handler function.
 */
const getCommand = (name) => {
  const map = {
    roll: handleRoll,
    search: handleSearch,
    sound: (interaction) => handleAudio(interaction, AUDIO_TYPE_SOUND),
    music: (interaction) => handleAudio(interaction, AUDIO_TYPE_MUSIC),
    join: handleJoin,
    leave: handleLeave,
    pin: handlePin,
    ask: handleAsk,
    help: handleHelp,
    ping: handlePing,
  };

  if (!map[name]) throw new Error('I dont know that command, but I should know it');

  return map[name];
};
```

Thus, <code>onCommand</code> is easily implemented using the aforementioned
callback from the client module:

```js
/**
 * When a command is received.
 *
 * @param {string} name - Command name.
 * @param {object} interaction - Discord.js interaction object.
 * @returns {Function|AsyncFunction} Handler that returns reply text.
 */
const onCommand = async (name, interaction) => {
  try {
    const command = getCommand(name);
    return await command(interaction);
  } catch (e) {
    const err = `⚠️ ${e.message}`;
    log(err);
    return replyHidden(interaction, err);
  }
};
```

<code>replyHidden</code> is a convenience method to reply only to the calling
user instead of spamming the channel for all users.

## Auto reactions

When a message is received, the bot has the ability to add emoji reactions to it
which are part of the configuration file. As you can see, both built-in and
custom emojis are supported, once you find out the custom emoji's ID:

```js
{
  "token": "TAyNzkzOD......",
  "clientId": "10279382...",
  "guildId": "10279363...",
  "reactions": [
    { "trigger": "golden boi", "emoji": "<:Happy:831178336830881792>" },
    { "trigger": "hello", "emoji": "👋"}
  ],
  "onJoinSound": "hohohotravellers.opus",
  "onLeaveSound": "thanksforstaffmagnus.opus"
}
```

Thus, when a message contains the <code>trigger</code> string, the corresponding
</code>emoji</code> is used in a reaction. All are evaluated concurrently,
allowing one message to have many reactions:

![](assets/media/2022/10/norren-react.png)

Also alluded to in the configuration are sound file names for when Norren joins
or leaves...

## Giving Norren a voice

...a voice session - this is the last major trick up his sleeve, allowing the
bot to contribute the aforementioned soundboard sounds and music pieces, which
could also provide atmosphere to future DnD sessions over Discord. This is made
quite easy by the <code>@discordjs/voice</code> package which integrates with
<code>discordjs</code> itself, consuming the voice and channel information
from the command and message events.

Because the bot can be invited to multiple Discord servers, I wrapped up the
process of joining and leaving, plus the callback-based connection and audio
player state and events into an easier to use <code>VoiceAgent</code> object,
which is instantiated on a per-channel (or 'guild') basis:

```js
// Cache agents for each server
const voiceAgents = {};

/**
 * Prepare the voice agent.
 *
 * @returns {object} The VoiceAgent.
 */
const getVoiceAgent = (voice) => {
  const { id: guildId } = voice.guild;

  // One agent per guild
  if (!voiceAgents[guildId]) {
    voiceAgents[guildId] = VoiceAgent(voice);
  }

  return voiceAgents[guildId];
};
```

The entire <code>VoiceAgent</code> constructor is shown here, and as you can see
makes it a lot easier to work with and maintain the events and state. Hooray
for encapsulation! The most important thing is that a connection must be in
the correct state for playing audio, and the audio player must be in the correct
state to play the sound or music requested:

```js
/**
 * Abstract away all state and internals related to handling voice connection
 * and player status.
 *
 * @param {object} voice - discord.js voice object.
 * @returns {object}
 */
const VoiceAgent = (voice) => {
  const { id: guildId } = voice.guild;
  let player;
  let readyToPlay = false;
  let willStayConnected = false;
  let playEndCb;

  /**
   * Stop and disconnect.
   */
  const leaveAndReset = async () => {
    try {
      const connection = getVoiceConnection(guildId);
      await connection.disconnect();
      await connection.destroy();
      log('Stopped and disconnected');
    } catch (e) {
      log(`Error disconnecting: ${e.message}`);
    }

    readyToPlay = false;
    willStayConnected = false;
  };

  /**
   * Prepare the player.
   */
  const preparePlayer = async () => {
    player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
    getVoiceConnection(guildId).subscribe(player);

    // Play selected sound
    player.on('stateChange', async (old, _new) => {
      if (old.status === _new.status) return;
      log(`Audio: ${old.status} -> ${_new.status}`);

      // Finished
      if (_new.status === 'idle') {
        if (playEndCb) playEndCb();
        if (!willStayConnected) await leaveAndReset();
      }
    });
    player.on('error', async (error) => {
      log('Player error:');
      log(error);
      await leaveAndReset();
    });

    readyToPlay = true;
  };

  /**
   * Set whether to stay connected after a sound completes.
   *
   * @param {boolean} stayConnected - Whether to stay connected after sounds play this join.
   */
  const setStayConnected = (stayConnected) => {
    willStayConnected = stayConnected;
    log(`willStayConnected: ${stayConnected}`);
  };

  /**
   * Join a voice connection.
   *
   * @returns {Promise}
   */
  const join = async () => new Promise((resolve) => {
    // Already connected
    if (readyToPlay) {
      resolve();
      return;
    }

    // Prepare connection
    const connection = joinVoiceChannel({
      channelId: voice.channel.id,
      guildId: voice.guild.id,
      adapterCreator: voice.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
    connection.on('stateChange', (old, _new) => {
      if (old.status === _new.status) return;
      log(`Connection: ${old.status} -> ${_new.status}`);

      // When connected
      if (_new.status === 'ready' && _new.status !== old.status) {
        preparePlayer();
        resolve();
      }
    });
    connection.on('error', (error) => {
      log('Connection error:', error.message);
      leaveAndReset();
    });
  });

  /**
   * Play a given sound.
   *
   * @param {string} soundName - Name of the sound file.
   * @returns {Promise}
   */
  const play = async (soundName) => new Promise((resolve) => {
    // Allow waiting for playback
    playEndCb = resolve;

    player.play(getAudioResource(soundName));
  });

  return {
    join,
    leave: leaveAndReset,
    play,
    setStayConnected,
  };
};
```

There is also functionality for
instructing Norren to leave or rejoin the user's voice channel, or leave
immediately after playing a sound, which can lead to some quite comedic moments
when timing is good.

<video
  src="assets/media/2022/10/norren-scum.mp4"
  controls="controls"
  width="50%">

The usual way of using audio is to ask Norren to join with <code>/join</code>
and leave when we're done with him with <code>/leave</code>. It's nice to be
able to quickly react with the soundboard sounds before the timing is lost,
though usually that doesn't stop me... Plus the lack of constant join/leave
sound effects from Discord doesn't confuse us with when real people join or
leave, saving some awkward moments as well.

## Conclusion

Another lengthy post, but I felt it was important to show a lot of the relevant
code, especially in places where I solved some of the pain points of building
the bot - things like abstracting away complexity and allowing modular scaling
of the app and working with multiple servers. Keen-eyed readers will have
already spotted the link to the source code, so feel free to copy, tweak, or
just learn how to do this yourself - it's a lot of fun!
