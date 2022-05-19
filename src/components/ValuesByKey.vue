<script setup>
defineProps({
  values: Object,
});
</script>

<template>
  <div class="flex flex-wrap">
    <div v-for="(value, key) in values" :key="key" class="flex-1 mr-1">
      <span class="text-sm bg-gray-200 p-1 mr-1">{{ key }}</span>
      <slot :name="key">{{ value }}</slot>
    </div>
  </div>
</template>
