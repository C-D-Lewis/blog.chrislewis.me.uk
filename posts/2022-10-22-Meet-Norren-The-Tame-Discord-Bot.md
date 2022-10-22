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

architecture

examples

