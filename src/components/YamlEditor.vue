<script setup lang="ts">
import { Codemirror } from "vue-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import type { Extension } from "@codemirror/state";
import { monokai } from "@fsegurai/codemirror-theme-monokai";
import { useDark } from "@vueuse/core";
import { computed, useTemplateRef } from "vue";
import { PhFileArrowUp, PhFloppyDisk } from "@phosphor-icons/vue";
import ActionButton from "./ActionButton.vue";
import FileDropArea from "./FileDropArea.vue";
import YamlValidation from "./YamlValidation.vue";
import HelpBox from "./HelpBox.vue";
import { downloadFile, handleFileInput, randomString } from "@/util";

const code = defineModel<string>({ required: true });

defineProps<{
  /** Optional JSON schema, parsed. If present, enable continual validation. */
  schema?: object;
}>();

const isDark = useDark();

const fileInput = useTemplateRef("fileInput");

/** Extensions that are always used, created only once */
const baseExtensions: Extension[] = [yaml()];
/** Add extensions that vary */
const extensions = computed(() => {
  const result = [...baseExtensions];
  if (isDark.value) result.push(monokai);
  return result;
});

/** Load file content as raw YAML for editing. */
async function fileHandler(files: File[]): Promise<void> {
  code.value = await files[0]!.text();
}

/** Trigger download of current YAML content. */
function save() {
  // TODO Let user edit the resource id.
  const name = randomString();
  downloadFile(code.value, `metadata_${name}.yaml`);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-wrap gap-4 items-baseline">
      <!-- Load local file -->
      <FileDropArea @drop="fileHandler">
        <ActionButton
          @click="fileInput?.click()"
          :class="{ 'button-primary': !code }"
        >
          <PhFileArrowUp class="inline mb-1 mr-1" />
          {{ $t("metadata_editor.load_file") }}
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
      <slot name="toolbar" />

      <!-- Spacer -->
      <div class="flex-grow" />

      <!-- Save -->
      <!-- TODO Only primary if validation OK -->
      <ActionButton @click="save()" :class="{ 'button-primary': code }">
        <PhFloppyDisk class="inline mb-0.5 mr-1" />
        {{ $t("save") }}
      </ActionButton>
    </div>

    <YamlValidation v-if="schema" :code :schema class="my-0!" />

    <div>
      <!-- TODO Optional line wrapping -->
      <Codemirror v-model="code" :extensions indent-with-tab :tab-size="2" />
    </div>
  </div>
</template>
