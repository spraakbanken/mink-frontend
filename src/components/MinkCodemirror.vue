<script setup lang="ts">
/** @file Wraps vue-codemirror with our base settings */
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { Codemirror, type Props as VueCodemirrorProps } from "vue-codemirror";
import type { Extension } from "@codemirror/state";
import { foldGutter } from "@codemirror/language";
import { highlightSelectionMatches } from "@codemirror/search";
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  lineNumbers,
} from "@codemirror/view";
import { monokai } from "@fsegurai/codemirror-theme-monokai";
import { useDark } from "@vueuse/core";
import { xml } from "@codemirror/lang-xml";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { indentWrapExtension } from "@/editor/indentWrap";

export type MinkCodemirrorProps = {
  /** Set read-only */
  disabled?: boolean;
  extensions?: MaybeRefOrGetter<Extension[]>;
  /** Language to use for syntax highlighting */
  language?: string;
  /** Disable line wrapping */
  nowrap?: boolean;
};

const code = defineModel<string>({ required: true });

const props = defineProps<VueCodemirrorProps & MinkCodemirrorProps>();

const isDark = useDark();

/** Subset of basicSetup, see https://codemirror.net/docs/ref/#basic-setup */
const extensionsBasic: Extension[] = [
  highlightSpecialChars(),
  highlightActiveLine(),
  highlightActiveLineGutter(),
  highlightSelectionMatches(),
];

/** Reactive list of extensions */
const extensions = computed<Extension[]>(() => {
  const extensionsProp = toValue(props.extensions) || [];
  const out = [...extensionsBasic, ...extensionsProp];

  if (props.language)
    out.push(getSyntaxExtension(), lineNumbers(), foldGutter());

  if (!props.nowrap)
    out.push(props.language ? indentWrapExtension : EditorView.lineWrapping);

  if (isDark.value || !props.language) out.push(monokai);

  return out;
});

function getSyntaxExtension(): Extension {
  if (props.language == "xml") return xml();
  if (props.language == "jsonl") return json();
  if (props.language == "yaml") return yaml();
  return [];
}
</script>

<template>
  <!-- Docs: https://github.com/surmon-china/vue-codemirror -->
  <Codemirror v-model="code" :disabled :extensions="extensions" />
</template>
