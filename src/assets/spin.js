import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";

/**
 * @type {{promise: Promise, message: string}[]}
 */
const unsettled = ref([]);

export default function useSpin() {
  const store = useStore();

  /**
   * Track a pending promise with a message.
   *
   * @param {Promise} promise A promise which may take a while.
   * @param {string|null} message Describes the promise briefly to the user. Optional.
   * @param {string} token A string identifying this request; use the same token with the PendingContent component around any content that may be affected by the promise.
   * @returns The same Promise (with an additional `finally`).
   */
  function spin(promise, message = null, token = null) {
    // Add to watchlist.
    unsettled.value.push({ promise, message: message });
    if (token) {
      store.commit("setPending", token);
    }
    return promise.finally(() => {
      // Whenever done, remove from watchlist.
      const index = unsettled.value.findIndex(
        (item) => item.promise === promise
      );
      unsettled.value.splice(index, 1);
      if (token) {
        store.commit("clearPending", token);
      }
    });
  }

  /**
   * Reactive list of messages, ordered by time added.
   * @returns ComputedRef<string[]|null>
   */
  const messages = computed(() =>
    unsettled.value.length ? unsettled.value.map((item) => item.message) : null
  );

  return {
    spin,
    messages,
  };
}
