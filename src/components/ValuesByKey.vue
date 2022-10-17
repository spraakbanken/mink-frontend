<script setup>
defineProps({
  values: Object,
});
</script>

<template>
  <div>
    <div v-for="(value, key) in values" :key="key" class="mb-1 last:mb-0">
      <span class="text-sm bg-gray-200 p-1 mr-1">{{ key }}</span>
      <slot :name="key">{{ value }}</slot>
    </div>
  </div>
</template>
