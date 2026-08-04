<script setup lang="ts">
import { useRouteHash } from "@vueuse/router";
import { syncRef } from "@vueuse/core";

const props = defineProps<{
  tabs: { key: string; label: string }[];
}>();

const model = defineModel<string>();

const hash = useRouteHash();

syncRef(hash, model, {
  transform: {
    ltr: (hash) => hash?.slice(1) || props.tabs[0].key,
    rtl: (key) => (key ? `#${key}` : undefined),
  },
});
</script>

<template>
  <nav>
    <ul class="mt-4 flex gap-4 border-b border-zinc-300 dark:border-zinc-700">
      <li
        v-for="tab in tabs"
        :key="tab.key"
        class="p-2 -mb-0.5 border border-b-0 text-lg font-medium hover:underline underline-offset-4 decoration-2 hover:text-primary-600 cursor-pointer"
        :class="
          tab.key == model
            ? 'underline rounded-t-sm p-2 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 overflow-hidden'
            : 'border-transparent'
        "
        @click="model = tab.key"
      >
        {{ tab.label }}
      </li>
    </ul>
  </nav>
</template>
