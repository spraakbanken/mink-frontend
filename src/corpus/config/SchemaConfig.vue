<script setup lang="ts">
import { computed } from "vue";
import Yaml from "js-yaml";
import type { JSONSchema7 } from "json-schema";
import type { UiSchema } from "@rjsf/utils";
import { schemaWalk } from "@cloudflare/json-schema-walker";
import { getPropertyPath, useTransformSchema } from "./schema-transform";
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
const { transformSchema } = useTransformSchema();

const configParsed = computed(() =>
  config.value ? (Yaml.load(config.value) as SparvConfig) : undefined,
);

transformSchema(schema);

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

const topProperties = computed(() => {
  const names = new Set<string>();
  schemaWalk(schema, (node, path, parent, parentPath) =>
    names.add(getPropertyPath([...parentPath, ...path])[0]),
  );
  return [...names];
});
const hiddenProperties = computed(() =>
  props.properties?.length
    ? topProperties.value.filter((name) => !props.properties?.includes(name))
    : [],
);
/** A UI Schema that hides all but the active fields. */
const uiSchemaAddon = computed(() =>
  fromKeys(hiddenProperties.value, () => ({ "ui:classNames": "hidden" })),
);
const uiSchemaModified = computed(() => ({
  ...uiSchema.value,
  ...uiSchemaAddon.value,
}));
</script>

<template>
  <nav class="flex gap-4 text-lg">
    <RouteButton :to="`/library/corpus/${corpusId}/config/full/metadata`">
      {{ $t("metadata") }}
    </RouteButton>
    <RouteButton :to="`/library/corpus/${corpusId}/config/full/sparv`">
      {{ $t("sparv") }}
    </RouteButton>
    <RouteButton :to="`/library/corpus/${corpusId}/config/full/annotations`">
      {{ $t("annotations") }}
    </RouteButton>
    <RouteButton :to="`/library/corpus/${corpusId}/config/full/import`">
      {{ $t("import") }}
    </RouteButton>
    <RouteButton :to="`/library/corpus/${corpusId}/config/full/export`">
      {{ $t("export") }}
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
