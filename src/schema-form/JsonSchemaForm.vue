<script lang="ts">
export type JsonSchemaFormProps<D extends object> = {
  schema: StrictRJSFSchema;
  data?: D;
  uiSchema?: UiSchema;
  onChange?: (event: { formData: D }, fieldId: string) => void;
  onSubmit?: (event: { formData: D }) => void;
};
</script>

<script setup lang="ts" generic="D extends {}">
import { withTheme, type FormProps } from "@rjsf/core";
import { customizeValidator } from "@rjsf/validator-ajv8";
import Ajv2020 from "ajv/dist/2020";
import { applyPureReactInVue, setVeauryOptions } from "veaury";
import { createRoot } from "react-dom/client";
import {
  englishStringTranslator,
  TranslatableString,
  type StrictRJSFSchema,
  type UiSchema,
} from "@rjsf/utils";
import { useI18n } from "vue-i18n";
import type { Component } from "vue";
import { findKey } from "es-toolkit";
import theme from "@/schema-form/theme/form-theme";
import useMessenger from "@/message/messenger.composable";
import useLocale from "@/i18n/locale.composable";

defineProps<JsonSchemaFormProps<D>>();

const { t } = useI18n();
const { te } = useLocale();
const { alert } = useMessenger();

// Construct a RJSF form with custom theme.
// The theme can override widget/field/template implementations.
//  - widget: input element
//  - field: form row, including widget, label etc
//  - template: array/object wrappers, buttons etc
// https://rjsf-team.github.io/react-jsonschema-form/docs/advanced-customization/custom-themes/
const Form = withTheme(theme);

// Wrap React component, see https://github.com/gloriasoft/veaury
setVeauryOptions({ react: { createRoot } });
const VeauryForm: Component<FormProps> = applyPureReactInVue(Form);

const validator = customizeValidator({ AjvClass: Ajv2020 });

const onError: FormProps["onError"] = (errors) => {
  console.log(errors);
  errors.forEach((error) =>
    alert(`${error.property?.split(".").pop()} ${error.message}`, "error"),
  );
};

const translateString: FormProps["translateString"] = (string, params) => {
  const key = findKey(TranslatableString, (s) => s == string);
  return te(`schemaform.${key}`)
    ? t(`schemaform.${key}`)
    : englishStringTranslator(string, params);
};
</script>

<template>
  <!-- eslint-disable -->
  <!-- (needed to keep React-friendly attr casing) -->
  <!-- See https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/form-props -->
  <VeauryForm
    :schema
    :uiSchema
    :validator="validator"
    :formData="data"
    :onChange
    :onSubmit
    :onError
    :experimental_defaultFormStateBehavior="{
      allOf: 'populateDefaults',
    }"
    :translateString
  />
</template>

<style scoped>
@reference "tailwindcss";

::v-deep(pre) {
  @apply whitespace-pre-wrap text-xs;
}
::v-deep(fieldset:not(#root):has(.field)) {
  @apply border dark:border-zinc-600 p-2;
}
::v-deep(* + fieldset) {
  @apply my-4;
}
::v-deep(.field) {
  @apply my-2;
}
::v-deep(label) {
  @apply font-bold;
}
::v-deep(.form-additional .control-label) {
  @apply mr-1;
}
::v-deep(textarea) {
  @apply align-baseline;
}
::v-deep(fieldset:not(#root) legend) {
  @apply text-3xl;
}
::v-deep(fieldset:not(#root) fieldset legend) {
  @apply text-2xl;
}
::v-deep(fieldset:not(#root) fieldset fieldset legend) {
  @apply text-2xl;
}
::v-deep(.unsupported-field) {
  @apply bg-red-50 dark:bg-red-900/30;
}
::v-deep(.has-error) {
  @apply bg-red-50 dark:bg-red-900/30;
}
::v-deep(.row) {
  @apply flex flex-wrap gap-2;
}
::v-deep(.row.array-item-list) {
  @apply flex-col;
}
::v-deep(.col-xs-3),
::v-deep(.col-xs-9) {
  @apply inline-block mr-2;
}
::v-deep(.btn-group) {
  @apply gap-1;
}
::v-deep(input[type="checkbox"], input[type="radio"]) {
  @apply mr-2;
}
</style>
