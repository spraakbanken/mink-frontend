<script setup lang="ts">
defineProps<{
  tabs: { key: string; label: string }[];
}>();

defineModel<string>();
</script>

<template>
  <nav>
    <ul class="mt-4 flex gap-4">
      <li
        v-for="tab in tabs"
        :key="tab.key"
        class="p-2 border border-b-0 text-lg font-medium hover:underline underline-offset-4 decoration-2 hover:text-sborange-600 cursor-pointer"
        :class="
          tab.key == modelValue
            ? 'underline rounded-t-sm p-2 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-700 overflow-hidden'
            : 'border-transparent'
        "
        @click="$emit('update:modelValue', tab.key)"
      >
        {{ tab.label }}
      </li>
    </ul>
  </nav>
</template>
