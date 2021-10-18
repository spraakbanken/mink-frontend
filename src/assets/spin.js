import { computed, ref } from "@vue/reactivity";

/** What class to add to the optionally given `el` element while loading. */
const ACTIVE_CLASS = "animate-pulse"; // https://tailwindcss.com/docs/animation

/**
 * @type {{promise: Promise, ref: VNode?}[]}
 */
const unsettled = ref([]);

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
  unsettled.value.push({ promise, message: message });
  if (el) {
    el.className += ` ${ACTIVE_CLASS}`;
  }
  return promise.finally(() => {
    // Whenever done, remove from watchlist.
    const index = unsettled.value.findIndex((item) => item.promise === promise);
    unsettled.value.splice(index, 1);
    if (el) {
      el.className = el.className.replace(activeClassRe, "");
    }
  });
}

/**
 * Reactive list of messages, ordered by time added.
 * @returns ComputedRef<string[]|null>
 */
export const messages = computed(() =>
  unsettled.value.length ? unsettled.value.map((item) => item.message) : null
);
