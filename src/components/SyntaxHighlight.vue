<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { defineAsyncComponent } from "vue";
import TerminalOutput from "./TerminalOutput.vue";

// Import lib dynamically for chunking
const importPromise = import("@/highlight");

const Highlightjs = defineAsyncComponent(() =>
  importPromise.then((m) => m.plugin.component),
);

defineProps<{
  code: string;
  language?: string;
}>();

const availableLanguages = computedAsync(() =>
  importPromise.then((m) => m.languages),
);
</script>

<template>
  <Highlightjs
    v-if="availableLanguages?.includes(language || '')"
    :code
    :language
    :autodetect="false"
    class="text-xs rounded-sm whitespace-pre-wrap wrap-anywhere"
  />
  <TerminalOutput v-else>{{ code }}</TerminalOutput>
</template>

<style>
@reference "@/index.css";

pre code.hljs {
  @apply p-2 bg-stone-800;
}
</style>
