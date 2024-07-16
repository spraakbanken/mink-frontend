<script lang="ts">
type Split = {
  title: string;
  order?: number;
  fields: string[];
};

type Splits<K extends string> = Record<K, Split>;
</script>

<script setup lang="ts" generic="K extends string, D extends {} = any">
import { computed, ref, watchEffect } from "vue";
import type { UiSchema } from "@rjsf/utils";
import JsonSchemaForm, { type JsonSchemaFormProps } from "./JsonSchemaForm.vue";
import ActionButton from "@/components/ActionButton.vue";

const props = defineProps<
  {
    splits: Splits<K>;
  } & JsonSchemaFormProps<D>
>();

const active = ref<K>();
watchEffect(() => (active.value = (Object.keys(props.splits) as K[]).shift()));

const splitsOrdered = computed(() =>
  (Object.keys(props.splits) as K[])
    .map((key) => ({ ...props.splits[key], key }))
    .sort((a, b) => (a.order || 0) - (b.order || 0)),
);
const inactiveFields = computed(() =>
  splitsOrdered.value
    .filter((split) => split.key != active.value)
    .flatMap((split) => split.fields),
);
const uiSchemaModified = computed(() => ({
  ...props.uiSchema,
  ...inactiveFields.value.reduce(
    (obj, name) => ({ ...obj, [name]: { "ui:classNames": "hidden" } }),
    {} as UiSchema,
  ),
}));
</script>

<template>
  <nav class="flex gap-4 text-lg">
    <ActionButton
      v-for="split in splitsOrdered"
      :key="split.key"
      :disabled="active == split.key"
      @click="active = split.key"
    >
      {{ split.title }}
    </ActionButton>
  </nav>
  <JsonSchemaForm
    :schema
    :data
    :ui-schema="uiSchemaModified"
    :on-change
    :on-submit
  />
</template>
