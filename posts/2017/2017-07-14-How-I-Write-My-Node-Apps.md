How I Write My Node Apps
2017-07-14 22:53:46
Integration,JavaScript,Pebble,Raspberry Pi
---

With not a lot going on in terms of my Pebble apps (still very much in a 'if it ain't broke' situation), my hobbyist attentions in recent months turned to my Raspberry Pi. With not a lot of exciting ideas for hardware hacking, it occurred to me that <em>software</em> applications of the device might be a bit more interesting.

Beginning with moving the backend services for News Headlines and Tube Status out of a $5 Digital Ocean Droplet to a $0 Raspberry Pi under my desk (with a few forwarded ports, of course), I've steadily refined the standard pattern used to write and maintain these apps. At the most there have been six, but today there are five:

 • <a href="https://github.com/C-D-Lewis/news-headlines/tree/master/backend"><strong><em>News Headlines Backend</em></strong></a> - pushing headlines pins.

 • <a href="https://github.com/C-D-Lewis/tube-status/tree/master/backend"><strong><em>Tube Status Backend</em></strong></a> - pushing delay alerts pins.

 • <a href="https://github.com/C-D-Lewis/led-server"><strong><em>LED Server</em></strong></a> - providing a localhost RESTful interface to the Blinkt! hat on the physical Pi between apps.

 • <a href="https://github.com/C-D-Lewis/attic"><strong><em>Attic</em></strong></a> - a new app, serving and receiving simple JSON objects for storage, backed by a Gist.

 • <a href="https://github.com/C-D-Lewis/monitor"><strong><em>Monitor</em></strong></a> - responsible for monitoring uptime of the other services, and providing Greater Anglia and TfL Rail outage alerts to myself via my watch. Monitor actually just schedules regular invocations of its plugins' <code>update</code> interface function, making it extremely extensible.

With my adventures in Node and discovering convenient or standardised ways of doing things like modules, data storage/sharing, soft configuration, etc. these apps have all been refined to use common file layouts, common modules, and a standard template. With its relatively stable state of maturity, I'd like to share this with readers now!

<em>What? It's not February 2017 anymore? The pattern has matured even further, but I've only now found the time to write this blog post? Well, OK then, we can make some edits...</em>

<em><strong>Disclaimer: </strong><strong>This isn't an implementation of any actual accepted standard process/pattern I know of, just the optimum solution I have reached and am happy with under my own steam. Enjoy!</strong></em>

## File Layout

As you can see from any of the linked repositories above, the basic layout for one of my Node apps goes as follows:
src/
  modules/
    app-specific-module.js
  common/
    config.js
    log.js
  main.js
package.json
config.json
.gitignore   // 'config.json'
```

The <code>src</code> folder contains <code>modules</code> (modules that are specific to the app), and <code>common</code> (using common modules shared between all apps, such as <code>log.js</code> (standard logger, <code>pid</code> logging, and <code>uncaughtException</code> & <code>unhandledRejection</code> handlers), as well as <code>main.js</code>, which initialises the app.

This pattern allows all apps to use common modules that can be guaranteed not only the presence of each other, but of a common <code>config.json</code> that they can all use to draw configuration information (such as log level, API keys, latitude and longitude, etc.).

## Soft Configuration

Of particular interest is the <code>config.js</code> module, which all modules that use <code>config.json</code> information include <em>instead</em> of <code>config.json</code>. It is untracked in git, and so can safely contain sensitive keys and other values. It also guarantees that keys required by modules are present It also provides some additional benefits:

 • Ensuring the <code>config.json</code> file is present

 • Allowing modules that include it to requireKeys to be present in the <code>config.json</code> file, that they themselves require. <a href="https://github.com/C-D-Lewis/monitor/blob/master/src/modules/timeline.js#L6">Here is an example</a>.

 • Stop app launch if any of these keys are not present

 • Allow access to the app's launch directory context.

For example, a fictitious module may require an API key to be present in the <code>ENV</code> member of <code>config.json</code>:

```js
const config = require('../common/config');

config.requireKeys('fictitious.js', {
  ENV: {
    API_KEY: ''
  }
});
```

The way <code>config.js</code> behaves, if this structure is not present in <code>config.json</code>, the app will not start, and will tell the operator (i.e: me!) that the value should be provided. Handy!

## Standard Modules

Any of these Node apps (and any new apps that come along in the future) can make use of a library of drop-in standard modules, many of which can be found in action in any of the linked repositories at the top of this post), including:

 • <code>event-bus.js</code> - Provide a pub/sub 'event bus' style of communication between modules

 • <code>fcm.js</code> - Send an event to Firebase Cloud Messaging to show me a notification

 • <code>led-server-client.js</code> - Communicate with the localhost Blinkt! LED Server instance

 • <code>scraper.js</code> - Scrape some text using a series of 'before' markers, and one after 'marker'

 • <code>config.js</code> - Access 'smart' configuration with additional capabilities

 • <code>gist-sync.js</code> - Synchronise a local JSON file/set with a remote Gist

 • <code>leds.js</code> - Directly drive the connected Blinkt! hat

 • <code>db.js</code> - Emulate a simple get/set/exists interface with a local JSON file

 • <code>ip.js</code> - Look up the address of the 'mothership' server (either Server Pi or a Digital Ocean Droplet)

 • <code>log.js</code> - Standard logger, asserts, uncaught/unhandled catching.

## Wrapping Up

So with this standard pattern to my Node apps, it makes it a lot easier to manage the common modules as they are updated/improved, manage SCM untracked soft configuration values (as well as make sure I provide them after migration!), and allow modules to be as drop-in as possible. As with most/all of my hobbyist programming, these approaches and modules are the result of personal refinement, and not from any accepted standard, which is my preferred style when I am the only consumer. Maximise the learnings!

Expect more sporadic information as these apps develop, and enjoy the pins!
