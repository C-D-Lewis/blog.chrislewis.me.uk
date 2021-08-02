const subscriptions = {};

/**
 * Subscribe to an event.
 *
 * @param {string} eventName - Name of the event, like a topic.
 * @param {function} callback - Callback to be notified.
 * @returns {undefined}
 */
const subscribe = (eventName, callback) => {
  if (!subscriptions[eventName]) {
    subscriptions[eventName] = [];
  }

  if (subscriptions[eventName].includes(callback)) return;

  subscriptions[eventName].push(callback);
};

/**
 * Post an event.
 *
 * @param {string} eventName - Name of the event, like a topic.
 * @param {object} params - Event data.
 * @returns {undefined}
 */
const post = (eventName, params) => {
  if (!subscriptions[eventName]) return;

  subscriptions[eventName].forEach(callback => callback(params));
};

window.Events = {
  subscribe,
  post,
};
