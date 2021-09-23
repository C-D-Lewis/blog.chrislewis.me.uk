Fabricate.js - A Fluent and Convenient Web Framework
2021-09-23 18:49
JavaScript,Releases
---

Despite using React quite a bit in my professional work, it is rare that one of
my personal projects is large or complex enough to demand such a robust
solution - a lot of the time I want to create a small, modular, component-based
interface to some APIs or data with limited functionality.

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

Over time, and in the initial version of this blow, the component-based nature
of React served as an inspiration to model the page less as a serier of
operations but more as a description of the components that make up each portion
of the UI. This is also known as the declarative style. Therefore creating HTML
elements from JS took on a more modular approach:

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
Things like looping over data shouldn't be quite as verbose.

## Fabricate.js

After a couple of years using functions similar to <code>createDeviceItem</code>
to turn data into <code>HTMLElement</code>s, I decided to try and formalise this
approach I had organically made use of in a few different projects and try and
unify it so that it could serve as a common baseline for all those different
use-cases. It also had to have some of my personal opinions about styles-in-code
too, since that's how I like to keep my components as a complete single unit in
code.

[fabricate.js](https://github.com/c-d-lewis/fabricate.js) builds on this
slightly more declarative approach (although not fully-delcarative, as React's
JSX and shadow DOM reconciliation realize) to provide a set of functions and
helpers to make it fast and relatively easy to create just the kinds of UI
already described, not as another competitor to the major players in the space,
and once again something I can use and say I learned something more about
building libraries in the process.

The features at the time of writing include:

- Free-form creation of HTML elements using a fluent chainable syntax.

- Easily adding click, hover, change handlers.

- Easy management of child elements.

- Convenience methods to use Flexbox, begin an app heirachy, and detect mobile devices.

- Simple global state management and component notification.

- Simple conditional rendering.

- Lots of basic starter components that can be easily extended.

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

// Begin app heirachy
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
