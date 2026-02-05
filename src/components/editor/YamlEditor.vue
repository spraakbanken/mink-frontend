<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { Codemirror } from "vue-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import type { Extension } from "@codemirror/state";
import { monokai } from "@fsegurai/codemirror-theme-monokai";
import { useDark, useLocalStorage } from "@vueuse/core";
import { PhFileArrowUp } from "@phosphor-icons/vue";
import ActionButton from "../ActionButton.vue";
import FileDropArea from "../FileDropArea.vue";
import YamlValidation from "./YamlValidation.vue";
import { indentWrapExtensions } from "./codemirrorIndentWrap";
import { handleFileInput } from "@/util";

const code = defineModel<string>({ required: true });

defineProps<{
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

/** Extensions that are always used, created only once */
const baseExtensions: Extension[] = [yaml()];
/** Add extensions that vary */
const extensions = computed(() => {
  const result = [...baseExtensions];
  if (isDark.value) result.push(monokai);
  if (isWrapEnabled.value) result.push(...indentWrapExtensions);
  return result;
});

/** Load file content as raw YAML for editing. */
async function fileHandler(files: File[]): Promise<void> {
  const file = files[0]!;
  code.value = await file.text();
  emit("open", file.name);
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

      <slot name="toolbar-right" />
    </div>

    <div class="flex flex-wrap gap-4 items-baseline">
      <label>
        <input type="checkbox" v-model="isWrapEnabled" class="mr-1" />
        {{ $t("editor.wrap") }}
      </label>
    </div>

    <YamlValidation
      v-if="schema"
      :code
      :schema
      class="my-0!"
      @validated="$emit('validated', $event)"
    />

    <div>
      <Codemirror
        v-model="code"
        :disabled
        :extensions
        indent-with-tab
        :tab-size="2"
      />
    </div>
  </div>
</template>
