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
        class="-mb-0.5 border border-b-0 text-lg font-medium"
        :class="
          tab.key == model
            ? 'rounded-t-sm bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700'
            : 'border-transparent'
        "
      >
        <a
          href="#"
          @click.prevent="model = tab.key"
          class="inline-block p-2 no-underline hover:underline underline-offset-4 decoration-2"
          :class="{ underline: tab.key == model }"
        >
          {{ tab.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
