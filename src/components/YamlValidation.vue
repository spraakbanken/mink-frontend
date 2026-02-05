<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import type { ErrorObject } from "ajv";
import { JSON_SCHEMA, load, YAMLException } from "js-yaml";
import { ref } from "vue";
import { PhCheckCircle, PhWarning } from "@phosphor-icons/vue";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import TextData from "./TextData.vue";
import HelpBox from "./HelpBox.vue";
import useMessenger from "@/message/messenger.composable";

const props = defineProps<{
  /** YAML input to validate */
  code: string;
  /** JSON schema, parsed */
  schema: object;
}>();

const emit = defineEmits<{
  /** Emitted when validation is complete */
  (e: "validated", isValid: boolean): void;
}>();

const { alertError } = useMessenger();

const validator = createValidator();
const parseError = ref<YAMLException>();
const validationErrors = ref<ErrorObject[]>([]);

/** Instantiate Ajv validator for a given JSON schema */
function createValidator() {
  const ajv = new Ajv2020();
  // Add support for string formats (dates etc), see: https://ajv.js.org/packages/ajv-formats.html
  addFormats(ajv);
  return ajv.compile(props.schema);
}

/** Validate current YAML content against our JSON schema */
async function validate() {
  // Reset previous errors.
  parseError.value = undefined;
  validationErrors.value = [];

  // Skip if no content.
  if (!props.code) {
    emit("validated", true);
    return;
  }

  // Load YAML as data and validate it.
  try {
    const data = load(props.code, { schema: JSON_SCHEMA });
    validator(data);
    emit("validated", !validator.errors?.length);

    // Store any validation errors.
    validationErrors.value = validator.errors || [];
  } catch (error) {
    // Yaml parsing itself may crash; handle that separately from validation errors.
    if (error instanceof YAMLException) parseError.value = error;
    else alertError(error);
    emit("validated", false);
  }
}

// Validate while editing.
watchDebounced(() => props.code, validate, { debounce: 200, immediate: true });
</script>

<template>
  <HelpBox
    :important="!!validationErrors.length || !!parseError"
    class="max-w-full"
  >
    <span v-if="!code">{{ $t("schema.validate.empty") }}</span>

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
        <i18n-t v-else scope="global" keypath="schema.validate.error.root">
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
</template>
