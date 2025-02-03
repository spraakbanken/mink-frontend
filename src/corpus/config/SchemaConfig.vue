<script setup lang="ts">
import { computed } from "vue";
import Yaml from "js-yaml";
import { useI18n } from "vue-i18n";
import { difference, omit } from "es-toolkit";
import {
  formSections,
  getTopProperties,
  loadSchema,
  uiSchema,
} from "./config-schema";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useConfig from "@/corpus/config/config.composable";
import type { SparvConfig } from "@/api/sparvConfig.types";
import RouteButton from "@/components/RouteButton.vue";
import JsonSchemaForm from "@/schema-form/JsonSchemaForm.vue";
import { fromKeys } from "@/util";
import PendingContent from "@/spin/PendingContent.vue";
import HelpBox from "@/components/HelpBox.vue";
import useLocale from "@/i18n/locale.composable";

const props = defineProps<{
  /** A list of properties to include from the schema, the rest are hidden. */
  properties?: string[];
}>();

const corpusId = useCorpusIdParam();
const { config, uploadConfigRaw } = useConfig(corpusId);
const { t } = useI18n();
const { te } = useLocale();

const configParsed = computed(() =>
  config.value ? (Yaml.load(config.value) as SparvConfig) : undefined,
);

const schema = loadSchema(te, t);
const topProperties = getTopProperties(schema);

async function onSubmit(event: { formData: SparvConfig }) {
  const configYaml = Yaml.dump(event.formData);
  await uploadConfigRaw(configYaml);
}

/** A UI Schema that hides all but the active fields. */
const uiSchemaAddon = computed(() => {
  if (!props.properties) return {};
  const inactiveProperties = difference(topProperties, props.properties);
  return fromKeys(inactiveProperties, () => ({ "ui:classNames": "hidden" }));
});
const uiSchemaModified = computed(() => ({
  ...uiSchema,
  ...uiSchemaAddon.value,
}));
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

  <div class="my-6 flex flex-wrap gap-4 items-baseline">
    <h3 class="text-lg uppercase">{{ $t("config.section.select") }}</h3>

    <nav class="flex flex-wrap gap-4 text-lg">
      <RouteButton
        v-for="{ key } in formSections"
        :key
        :to="`/library/corpus/${corpusId}/config/full/${key}`"
      >
        {{ $t(`config.section.${key}`) }}
      </RouteButton>
    </nav>
  </div>

  <PendingContent :on="`corpus/${corpusId}/config`">
    <JsonSchemaForm
      v-if="configParsed"
      :schema
      :data="omit(configParsed, ['sbx_strix'])"
      :on-submit="onSubmit"
      :ui-schema="uiSchemaModified"
    />
  </PendingContent>
</template>
