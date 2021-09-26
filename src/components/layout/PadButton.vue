<template>
  <div
    class="
      m-2
      w-40
      h-40
      flex flex-column
      justify-center
      items-center
      text-center
      border
      bg-gray-100
      rounded-xl
    "
    :class="{ 'cursor-pointer': clickable }"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useAttrs } from "@vue/runtime-core";

const attrs = useAttrs();

const clickable = computed(() => !!attrs.onClick);
</script>
