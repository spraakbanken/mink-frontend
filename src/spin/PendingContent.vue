<script setup lang="ts">
import { computed } from "vue";
import SpinIndicator from "./SpinIndicator.vue";
import useSpin from "./spin.composable";

const props = defineProps<{
  /** A token that may have been used with `spin()`. */
  on: string;
  /**
   * Enable this to block interaction with elements in the slot.
   *
   * Generally, let's allow interaction. Saving a data update twice or
   * following a broken link is probably okay. However, creating or
   * deleting data twice might not be.
   */
  blocking?: boolean;
}>();

const { pending } = useSpin();
const isPending = computed(() => pending.value.includes(props.on));
</script>

<template>
  <div class="relative" :class="{ 'animate-pulse2': isPending }">
    <div
      class="absolute top-0 left-0 right-0 bottom-0 z-30 flex justify-center items-center"
      :class="{ hidden: !isPending, 'pointer-events-none': !blocking }"
    >
      <SpinIndicator />
    </div>
    <slot />
  </div>
</template>
