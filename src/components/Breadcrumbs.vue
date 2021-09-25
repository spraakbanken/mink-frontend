<template>
  <div class="breadcrumbs">
    <span>
      <router-link to="/">Hem</router-link>
    </span>
    <span v-for="(link, i) in links" :key="i">
      <router-link :to="link.route">{{ link.label }}</router-link>
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  links: Array,
});
</script>

<style scoped>
.breadcrumbs {
  margin: 1em 0;
}

.breadcrumbs span:not(:last-child):after {
  content: " / ";
}
</style>
