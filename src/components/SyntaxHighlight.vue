<script setup lang="ts">
import { useDark } from "@vueuse/core";
import { computed } from "vue";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { Codemirror } from "vue-codemirror";
import { monokai } from "@fsegurai/codemirror-theme-monokai";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import { json } from "@codemirror/lang-json";
import TerminalOutput from "./TerminalOutput.vue";

const props = defineProps<{
  code: string;
  language?: string;
}>();

const isDark = useDark();

/** Reactive list of extensions */
const extensions = computed<Extension[]>(() => [
  syntaxExtension.value || [],
  isDark.value ? monokai : [],
  EditorView.lineWrapping,
]);

const syntaxExtension = computed<Extension | undefined>(() => {
  if (props.language == "xml") return xml();
  if (props.language == "jsonl") return json();
  if (props.language == "yaml") return yaml();
  return undefined;
});
</script>

<template>
  <!-- Docs: https://github.com/surmon-china/vue-codemirror -->
  <Codemirror v-if="syntaxExtension" disabled :model-value="code" :extensions />
  <TerminalOutput v-else>{{ code }}</TerminalOutput>
</template>
