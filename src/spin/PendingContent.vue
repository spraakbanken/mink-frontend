<script setup lang="ts">
import SpinIndicator from "@/spin/SpinIndicator.vue";
import useSpin from "@/spin/spin.composable";

defineProps<{
  /** Tokens that may have been used with `spin()`. */
  on: string | string[];
  /**
   * Enable this to block interaction with elements in the slot.
   *
   * Generally, let's allow interaction. Saving a data update twice or
   * following a broken link is probably okay. However, creating or
   * deleting data twice might not be.
   */
  blocking?: boolean;
}>();

const { isPending } = useSpin();
</script>

<template>
  <div class="relative" :class="{ 'animate-pulse2': isPending(on) }">
    <slot />
    <div
      v-if="isPending(on)"
      class="absolute top-0 left-0 right-0 bottom-0 z-30 flex justify-center items-center"
      :class="{ 'pointer-events-none': !blocking }"
    >
      <SpinIndicator />
    </div>
  </div>
</template>
