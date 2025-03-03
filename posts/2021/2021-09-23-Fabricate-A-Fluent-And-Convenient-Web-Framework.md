Fabricate.js - A Fluent and Convenient Web Framework
2021-09-24 21:26
JavaScript,Releases,React
---

Despite using React quite a bit in my professional work, it is rare that one of
my personal web projects is large or complex enough to demand such a robust
solution - a lot of the time I only need to create a small, modular,
component-based interface to some APIs or data with limited functionality.

Examples of this include the dashboards for the
[node-microservices](https://github.com/c-d-lewis/node-microservices) project,
for controlling Raspberry Pi devices and backlights, where all that was needed
was some UI to make it easier to send and receive API data and list objects that
represented those devices. Other examples include a novelty soundboard, journal
keeping app, and even this blog itself. That last one may be the closest to
actually justifying using a more popular framework, but it's still just an
output for information, hardly a Web-2.0 SPA experience.

## Some history

In the distant past, such efforts may have been as basic (but arguably still
very much effective) as creating most of the page's HTML beforehand and adding
the dynamic portions with JavaScript later on, such as the example below:

```js
// Read devices from the API
fetchDevices()
  .then((devices) => {
    // Clear the last list results
    const deviceList = document.getElementById('device-list');
    deviceList.innerHTML = '';

    // Add the new list items
    devices.forEach(function (device, i) {
      const item = document.createElement('div');
      item.className = 'device-item';
      item.innerHTML = 'Device ' + i + ': ' + device.name + ' (' + device.ip + ')';
      item.addEventListener('click', doSomethingWithDevice);

      deviceList.appendChild(item);
    });
  });
```

Over time, and in the initial version of this blog, the component-based nature
of React served as an inspiration to model the page less as a series of
operations but more as a description of the components that make up each portion
of the UI. This is also known as the declarative style. Therefore creating HTML
elements from JS can take on a more modular approach:

```js
/**
 * Create a div to display device data.
 *
 * @param {object} data - Device data.
 * @returns {HTMLElement}
 */
const createDeviceItem = (data, i) => {
  const div = document.createElement('div');
  div.className = 'device-item';
  div.innerHTML = `Device ${i}: ${device.name} (${device.ip})`;

  div.addEventListener('click', doSomethingWithDevice);

  return div;
};

// Read devices from the API
fetchDevices()
  .then((devices) => {
    // Clear the last list results
    const deviceList = document.getElementById('device-list');
    deviceList.innerHTML = '';

    // Add the new list items
    devices.forEach(function (device, i) {
      deviceList.appendChild(createDeviceItem(device, i));
    });
  });
```

This is a bit more structured and can be re-used in multiple places, a bit more
relevant to a component such as the tags on this blog, which are the same
component in both the post and the sidebar, but configured differently.

But, we're still using quite a bit of raw Document API calls to build the UI.
Things like looping over data shouldn't be quite as verbose, and if multiple
parts of the app control this UI portion, there will be more code duplication
that is strictly required.

## Fabricate.js

After a couple of years using functions similar to <code>createDeviceItem</code>
to turn data into <code>HTMLElement</code>s, I decided to try and formalise this
approach I had organically made use of in a few different projects and try and
unify it so that it could serve as a common baseline for all those different
use-cases. It also had to have some of my personal opinions about styles-in-code
too, since that's how I like to keep my components as a complete single unit in
code.

[fabricate.js](https://github.com/c-d-lewis/fabricate) builds on this
slightly more declarative approach (although not wholy-delcarative, as React's
JSX and shadow DOM reconciliation realize) to provide a set of functions and
helpers to make it fast and relatively easy to create just the kinds of UI
already described, not as another competitor to the major players in the space,
but once again something I can use and say I learned something more about
building libraries in the process. I like creating libraries!

The features at the time of writing include:

- Free-form creation of HTML elements using a fluent chainable syntax.

- Easily adding click, hover, change handlers.

- Easy management of child elements.

- Convenience methods to use Flexbox, begin an app hierarchy, and detect mobile devices.

- Simple global state management and component notification.

- Simple conditional rendering.

- Lots of basic starter components that can be easily extended such as Flexbox column/row, text, image, text input, button, loader, fader, material card and more.

Revisitng the devices example, it starts to look a bit more readable:

```js
/**
 * Create a div to display device data.
 *
 * @param {object} data - Device data.
 * @returns {HTMLElement}
 */
const DeviceItem = ({ name, ip }, i) => fabricate('div')
  .asFlex('row')
  .withStyles({
    backgroundColor: '#444',
    padding: '10px',
    border: 'solid 2px #4444',
    borderRadius: '5px'
  })
  .onClick(doSomethingWithDevice)
  .setText(`Device ${i}: ${device.name} (${device.ip})`);

// Use a simple column for the device list
const deviceList = fabricate.Column();

// Begin app hierarchy
fabricate.app(deviceList);

// Read devices from the API
fetchDevices()
  .then((devices) => {
    // Clear the last list results
    deviceList.clear();

    // Add the new list items with map
    deviceList.addChildren(devices.map(DeviceItem));
  });

```

To anyone that's used React in the past, this style should look a lot more
familiar, but to the rest, at least more accessible and easier to put together.
Abstractions around creating elements, applying styles and attributes, adding
interactivity, and composing components as concepts are catered for with not
too much syntax.

## State management

A simple global state is able to be managed by instructing components to listen
to specific keys, and updating those keyed values. Here's a counter example:

```js
/**
 * Counter view output based on state updates.
 *
 * @returns {HTMLElement}
 */
const CounterView = () => fabricate('h3')
  .watchState((el, state) => el.setText(`${state.count}`));
```

The counter view is notified whenever the state is updated, and has access to
more than just a specific part of the state. Updating the state is achieved
with use of <code>updateState</code> which allows specific updating of a single
piece of state, to make a small effort to prevent overwriting the entire state
by accident. An example that increments the counter value on a timer is shown
below:

```js
// Begin app with initial state
const initialState = { count: 0 };
fabricate.app(CounterView(), initialState);

// Increment the counter every second
setInterval(
  () => fabricate.updateState('count', prev => prev.count + 1),
  1000,
);
```

In this way, state can be updated from anywhere in the app, and updates to
components that use those state values is also independant. Sure, it's not as
fancy as re-rendering the shadow DOM with React, but it's enough to get the
benefits of such a style of app state without needing to coordinate all the
individual places state should be set and read, and makes intuitive sense in
each component/update context.

## Conditional rendering

One of the more useful features of React and JSX is the ability to express at
once if/when a tree of components should be rendered. For instance, depending
on a <code>loading</code> flag either a spinner or a component displaying the
loaded data should be shown. In the past, this sort of thing is done by showing
or hiding elements in specific places in code when those changes should occur.
If the app logic is complex, there can be many places this is done and can be
hard to manage.

With fabricate.js, this is done by taking advantage of the previously discussed
state management with the <code>when</code> function. Simply put, you specify
a callback for checking the state, and a second callback that instructs how the
conditional component tree should be constructed. If the state check returns
<code>false</code> then the element is simply removed if it exists and only
re-added when the check returns <code>true</code> again. Here's an example to
better illustrate the concept in action:

```js
/**
 * Weather view for the loaded data.
 *
 * @returns {HTMLElement}
 */
const WeatherView = () => fabricate('h3')
  .watchState(
    (el, state) => el.setText(`${state.temp} degrees, ${chance}% rain chance`),
  );

/**
 * Data widget that shows a loader until loading is complete.
 *
 * @returns {HTMLElement}
 */
const WeatherWidget = () => fabricate.Card()
  .withChildren([
    when(state => !state.isLoaded, () => fabricate.Loader()),
    when(state => state.isLoaded, () => WeatherView()),
  ]);

// Begin the app
fabricate.app(WeatherWidget(), {
  isLoaded: false,
  temp: 0,
  chance: 0,
});

// Fetch weather data and display
fetchWeather()
  .then((results) => {
    updateState('temp', () => results.currentTemperature);
    updateState('chance', () => results.precipitationChance);
    updateState('isLoaded', () => true);
  });
```

You can see the
[login-box](https://github.com/C-D-Lewis/fabricate/blob/main/examples/login-box/index.html)
example to see how a email/password and spinner animated login box can be
implemented in a similar fasion with not too much code.

In the future I may add a way to update many fields at once and still try and
prevent accidentally replacing the enture state, such as an object to merge with
the previous state, but that doesn't work nicely with deeply nested state
objects - a problem for future me!

## Examples

The repository has several example apps ranging from simple demos of individual
components to the obligatory 'todo list' or 'task list' example app. But of
course, the most interesting and complex app already using this framework is
this blog itself - a good example is the
[moving social link pills](https://github.com/C-D-Lewis/blog/blob/master/src/components.js#L307)
at the top, which itself composes smaller <code>SocialPill</code> components.

```js
/**
 * SiteSocials component with the GitHub, Twitter, LinkedIn and RSS pills.
 *
 * @returns {HTMLElement}
 */
const SiteSocials = () => fabricate('div')
  .asFlex('row')
  .withChildren([
    SocialPill({
      icon: 'github.png',
      text: 'GitHub',
      backgroundColor: 'black',
      href: 'https://github.com/C-D-Lewis',
      maxWidth: 80,
    }),
    SocialPill({
      icon: 'twitter.png',
      text: 'Twitter',
      backgroundColor: 'rgb(29, 142, 238)',
      href: 'https://twitter.com/Chris_DL',
      maxWidth: 80,
    }),
    SocialPill({
      icon: 'linkedin.png',
      text: 'LinkedIn',
      backgroundColor: 'rgb(2, 76, 184)',
      href: 'https://www.linkedin.com/in/chris-lewis-030503117',
      maxWidth: 90,
    }),
    SocialPill({
      icon: 'rss.png',
      text: 'RSS',
      backgroundColor: 'rgb(247, 171, 24)',
      href: '/feed/rss.xml',
      maxWidth: 60,
    }),
  ]);
```

As an illustration, the
[task-app](https://github.com/C-D-Lewis/fabricate/tree/main/examples/task-app)
example is shown below in a brief video form:

![](assets/media/2021/09/tasksapp.gif)

## Conclusion

I think those are all the main points - the fact this is used in several webapp
projects already means I'll be sure to identify what is/isn't working, new ideas
for features etc. It's a good fit for the sorts of medium-complexity webapps I
tend to create but it's good to know the mainstream frameworks are available
for those that get more serious.

Watch this space for more features and applications in the future - it's going
to be fun to keep using! If you fancy giving it a try, it can be installed
[via a CDN](https://github.com/c-d-lewis/fabricate#installation) or
[npm](https://www.npmjs.com/package/fabricate.js), and included in a simple
<code>script</code> tag.
