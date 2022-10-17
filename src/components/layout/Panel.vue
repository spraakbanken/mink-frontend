<template>
  <section>
    <div class="flex">
      <h2 v-if="title" class="text-xl uppercase">{{ title }}</h2>
      <div>
        <slot name="controls" />
      </div>
    </div>
    <slot />
  </section>
</template>

<script setup>
const props = defineProps({
  title: String,
});
</script>

<style></style>
