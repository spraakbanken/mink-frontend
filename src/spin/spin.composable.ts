import { computed, ref } from "vue";
import uniq from "lodash/uniq";

const unsettled = ref<SpinItem[]>([]);

type SpinItem<T = any> = {
  promise: Promise<T>;
  token?: string;
};

export default function useSpin() {
  /**
   * Track a pending promise with a message.
   *
   * @param {Promise} promise A promise which may take a while.
   * @param {string} token A string identifying this request; use the same token with the PendingContent component around any content that may be affected by the promise.
   * @returns The same Promise (with an additional `finally`).
   */
  function spin<T>(promise: Promise<T>, token: string): Promise<T> {
    // Add to watchlist.
    unsettled.value.push({
      promise,
      token,
    });
    return promise.finally(() => {
      // Whenever done, remove from watchlist.
      const index = unsettled.value.findIndex(
        (item) => item.promise === promise,
      );
      unsettled.value.splice(index, 1);
    });
  }

  /**
   * Reactive list of pending tokens.
   */
  const pending = computed<string[]>(() =>
    uniq(
      unsettled.value.filter((item) => item.token).map((item) => item.token!),
    ),
  );

  return {
    spin,
    pending,
  };
}
