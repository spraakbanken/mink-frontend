<script setup lang="ts">
import { computed } from "vue";
import Yaml from "js-yaml";
import { useI18n } from "vue-i18n";
import { difference } from "es-toolkit";
import { formSections, getTopProperties, loadSchema } from "./config-schema";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useConfig from "@/corpus/config/config.composable";
import type { SparvConfig } from "@/api/sparvConfig.types";
import JsonSchemaForm from "@/schema-form/JsonSchemaForm.vue";
import { fromKeys } from "@/util";
import PendingContent from "@/spin/PendingContent.vue";
import HelpBox from "@/components/HelpBox.vue";
import useLocale from "@/i18n/locale.composable";

const corpusId = useCorpusIdParam();
const { config, uploadConfigRaw } = useConfig(corpusId);
const { t } = useI18n();
const { te } = useLocale();

const configParsed = computed(() =>
  config.value ? (Yaml.load(config.value) as SparvConfig) : undefined,
);

const schema = loadSchema(te, t);
const properties = formSections.flatMap((section) => section.properties);
const hidden = difference(getTopProperties(schema), properties);
const uiSchema = {
  // Order by section
  "ui:order": [...properties, "*"],
  // Hide unlisted (internal) properties
  ...fromKeys(hidden, () => ({ "ui:widget": "hidden" })),
  // Specific settings
  metadata: {
    id: { "ui:disabled": true },
    description: { additionalProperties: { "ui:widget": "textarea" } },
    short_description: { additionalProperties: { "ui:widget": "textarea" } },
  },
};

async function onSubmit(event: { formData: SparvConfig }) {
  const configYaml = Yaml.dump(event.formData);
  await uploadConfigRaw(configYaml);
}
</script>

<template>
  <HelpBox>
    <i18n-t keypath="config.full.help" scope="global">
      <template #sparv_docs>
        <a
          href="https://spraakbanken.gu.se/sparv/#/user-manual/corpus-configuration"
          target="_blank"
          >Corpus Configuration</a
        >
      </template>
    </i18n-t>
  </HelpBox>

  <PendingContent :on="`corpus/${corpusId}/config`">
    <JsonSchemaForm
      v-if="configParsed"
      :schema
      :data="configParsed"
      :on-submit="onSubmit"
      :ui-schema="uiSchema"
    />
  </PendingContent>
</template>
