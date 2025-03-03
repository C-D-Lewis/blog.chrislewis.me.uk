First Network Game Implemented
2013-04-18 23:31:10
Java
---

Today is an exciting day. Why? Because I played a game with someone in <a class="zem_slink" title="Germany" href="http://maps.google.com/maps?ll=52.5166666667,13.3833333333&spn=10.0,10.0&q=52.5166666667,13.3833333333 (Germany)&t=h" target="_blank" rel="geolocation">Germany</a>.

Why is this exciting you may ask? Good question. It wasn't just any game. It was a 'game' I wrote! That makes it special, even if it is just moving a red circle around.

When another red circle appears with another player's name above it, that circle is elevated beyond mere <em>geometry</em> and into an extension of that person.

How it is moved by that person becomes the first form of expression, beyond any language.

Anyway, dramatics aside, here's a screenie of me playing against myself. When I have one of a proper multiplayer session I'll add it:

![](/assets/import/media/2013/04/multiplayersuccess.png?w=545)

Brief details for those interested:

• <span style="line-height:12px;">When a player is moved locally, it sends "#playerposition", followed by its location x and y to the server. </span>

• This information is then sent to all connected clients in the form "#playerupdate", followed by that player's name, x and y. The name of each player is associated with each listening thread on the server.

• When each client receives "#playerupdate", it updates that player's local entity's target position with the new x and y. If that player doesn't exist, it is spawned and immediately given its current target.

• Each frame, every local entity representing another network player is moved linearly towards its last target position received from the server. This gets around continuously streaming all positions all over the place, and each client need only send data when the local player actually moves.

• When a player disconnects, it sends "#disconnect". The server then issues a "#despawn" command to all connected clients, followed by the disconnecting player's name. Each client then removes the corresponding local entity.


I am aware that this is a very crude 'move to target' system that will only really work in obstruction free scenes. Anything more complicated like an environment made of corridors and squares like '<a title="A Brief Overview of ‘dungeons’ so far" href="http://ninedof.wordpress.com/2013/03/27/a-brief-overview-of-dungeons-so-far/">dungeons</a>' and pathfinding will have to rear its ugly head once again.

But thats okay, because it seems to get easier and simpler to implement each time it comes around.

If you'd like to help me test this, send me a tweet and we can arrange something!
