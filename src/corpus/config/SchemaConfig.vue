<script setup lang="ts">
import { computed } from "vue";
import Yaml from "js-yaml";
import type { JSONSchema7 } from "json-schema";
import { useTransformSchema } from "./schema-transform";
import schema from "@/assets/sparvconfig.schema.json";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useConfig from "@/corpus/config/config.composable";
import JsonSchemaForm from "@/schema-form/JsonSchemaForm.vue";
import type { SparvConfig } from "@/api/sparvConfig.types";

const corpusId = useCorpusIdParam();
const { config, uploadConfigRaw } = useConfig(corpusId);
const { transformSchema } = useTransformSchema();

const configParsed = computed(() =>
  config.value ? (Yaml.load(config.value) as SparvConfig) : undefined,
);

transformSchema(schema as unknown as JSONSchema7);

async function onSubmit(event: { formData: SparvConfig }) {
  const configYaml = Yaml.dump(event.formData);
  await uploadConfigRaw(configYaml);
}
</script>

<template>
  <JsonSchemaForm
    v-if="configParsed"
    :schema="schema as unknown as JSONSchema7"
    :data="configParsed"
    :on-submit="onSubmit"
  />
</template>
