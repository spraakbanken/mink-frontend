<script setup lang="ts">
import Yaml, { YAMLException } from "js-yaml";
import { ref, watch } from "vue";
import { PhCheckCircle, PhWarning } from "@phosphor-icons/vue";
import { useSessionStorage, watchDebounced } from "@vueuse/core";
import type { ErrorObject } from "ajv";
import {
  loadTemplateMemoized,
  loadValidatorOnce,
  ResourceType,
} from "./metadataEditor";
import LayoutBox from "@/components/LayoutBox.vue";
import HelpBox from "@/components/HelpBox.vue";
import useMessenger from "@/message/messenger.composable";
import PageTitle from "@/components/PageTitle.vue";
import YamlEditor from "@/components/YamlEditor.vue";

const { alertError } = useMessenger();
/** YAML input stored in the session: separate across tabs, survives reloads */
const yaml = useSessionStorage<string>("mink-metadata-editor-yaml", "");

const parseError = ref<YAMLException>();
const validationErrors = ref<ErrorObject[]>([]);
const validatorPromise = loadValidatorOnce().catch(alertError);
const selectedType = ref<ResourceType>();

/** Validate current YAML content against our JSON schema */
const validate = async () => {
  parseError.value = undefined;
  validationErrors.value = [];

  // Skip if no content.
  if (!yaml.value) return;

  // Load YAML as data and validate it.
  try {
    const validator = (await validatorPromise)!;
    const data = Yaml.load(yaml.value, { schema: Yaml.JSON_SCHEMA });
    validator(data);

    // Store any validation errors.
    validationErrors.value = validator.errors || [];
  } catch (error) {
    // Yaml parsing itself may crash; handle that separately from validation errors.
    if (error instanceof YAMLException) parseError.value = error;
    else alertError(error);
  }
};

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
        <!-- Validation output -->
        <HelpBox
          class="max-w-full"
          :dimportant="!!parseError || !!validationErrors.length"
        >
          <strong>{{ $t("schema.validate.validation") }}: </strong>

          <span v-if="!yaml">{{ $t("schema.validate.empty") }}</span>

          <span v-else-if="!validationErrors.length && !parseError">
            <PhCheckCircle class="inline mb-0.5" />
            {{ $t("schema.validate.ok") }}
          </span>

          <template v-else-if="parseError">
            <span>
              <PhWarning class="inline mb-1 mr-1" />
              <i18n-t scope="global" keypath="schema.validate.error.parse">
                <template #message>
                  <em>{{ parseError.reason }}</em>
                </template>
              </i18n-t>
            </span>
            <TextData
              v-if="parseError.mark"
              class="mt-2"
              :text="parseError.mark.snippet"
            />
          </template>

          <template v-else-if="validationErrors.length">
            <template
              v-for="error in validationErrors"
              :key="error.instancePath + error.keyword"
            >
              <PhWarning class="inline mb-1 mr-1" />
              <i18n-t
                v-if="error.instancePath"
                scope="global"
                keypath="schema.validate.error"
              >
                <template #path>{{ error.instancePath }}</template>
                <template #message>
                  <em>{{ error.message }}</em>
                </template>
              </i18n-t>
              <i18n-t
                v-else
                scope="global"
                keypath="schema.validate.error.root"
              >
                <template #message>
                  <em>{{ error.message }}</em>
                </template>
              </i18n-t>
              <div v-if="error.params">
                <div v-for="(value, key) in error.params" :key="key">
                  <strong>{{ key }}:</strong> {{ value }}
                </div>
              </div>
            </template>
          </template>
        </HelpBox>

        <YamlEditor v-model="yaml">
          <template #toolbar>
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
          </template>
        </YamlEditor>
      </LayoutBox>
    </div>
  </div>
</template>
