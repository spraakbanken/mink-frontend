<template>
  <div class="pad-button" :class="{ clickable }">
    <slot />
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useAttrs } from "@vue/runtime-core";

const attrs = useAttrs();

const clickable = computed(() => !!attrs.onClick);
</script>

<style scoped>
.pad-button {
  margin: 0.5rem;
  width: 10rem;
  height: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  border: thin solid darkgray;
  background: #eee;
  border-radius: 1rem;
  /* If we are a link. */
  color: inherit;
  text-decoration: inherit;
}

.clickable {
  cursor: pointer;
}
</style>
