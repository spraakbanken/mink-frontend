<script setup lang="ts">
import { Codemirror } from "vue-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import type { Extension } from "@codemirror/state";
import { monokai } from "@fsegurai/codemirror-theme-monokai";
import { useDark } from "@vueuse/core";
import { computed } from "vue";
import ActionButton from "./ActionButton.vue";

const code = defineModel<string>({ required: true });

const isDark = useDark();

/** Extensions that are always used, created only once */
const baseExtensions: Extension[] = [yaml()];
/** Add extensions that vary */
const extensions = computed(() => {
  const result = [...baseExtensions];
  if (isDark.value) result.push(monokai);
  return result;
});
</script>

<template>
  <div class="flex flex-column gap-2">
    <div class="flex flex-wrap gap-2 items-baseline">
      <ActionButton @click="openFile()">Open</ActionButton>

      <div class="grow"><!-- Spacer --></div>
    </div>
    <Codemirror v-model="code" :extensions indent-with-tab :tab-size="2" />
  </div>
</template>
