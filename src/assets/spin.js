/**
 * @type {Promise[]}
 */
const unsettled = [];
/**
 * @type {Array<(string[]|null) => any>}
 */
const listeners = [];

/**
 * Track a pending promise with a message.
 *
 * @param {Promise} promise A promise which may take a while.
 * @param {string|null} message Describes the promise briefly to the user.
 * @returns The same Promise (with an additional `finally`).
 */
export function spin(promise, message = null) {
  unsettled.push({ promise, message });
  notify();
  return promise.finally(() => {
    const index = unsettled.findIndex((item) => item.promise === promise);
    unsettled.splice(index, 1);
    notify();
  });
}

/**
 * Get notified when the list of pending promises changes.
 * @param {(string[]|null) => any} callback A function to call.
 *   It gets the current messages (string[] or null) as arg.
 */
export function listen(callback) {
  listeners.push(callback);
}

/**
 * Call listeners.
 */
function notify() {
  listeners.forEach((callback) =>
    callback(unsettled.length ? unsettled.map((item) => item.message) : null)
  );
}
