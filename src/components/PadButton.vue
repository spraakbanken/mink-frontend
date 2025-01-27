<script setup lang="ts">
import { computed, useAttrs } from "vue";
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  to: RouteLocationRaw;
}>();

const attrs = useAttrs();

const clickable = computed(() => !!attrs.onClick);
</script>

<template>
  <router-link
    :to="to"
    class="mink-button w-40 h-40 flex flex-col justify-center items-center text-center hyphens-auto"
    :class="{ 'cursor-pointer': clickable }"
  >
    <slot />
  </router-link>
</template>
