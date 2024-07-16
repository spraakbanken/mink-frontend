<script setup lang="ts">
import { computed } from "vue";
import Yaml from "js-yaml";
import type { JSONSchema7 } from "json-schema";
import type { UiSchema } from "@rjsf/utils";
import { useI18n } from "vue-i18n";
import { useTransformSchema } from "./schema-transform";
import schema from "@/assets/sparvconfig.schema.json";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useConfig from "@/corpus/config/config.composable";
import JsonSchemaFormSplit from "@/schema-form/JsonSchemaFormSplit.vue";
import type { SparvConfig } from "@/api/sparvConfig.types";

const corpusId = useCorpusIdParam();
const { config, uploadConfigRaw } = useConfig(corpusId);
const { transformSchema } = useTransformSchema();
const { t } = useI18n();

const configParsed = computed(() =>
  config.value ? (Yaml.load(config.value) as SparvConfig) : undefined,
);

transformSchema(schema as unknown as JSONSchema7);

async function onSubmit(event: { formData: SparvConfig }) {
  const configYaml = Yaml.dump(event.formData);
  await uploadConfigRaw(configYaml);
}

const splits = {
  metadata: {
    title: t("metadata"),
    fields: ["metadata"],
  },
  sparv: {
    title: t("sparv"),
    fields: ["sparv", "threads", "parent", "install", "uninstall", "preload"],
  },
  annotations: {
    title: t("annotations"),
    fields: [
      "classes",
      "custom_annotations",
      "dateformat",
      "geo",
      "hist",
      "hunpos",
      "misc",
      "segment",
      "stanza",
      "sbx_freeling",
    ],
  },
  import: {
    title: t("import"),
    fields: [
      "import",
      "xml_import",
      "docx_import",
      "odt_import",
      "pdf_import",
      "text_import",
      "xml_import",
    ],
  },
  export: {
    title: t("export"),
    fields: [
      "export",
      "conll_export",
      "csv_export",
      "cwb",
      "korp",
      "passthrough",
      "stats_export",
      "xml_export",
    ],
  },
};

const uiSchema: UiSchema = {
  metadata: {
    id: {
      "ui:disabled": true,
    },
    description: {
      additionalProperties: {
        "ui:widget": "textarea",
      },
    },
    short_description: {
      additionalProperties: {
        "ui:widget": "textarea",
      },
    },
  },
};
</script>

<template>
  <JsonSchemaFormSplit
    v-if="configParsed"
    :splits
    :schema="schema as unknown as JSONSchema7"
    :data="configParsed"
    :on-submit="onSubmit"
    :ui-schema="uiSchema"
  />
</template>
