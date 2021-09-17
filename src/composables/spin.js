import { computed, ref } from "vue";
import Spinner from "@/components/Spinner.vue";

/**
 * Provides a Spinner component which is visible until tracked promises are settled.
 */
export default function useSpin() {
  const unsettled = ref([]);

  /** Whether any tracked promise is still unsettled. */
  const isSpinning = computed(() => unsettled.value.length > 0);

  /** Track a promise. */
  function spin(promise) {
    unsettled.value.push(promise);
    return promise.finally(() => {
      unsettled.value.splice(unsettled.value.indexOf(promise), 1);
    });
  }

  return {
    isSpinning,
    spin,
    Spinner,
  };
}
