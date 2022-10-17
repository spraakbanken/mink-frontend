<template>
  <section class="border rounded bg-white p-2">
    <div class="flex justify-between mb-2">
      <h2 v-if="title" class="text-xl uppercase">{{ title }}</h2>
      <div class="items-baseline justify-end gap-2 text-sm">
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
