<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  tabs: { key: string; label: string }[];
}>();

defineModel<string>();
</script>

<template>
  <nav>
    <ul class="my-4 flex gap-4">
      <li
        v-for="tab in tabs"
        :key="tab.key"
        class="py-2 text-lg font-medium hover:underline underline-offset-4 decoration-2 hover:text-sborange-600 cursor-pointer"
        :class="{ underline: tab.key == modelValue }"
        @click="$emit('update:modelValue', tab.key)"
      >
        {{ tab.label }}
      </li>
    </ul>
  </nav>
</template>
