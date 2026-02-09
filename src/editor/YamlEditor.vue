<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { Codemirror } from "vue-codemirror";
import type { Extension } from "@codemirror/state";
import type { ViewUpdate } from "@codemirror/view";
import { monokai } from "@fsegurai/codemirror-theme-monokai";
import { computedAsync, useDark, useLocalStorage } from "@vueuse/core";
import { PhFileArrowUp } from "@phosphor-icons/vue";
import { diagnosticCount, linter, lintGutter } from "@codemirror/lint";
import { indentWrapExtension } from "./indentWrap";
import ActionButton from "@/components/ActionButton.vue";
import FileDropArea from "@/components/FileDropArea.vue";
import { handleFileInput } from "@/util";

const code = defineModel<string>({ required: true });

const props = defineProps<{
  disabled?: boolean;
  /** Optional JSON schema, parsed. If present, enable continual validation. */
  schema?: object;
}>();

const emit = defineEmits<{
  /** Emitted when user selects a file to open */
  (e: "open", filename: string): void;
  /** Emitted when validation is complete */
  (e: "validated", isValid: boolean): void;
}>();

const isDark = useDark();
const fileInput = useTemplateRef("fileInput");
const isWrapEnabled = useLocalStorage("editor.wrap", false);

/** Validation linter extension with schema support if present, otherwise without it */
const validationExtension = computedAsync(async () => {
  // Lazy-load the Ajv lib
  const yamlValidator = await import("./yamlValidator");
  const YamlValidator = yamlValidator.default;
  const validator = new YamlValidator(props.schema);

  const linterExtension = linter(
    (view) => {
      const text = view.state.doc.toString();
      const errors = validator.validate(text);
      return errors.map((error) => ({ ...error, severity: "error" }));
    },
    { autoPanel: true },
  );
  return [linterExtension, lintGutter()];
});

/** Lazy-loaded YAML language support extension */
const yamlSyntaxExtension = computedAsync(async () => {
  const langYaml = await import("@codemirror/lang-yaml");
  return langYaml.yaml();
});

/** Reactive list of extensions */
const extensions = computed<Extension[]>(() => [
  yamlSyntaxExtension.value || [],
  validationExtension.value || [],
  isDark.value ? monokai : [],
  isWrapEnabled.value ? indentWrapExtension : [],
]);

/** Load file content as raw YAML for editing. */
async function fileHandler(files: File[]): Promise<void> {
  const file = files[0]!;
  code.value = await file.text();
  emit("open", file.name);
}

/** Update handler for CodeMirror */
function onUpdate(viewUpdate: ViewUpdate) {
  const valid = diagnosticCount(viewUpdate.state) === 0;
  emit("validated", valid);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-wrap gap-4 items-baseline">
      <!-- Load local file -->
      <FileDropArea @drop="fileHandler" :disabled>
        <ActionButton
          :disabled
          @click="fileInput?.click()"
          :class="{ 'button-primary': !code }"
        >
          <PhFileArrowUp class="inline mb-1 mr-1" />
          {{ $t("editor.load_file") }}
        </ActionButton>
        <input
          accept=".yaml,.yml"
          type="file"
          ref="fileInput"
          class="hidden"
          @change="handleFileInput($event, fileHandler)"
        />
      </FileDropArea>

      <!-- Custom buttons -->
      <slot name="toolbar-left" />

      <!-- Spacer -->
      <div class="flex-grow" />

      <!-- Custom buttons -->
      <slot name="toolbar-right" />
    </div>

    <div class="flex flex-wrap gap-4 items-baseline">
      <label>
        <input type="checkbox" v-model="isWrapEnabled" class="mr-1" />
        {{ $t("editor.wrap") }}
      </label>
    </div>

    <div>
      <!-- Docs: https://github.com/surmon-china/vue-codemirror -->
      <Codemirror
        v-model="code"
        :disabled
        :extensions
        indent-with-tab
        :tab-size="2"
        @update="onUpdate"
      />
    </div>
  </div>
</template>
