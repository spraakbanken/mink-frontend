/** What class to add to the optionally given `el` element while loading. */
const ACTIVE_CLASS = "animate-pulse"; // https://tailwindcss.com/docs/animation

/**
 * @type {{promise: Promise, ref: VNode?}[]}
 */
const unsettled = [];
/**
 * @type {Array<(string[]|null) => any>}
 */
const listeners = [];

const activeClassRe = new RegExp(`\\s*\\b${ACTIVE_CLASS}\\b`);

/**
 * Track a pending promise with a message.
 *
 * @param {Promise} promise A promise which may take a while.
 * @param {string|null} message Describes the promise briefly to the user. Optional.
 * @param {} ref An element which receives the HTML class "spinning" until the promise is settled.
 * @returns The same Promise (with an additional `finally`).
 */
export function spin(promise, message = null, el = null) {
  // Add to watchlist.
  unsettled.push({ promise, message: message });
  if (el) {
    el.className += ` ${ACTIVE_CLASS}`;
  }
  notify();
  return promise.finally(() => {
    // Whenever done, remove from watchlist.
    const index = unsettled.findIndex((item) => item.promise === promise);
    unsettled.splice(index, 1);
    if (el) {
      el.className = el.className.replace(activeClassRe, "");
    }
    notify();
  });
}

/**
 * Get notified when the list of pending promises changes.
 * @param {(string[]|null) => any} callback A function to call.
 *   It gets the current messages (string[] or null) as arg.
 *   A message may be an empty string.
 */
export const listen = (callback) => void listeners.push(callback);

/**
 * Call listeners with current list of messages.
 */
const notify = () => listeners.forEach((callback) => callback(messages()));

/**
 * List of messages ordered by time added.
 * @returns string[]|null
 */
const messages = () =>
  unsettled.length ? unsettled.map((item) => item.message) : null;
