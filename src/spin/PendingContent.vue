<script setup>
import { computed } from "vue";
import Spinner from "./Spinner.vue";
import useSpin from "./spin.composable";

const props = defineProps({
  on: {
    type: String,
    required: true,
  },
});
const { pending } = useSpin();
const isPending = computed(() => pending.value.includes(props.on));
</script>

<template>
  <div class="relative" :class="{ 'animate-pulse2': isPending }">
    <div
      class="absolute top-0 left-0 right-0 bottom-0 z-30 flex justify-center items-center"
      :class="{ hidden: !isPending }"
    >
      <Spinner />
    </div>
    <slot />
  </div>
</template>
