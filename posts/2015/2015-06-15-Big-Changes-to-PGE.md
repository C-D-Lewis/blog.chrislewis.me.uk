Big Changes to PGE
2015-06-15 03:08:45
Integration,JavaScript,Pebble,Games
---

After integration of the <a href="https://github.com/C-D-Lewis/pge/blob/master/docs/pge_isometric.md">Isometric</a> and <a href="https://github.com/C-D-Lewis/pge/blob/master/docs/pge_ws.md">WebSocket</a> modules (previously 'additional') into <a href="https://github.com/C-D-Lewis/pge">PGE</a>, I took some time to do something I'd wanted to do for a while: make it a repo usable directly after <code>git clone</code>. Previously the repo was an example project which could be cloned and played around with, but to use the engine in a new game required knowing which files to copy into the new project.

After re-organization, the repo can now be directly <code>git clone</code>d into the new project's <code>src</code> directory and requires no further manipulation to be compiled. The previous asteroids example has been moved to a new <a href="https://github.com/C-D-Lewis/pge-examples">pge-examples</a> repository on the <code>asteroids</code> branch, which also hosts a new example 'game' for the WebSockets module PGE WS, which aims to allow developers to send and receive multiplayer data with as few lines as possible. The example allows each player who installs the example to trigger a vibration on all other player's watches while they are running the game, after hosting the server.

For an overview of how to use the new WebSockets module, <a href="https://github.com/C-D-Lewis/pge/blob/master/docs/pge_ws.md">check out the docs for PGE WS</a>, which summarizes how to set up the server (which forwards all data both directions automatically by default), the JS client, and a C client, which needs only to connect, send and receive data.
