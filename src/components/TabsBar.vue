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
    ltr: (hash) => hash?.slice(1) || model.value || props.tabs[0].key,
    rtl: (key) => (key ? `#${key}` : undefined),
  },
});
</script>

<template>
  <nav>
    <ul class="flex flex-wrap">
      <li v-for="tab in tabs" :key="tab.key">
        <a
          href="#"
          @click.prevent="model = tab.key"
          class="inline-block p-2 text-lg font-medium no-underline border-primary-600"
          :class="{ 'text-primary-600 border-b-2': model === tab.key }"
        >
          {{ tab.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
