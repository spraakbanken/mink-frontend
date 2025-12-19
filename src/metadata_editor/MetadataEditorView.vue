<script setup lang="ts">
import Yaml from "js-yaml";
import { ref, watch } from "vue";
import {
  PhCheckCircle,
  PhEye,
  PhFileArrowUp,
  PhFloppyDisk,
  PhPencil,
  PhWarning,
} from "@phosphor-icons/vue";
import { useLocalStorage, useToggle, watchDebounced } from "@vueuse/core";
import type { ErrorObject } from "ajv";
import {
  loadTemplateMemoized,
  loadValidatorOnce,
  ResourceType,
} from "./metadataEditor";
import LayoutBox from "@/components/LayoutBox.vue";
import HelpBox from "@/components/HelpBox.vue";
import SyntaxHighlight from "@/components/SyntaxHighlight.vue";
import useMessenger from "@/message/messenger.composable";
import ActionButton from "@/components/ActionButton.vue";
import PageTitle from "@/components/PageTitle.vue";
import { downloadFile, handleFileInput, randomString } from "@/util";
import FileDropArea from "@/components/FileDropArea.vue";

const { alertError } = useMessenger();
const yaml = useLocalStorage<string>("mink-metadata-editor-yaml", "");
const [isEditing, toggleEditing] = useToggle(true);

const fileInput = ref<HTMLInputElement>();
const validationErrors = ref<ErrorObject[]>();
const validatorPromise = loadValidatorOnce().catch(alertError);
const selectedType = ref<ResourceType>();

/** Load file content as raw YAML for editing. */
async function fileHandler(files: File[]): Promise<void> {
  yaml.value = await files[0]!.text();
}

/** Validate current YAML content against our JSON schema */
const validate = async () => {
  // Reset if no content.
  if (!yaml.value) {
    validationErrors.value = undefined;
    return;
  }

  // Load YAML as data and validate it.
  const validator = (await validatorPromise)!;
  const data = Yaml.load(yaml.value, { schema: Yaml.JSON_SCHEMA });
  validator(data);

  // Store any validation errors.
  validationErrors.value = validator.errors || [];
};

/** Trigger download of current YAML content. */
function save() {
  // TODO Let user edit the resource id.
  const name = randomString();
  downloadFile(yaml.value, `metadata_${name}.yaml`);
}

// Validate while editing.
watchDebounced(yaml, validate, { debounce: 200, immediate: true });

// When selecting a template type, load the template.
watch(selectedType, async () => {
  if (selectedType.value) {
    yaml.value = await loadTemplateMemoized(selectedType.value);
    selectedType.value = undefined;
  }
});
</script>

<template>
  <div>
    <PageTitle>{{ $t("metadata_editor") }}</PageTitle>

    <HelpBox class="my-4">
      <i18n-t keypath="metadata_editor.help" scope="global">
        <template #repository>
          <a :href="$t('metadata_editor.help.repository.url')" target="_blank">
            {{ $t("metadata_editor.help.repository.label") }}
          </a>
        </template>
        <template #info>
          <a :href="$t('metadata_editor.help.info.url')" target="_blank">
            {{ $t("metadata_editor.help.info.label") }}
          </a>
        </template>
      </i18n-t>
    </HelpBox>

    <div class="flex flex-wrap gap-4 items-start">
      <LayoutBox class="w-xl grow" :title="$t('edit')">
        <!-- Toolbar -->
        <div class="my-2 flex items-baseline gap-4">
          <!-- Load local file -->
          <FileDropArea @drop="fileHandler">
            <ActionButton
              @click="fileInput?.click()"
              :class="{ 'button-primary': !yaml }"
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

          <!-- Load template -->
          <div>
            <select v-model="selectedType">
              <option :value="undefined" disabled>
                {{ $t("metadata_editor.load_template") }}
              </option>
              <option v-for="type in ResourceType" :key="type">
                {{ type }}
              </option>
            </select>
          </div>

          <div class="flex-grow"></div>

          <!-- Toggle: Edit/View -->
          <ActionButton v-if="isEditing" @click="toggleEditing(false)">
            <PhEye class="inline mb-0.5 mr-1" />
            {{ $t("show") }}
          </ActionButton>
          <ActionButton v-else @click="toggleEditing(true)">
            <PhPencil class="inline mb-0.5 mr-1" />
            {{ $t("edit") }}
          </ActionButton>

          <!-- Save -->
          <ActionButton
            @click="save()"
            :class="{ 'button-primary': yaml && !validationErrors?.length }"
          >
            <PhFloppyDisk class="inline mb-0.5 mr-1" />
            {{ $t("save") }}
          </ActionButton>
        </div>

        <!-- Either a textarea for editing... -->
        <SyntaxHighlight v-show="!isEditing" :code="yaml" language="yaml" />

        <!-- ...or YAML output -->
        <textarea
          v-show="isEditing"
          v-model="yaml"
          class="w-full h-96 font-mono text-xs"
        ></textarea>
      </LayoutBox>

      <LayoutBox class="w-96 grow" :title="$t('schema.validate.validation')">
        <HelpBox v-if="validationErrors && !validationErrors.length">
          <PhCheckCircle class="inline mb-0.5 mr-1" />
          {{ $t("schema.validate.ok") }}
        </HelpBox>
        <!-- A message for each validation error -->
        <HelpBox
          v-for="error in validationErrors"
          :key="error.instancePath + error.keyword"
          important
        >
          <PhWarning class="inline mb-1 mr-1" />
          <i18n-t scope="global" keypath="schema.validate.error">
            <template #path>{{ error.instancePath }}</template>
            <template #message>{{ error.message }}</template>
          </i18n-t>
          <div v-if="error.params">
            <div v-for="(value, key) in error.params" :key="key">
              <strong>{{ key }}:</strong> {{ value }}
            </div>
          </div>
        </HelpBox>
      </LayoutBox>
    </div>
  </div>
</template>
