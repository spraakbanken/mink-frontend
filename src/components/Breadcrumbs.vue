<template>
  <!-- <div class="breadcrumbs">
    <span>
      <router-link to="/">Hem</router-link>
    </span>
    <span v-for="(link, i) in links" :key="i">
      <router-link :to="link.route">{{ link.label }}</router-link>
    </span>
  </div> -->
  <div v-if="parent">
    <router-link :to="parent.route">&laquo; {{ parent.label }}</router-link>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps({
  links: Array,
});

const parent = computed(
  () => props.links && props.links.length && props.links[props.links.length - 1]
);
</script>

<style scoped>
.breadcrumbs {
  margin: 1em 0;
}

.breadcrumbs span::after {
  content: " / ";
}
</style>
