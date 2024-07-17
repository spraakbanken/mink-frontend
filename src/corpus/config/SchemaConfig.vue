<script setup lang="ts">
import { computed } from "vue";
import Yaml from "js-yaml";
import type { JSONSchema7 } from "json-schema";
import type { UiSchema } from "@rjsf/utils";
import { useI18n } from "vue-i18n";
import difference from "lodash/difference";
import {
  formSections,
  getTopProperties,
  transformSchema,
} from "./config-schema";
import schemaRaw from "@/assets/sparvconfig.schema.json";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useConfig from "@/corpus/config/config.composable";
import type { SparvConfig } from "@/api/sparvConfig.types";
import RouteButton from "@/components/RouteButton.vue";
import JsonSchemaForm from "@/schema-form/JsonSchemaForm.vue";
import { fromKeys } from "@/util";

const schema = schemaRaw as unknown as JSONSchema7;

const props = defineProps<{
  /** A list of properties to include from the schema, the rest are hidden. */
  properties?: string[];
}>();

const corpusId = useCorpusIdParam();
const { config, uploadConfigRaw } = useConfig(corpusId);
const { t, te } = useI18n();

const configParsed = computed(() =>
  config.value ? (Yaml.load(config.value) as SparvConfig) : undefined,
);

transformSchema(schema, te, t);
const topProperties = getTopProperties(schema);

async function onSubmit(event: { formData: SparvConfig }) {
  const configYaml = Yaml.dump(event.formData);
  await uploadConfigRaw(configYaml);
}

const uiSchema: UiSchema = {
  metadata: {
    id: { "ui:disabled": true },
    description: { additionalProperties: { "ui:widget": "textarea" } },
    short_description: { additionalProperties: { "ui:widget": "textarea" } },
  },
};

/** A UI Schema that hides all but the active fields. */
const uiSchemaAddon = computed(() =>
  fromKeys(difference(topProperties, props.properties || []), () => ({
    "ui:classNames": "hidden",
  })),
);
const uiSchemaModified = computed(() => ({
  ...uiSchema.value,
  ...uiSchemaAddon.value,
}));
</script>

<template>
  <nav class="flex gap-4 text-lg">
    <RouteButton
      v-for="{ key } in formSections"
      :key
      :to="`/library/corpus/${corpusId}/config/full/${key}`"
    >
      {{ $t(`config.section.${key}`) }}
    </RouteButton>
  </nav>

  <JsonSchemaForm
    v-if="configParsed"
    :schema
    :data="configParsed"
    :on-submit="onSubmit"
    :ui-schema="uiSchemaModified"
  />
</template>
