const subscriptions = {};

const subscribe = (eventName, callback) => {
  if (!subscriptions[eventName]) {
    subscriptions[eventName] = [];
  }

  if (subscriptions[eventName].includes(callback)) return;

  subscriptions[eventName].push(callback);
};

const post = (eventName, params) => {
  if (!subscriptions[eventName]) return;

  subscriptions[eventName].forEach(callback => callback(params));
};

window.Events = {
  subscribe,
  post,
};
