<template>
  <div
    class="mink-button m-2 w-40 h-40 flex flex-col justify-center items-center text-center"
    :class="{ [variantClass]: true, 'cursor-pointer': clickable }"
  >
    <slot />
  </div>
</template>

<script setup>
import { useVariant, variantProps } from "@/composables/variant";
import { computed } from "@vue/reactivity";
import { useAttrs } from "@vue/runtime-core";

const props = defineProps({ ...variantProps });

const attrs = useAttrs();
const { variantClass } = useVariant(() => props.variant);

const clickable = computed(() => !!attrs.onClick);
</script>
