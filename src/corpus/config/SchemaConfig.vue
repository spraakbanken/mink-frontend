<script setup lang="ts">
import { computed } from "vue";
import Yaml from "js-yaml";
import { FormEvent } from "react";
import schema from "@/assets/sparvconfig.schema.json";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useConfig from "@/corpus/config/config.composable";
import JsonSchemaForm from "@/components/JsonSchemaForm.vue";

const corpusId = useCorpusIdParam();
const { config, uploadConfigRaw } = useConfig(corpusId);

const configParsed = computed(() =>
  config.value ? Yaml.load(config.value) : undefined,
);

async function onSubmit(event: FormEvent) {
  const configYaml = Yaml.dump(event.formData);
  await uploadConfigRaw(configYaml);
}
</script>

<template>
  <JsonSchemaForm
    v-if="configParsed"
    :schema="schema"
    :data="configParsed"
    :on-submit="onSubmit"
  />
</template>
