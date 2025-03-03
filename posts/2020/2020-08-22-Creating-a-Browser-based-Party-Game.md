Creating a Browser-based Party Game
2020-08-22 13:57
JavaScript,Games,AWS
---

(Project from July 2020)

A long time ambition of mine has been to create a game. I play enough of them,
and I like the idea of working on a concept and adding all sort of things to
enhance it. I like games that have procedural generation because they can make
endless hours of entertainmend out of a fixed number of elements. Take games
like Factorio, or Prison Architect. I have over 100 hours of each accumulated
over the last 6 years or so and this factor of rearranging and redesigning using
set elements is probably the key.

But sadly, each time I sit down and plan a game similar, such as a space-themed
top-down couch-coop shoot-em-up with procedurally generated weapons, maps, and
NPCs, the same thing happens: I create a modular 'engine' that makes it simple
to build maps, NPCs, etc on top, then run out of steam when it comes to
producing actual gameplay. Things like drawing graphics, adding menus, working
with controllers, generating corridors with fiddly little corners if they are
at the end of a room all conspire to bring the project to a stale end.

## Browser based fun

So this time happily a different set of factors inspired me. I played
[https://skribbl.io](skribbl.io) with some friends as a way of virtually hanging
out, and it was great fun. The idea that a relatively simple game can be easily
accessed in the browser, and where only a few gameplay elements should mean a
boring game are significantly enhanced due to the fact that you are playing with
friends, other human beings. So the game itself is just a means to a lot of
laughs, fun, and other banter. I wondered if I could make something similar to
meet these criteria, and check this goal off the list in a much less ambitious
way...

After a few weeks of on/off work, the end result has coalesced into
[Pixels With Friends](https://pixels.chrislewis.me.uk). The core idea is similar
to Connect Four, but played until the board is full, and with a couple of
special patterns and opportunities allowing bonus points and capturing tiles
from other players.

![](assets/media/2020/08/ingame.png)

The game itself consists of the following main features:

- A Node.js Express-based game server with a REST API that allows clients to open game rooms, register players, etc

- A React-based client that polls game state from the game server, allowing players to join rooms, place tiles, etc.

- Bot players that attempt to play the game and defeat runs of multiple tiles.

- Team colors for team-based victories and strategies.

- Similar infrastructure to this blog (S3 website + CloudFront) for cloud deployment.

## Gameplay

When a player first loads the page, they choose a player name and are given the
option of creating a new room, or choosing from a list of existing rooms. When
a room is empty of all human players it is deleted so the list consists of only
current games.

![](assets/media/2020/08/roomlist.png)

When more than two players of more than two teams are present, the host is shown
the button to start the game. At this point the room is 'in game' and so the
game board is shown. A 15 second countdown is there to make sure turns are kept
short, and when a player places a tile the current player advances to the next.
The background color fades between players to give a hint about whose turn it
is.

![](assets/media/2020/08/turns.gif)

Players can create runs of four or more tiles in a row, and receive bonus points
for completing a run without being interrupted by another player. Similarly, a
player can capture another player's tile by surrounding it on all four sides,
converting it to their color and earning bonus points. Special tile types are
implemented, starting with the '2x' tiles placed at random locations and
offering double points for unearthing them. This bonus is considered when a
run or capture is completed, which can lead to quite large jumps in points at
once. It's a feature!

When the board is full and no more moves are possible, the game transitions to
the last screen, where all player scores are shown, the overall winning team is
identified, and some basic stats about play styles are also shown. Players can
opt to play again if they wish.

![](assets/media/2020/08/gamefinished.png)

## Architecture

The backend service is a Node.js server running Espress, exposing the REST API
used by the web client:

```js
app.get('/rooms', handleGetRooms);
app.get('/rooms/:roomName', handleGetRoom);
app.put('/rooms/:roomName/player', handlePutRoomPlayer);
app.put('/rooms/:roomName/players/:playerName/nextColor', handlePutRoomPlayerNextColor);
app.put('/rooms/:roomName/inGame', handlePutRoomInGame);
app.post('/rooms/:roomName/square', handlePostRoomSquare);
app.post('/rooms/:roomName/nextTurn', handlePostRoomNextTurn);
app.put('/rooms/:roomName/bots', handlePutRoomBot);
app.put('/rooms/:roomName/bots/:playerName/nextLevel', handlePutRoomBotNextLevel);
```

A request to read all rooms with <code>/rooms</code> request yields details of
all the open rooms. The state of the room's game board is omitted for brevity.
An example containing one room with a player and one bot is shown below, giving
an idea of the makeup of the data model for player name, room name, player color
and other special bits of data. The room also keeps track of its state, the
player whose turn it is, and whether the board is full.

{
  "rooms": [
    {
      "roomName": "FearsomeGreenPoodle",
      "players": [
        {
          "playerName": "Chris",
          "botData": null,
          "score": 0,
          "lastSeen": 1598105881191,
          "color": "blue",
          "index": 0,
          "conversions": 0,
          "runs": 0,
          "bestRunLength": 0,
          "isHost": true
        },
        {
          "playerName": "Twobit",
          "botData": {
            "level": 0,
            "trait": null
          },
          "score": 0,
          "lastSeen": 1598105865664,
          "color": "red",
          "index": 1,
          "conversions": 0,
          "runs": 0,
          "bestRunLength": 0
        }
      ],
      "currentPlayer": "Chris",
      "inGame": false,
      "allSquaresFilled": false
    }
  ]
}
```

## Have a go

Check out the [repository](https://github.com/c-d-lewis/pixels-with-friends) for
full source code and to discover how the whole thing works. Maybe even try and
beat some bots!
