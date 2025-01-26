todolist: A Beginner's Minecraft Mod
2025-01-26 10:45
Java
---

For a while I've had a back-burner goal to create some kind of mod for
Minecraft - I've played a lot of it with friends and now more than ever the
variety and potential for what mods add to the game is amazing. Obviously some
of the best are produced by large teams or very dedicated and talented
individuals but as one who enjoyed coding as a hobby, it seems a natural good
fit. 

In fact, I did try several years ago - at the time I think the process involved
using some tool to decompile a JAR of Minecraft and using Forge to write code
against it... I can't remember the details. The thing I produced was a block
that once a second examined the block below it and removed it, dropping the same
block as an entity out the top. I called it a drill and it had no sound or
textures, and was not particularly useful.

## Trying again later

Late last year, I finally sat down and did some research to see exactly what
would be involved to get started making a moden Minecraft mod. Given that I'm
maintaining two Paper servers it seemed obvious to see what was involved making
a mod for Paper or Bukkit (though I think Forge and Fabric are still options).

Luckily for me, there is pretty great
[documentation](https://docs.papermc.io/paper/dev/getting-started) and of course
there was more documentation nowadays. A most crucial difference is that with
the libraries installed by Gradle including
<code>io.papermc.paper:paper-api</code> means that decompiling Minecraft myself
is not required and code smply makes use of classes exposed by the Paper
API - much easier!

After creating a barebones project from one of the examples, I stripped it back
so that it contained as few files and lines as possible to give a clean base to
learn when adding my own code. After a little debugging of my Gradle setup
(I never had a firm grasp of Gradle from Android dev years ago anyway) I was
rewarded with:

```text
$ ./gradlew build
Reusing configuration cache.

BUILD SUCCESSFUL in 1s
3 actionable tasks: 2 executed, 1 up-to-date
```

Now I just needed an idea. I didn't want to go all-in and make a mod with a
dozen game-breaking convenience blocks or new mobs, and after some recent work
on a Discord bot the idea of something that uses only in-game commands seemed
like an attainable goal. A classic first project for a new language or platform
is the to-do list, and it was something at least myself would use (instead
of editing in-game signposts and have to travel to read), so I settled on that.

## Yet another to-do list mod

Taking a quick look at various mod sites, seems there are already a plethora of
to-do list mods with more features and more expert support, but that wasn't the
point of the project - I was on a learning adventure!

Following the Paper tutorials and some associated Googling, I determined the
first thing to update was the <code>plugin.yml</code> that describes the mod to
the server:

```yaml
name: TodoList
version: 1.0.0
main: uk.me.chrislewis.todolist.TodoList
description: A simple plugin to manage player TODOs
author: Chris Lewis
website: https://papermc.io
api-version: '1.21.1'
commands:
  todo:
    description: Use the todolist plugin
    usage: /todo help
```

The <code>main</code> property describes the class where the mod entrypoint is.
To make use of the events provided by the Paper API, the general outline looks
like this:

```java
package uk.me.chrislewis.todolist;

import java.io.File;
import java.util.ArrayList;
import java.util.logging.Logger;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;
import net.kyori.adventure.text.Component;

public class TodoList extends JavaPlugin implements Listener {

  private Logger logger;
  private Data data;
  private File dataFolder;
  
  @Override
  public void onEnable() {
    Bukkit.getPluginManager().registerEvents(this, this);
    logger = getLogger();

    // Init plugin folder
    dataFolder = getDataFolder();
    if (!dataFolder.exists()) {
      if (!dataFolder.mkdirs()) {
        logger.severe("Could not create plugin directory!");
        getServer().getPluginManager().disablePlugin(this);
        return;
      }
    }

    data = new Data();
    data.load(dataFolder, logger);
  }
  
  @EventHandler
  public void onPlayerJoin(PlayerJoinEvent event) {
    // ...
  }
  
  @Override
  public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
    if (args.length == 0 || args[0].equals("help")) {
      sender.sendMessage(Component.text("================ todolist help ==============").color(Colors.GREY));
      sender.sendMessage(Component.text("  /todo help - show this help").color(Colors.GREY));
      // ...
      return true;
    }

    String subcmd = args[0];
    
    if (!(sender instanceof Player)) {
      logger.info("todolist: Ignored command " + subcmd + " as you are not a Player");
      return true;
    }
    
    Player player = (Player) sender;
    String playerName = sender.getName();
    
    // Add a new item to a player's list
    if (subcmd.equals("add")) {
      // ...
      return true;
    }
    
    // List player's list
    if (subcmd.equals("list")) {
      // ...
      return true;
    }

    // ...

    // Not handled by todolist
    return false; 
  }
}
```

As can be seen, the key events I was using were:

- <code>onEnable()</code> - When the server is ready and mods are being loaded.

- <code>onPlayerJoin()</code> - When a player joins the game.

- <code>onCommand()</code> - When a player runs a command.

Using the Bukkit <code>registerEvents()</code> allows my class to respond to
these events. Eventually I settled on sending the player their outstanding
to-do items when they join so that they are reminded (this works quite well
for me!). If a command doesn't match one I expect, I return <code>false</code>
in <code>onCommand()</code> to tell the game to show the standard error for an
invalid command.

## The real work

The most difficult part of the project was figuring out how to reliably store
and reload the players' to-do items. In Node this would be trivial - use
<code>JSON.stringify/parse</code> and <code>read/writeFileSync</code>. This
would allow the data storage format to match how it is used in code.

But in Javaland, things aren't so simple. Everything is a class, and there is
no built-in support for things like JSON or YAML. A tutorial I found described
how to write a Java class that is serializable - meaning it can read and write
it's own state to a file, but in a non-human-readable binary format. This wasn't
ideal. I struggled for a few hours to find a JSON or YAML Java library that I
could easily add to the project and figure out how to use in code. The ones I
found were either designed for very high performance streaming data applications
or I just could not get to install/compile/run.

So eventually I gave up for the sake of completing the project and chose an easy
cop-out - writing a single file per player and one to-do per line. It was simple
but effective and meant the project didn't die an early death.

```java
/**
 * Save data to the file.
 * One file per player (because Java and any kind of JSON/YAML loading).
 * First line is name.
 * One line per todo.
 *
 * @param dataFolder Data File to save to.
 */
public void save (final File dataFolder, final Player player, final Logger logger) {
  try {
    String name = player.getName();
    UUID uuid = player.getUniqueId();
    String filename = dataFolder.getAbsolutePath() + "/" + uuid.toString() + ".txt";

    FileWriter fw = new FileWriter(filename);
    fw.write(name + '\n');

    ArrayList<String> items = todos.get(name);
    if (items != null) {
      for(String i : items) {
        fw.write(i + "\n");
      }
    }
    
    fw.close();
    logger.info("Saved data file for " + name);
  } catch (IOException e) {
    e.printStackTrace();
  }
}
```

The converse process or loading players' data when the server is restarted
looks quite similar - reading each file line-by-line and placing the data into
native data structures.

```java
/**
 * Load data from the file.
 *
 * @param dataFolder Data File to load from.
 */
public void load (final File dataFolder, final Logger logger) {
  File[] files = dataFolder.listFiles();

  try {
    for (File file : files) {
      String fileName = file.getName();
      if (!file.isFile()) {
        logger.warning("Ignoring non-file " + fileName);
        continue;
      }

      // Name is player name
      FileReader fr = new FileReader(file.getAbsolutePath());
      BufferedReader br = new BufferedReader(fr);
      String playerName = br.readLine();

      ArrayList<String> items = new ArrayList<>();
      String line = "";
      while ((line = br.readLine()) != null) {
        items.add(line);
      }

      // Restore data
      todos.put(playerName, items);

      br.close();
      logger.info("Loaded data file " + fileName);
    }
  } catch (Exception e) {
    e.printStackTrace();
  }
}
```

Is there a better approach? Absolutely! Did I want to spend all that extra time
on it for no functional benefit? Not this time.

## Seeing it in action

Installation of the output JAR is simple - placing into the Paper server's
<code>plugins</code> directory. You can tell if this is successful by seeing
some tell-tale log entries:

```text
[11:30:46 INFO]: [bootstrap] Loading Paper 1.21.1-128-master@d348cb8 (2024-10-21T16:23:24Z) for Minecraft 1.21.1
[11:30:46 INFO]: [PluginInitializerManager] Initializing plugins...
[11:30:47 INFO]: [PluginInitializerManager] Initialized 1 plugin
[11:30:47 INFO]: [PluginInitializerManager] Bukkit plugins (1):
 - TodoList (1.0.0)

...

[11:30:57 INFO]: [TodoList] Loading server plugin TodoList v1.0.0
[11:30:57 INFO]: Preparing level "world"

...

[11:30:59 INFO]: [TodoList] Enabling TodoList v1.0.0
[11:30:59 INFO]: [TodoList] Loaded data file data

...

[11:30:59 INFO]: Done preparing level "world" (2.345s)
[11:30:59 INFO]: Running delayed init tasks
[11:30:59 INFO]: Done (14.567s)! For help, type "help"
```

So what does this look like in game?

When logging in, you see the list of current to-do items for your player:

![](assets/media/2025/01/todolist-list.png)

And use the <code>add</code> command to add a new item:

![](assets/media/2025/01/todolist-add.png)

![](assets/media/2025/01/todolist-added.png)

When you complete a task, use the <code>delete</code> command to remove it from
the list:

![](assets/media/2025/01/todo-delete.png)

![](assets/media/2025/01/todo-deleted.png)

## Conclusion

So there it is - one 'complete' mod for Minecraft. It's not published, but it
is in use on the server I maintain and I use it a lot, so I consider it a
successful project!

You can find the code
[here](https://github.com/C-D-Lewis/mc-dev/tree/main/todolist), including a
built JAR for 1.21.1.
