<template>
  <div class="action-button" :class="{ clickable }">
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
.action-button {
  display: inline-block;
  padding: 0.5rem;
  text-align: left;
  border: thin solid darkgray;
  background: #eee;
  border-radius: 0.5rem;
  /* If we are a link. */
  color: inherit;
  text-decoration: inherit;
}

.clickable {
  cursor: pointer;
}

.create {
  background-color: #bee;
}

.confirm {
  background-color: #beb;
}

.delete {
  background-color: #ebc;
}

.mute {
  border-width: 0;
}
.mute:not(:hover) {
  border-width: 0;
  background-color: transparent;
}

.slim {
  padding: 0 0.2em;
  border-radius: 0.2em;
}
</style>
