<script setup lang="ts" generic="D extends any">
import { withTheme } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { applyPureReactInVue } from "veaury";
import theme from "@/schema-form/theme/form-theme";
import useMessenger from "@/message/messenger.composable";

defineProps<{
  schema: any;
  data: D;
  onChange?: (event: { formData: D }, fieldId: string) => {};
  onSubmit?: (event: { formData: D }) => {};
}>();

// Construct a RJSF form with custom theme.
// The theme can override widget/field/template implementations.
//  - widget: input element
//  - field: form row, including widget, label etc
//  - template: array/object wrappers, buttons etc
// https://rjsf-team.github.io/react-jsonschema-form/docs/advanced-customization/custom-themes/
const Form = withTheme(theme);

// Wrap React component, see https://github.com/gloriasoft/veaury
const VeauryForm = applyPureReactInVue(Form);

type FormInvalidError = {
  message: string;
  property: string;
};

const { alert } = useMessenger();

function onError(errors: FormInvalidError[]) {
  errors.forEach((error) =>
    alert(`${error.property.split(".").pop()} ${error.message}`, "error"),
  );
}
</script>

<template>
  <!-- eslint-disable -->
  <!-- (needed to keep React-friendly attr casing) -->
  <!-- See https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/form-props -->
  <VeauryForm
    :schema
    :validator="validator"
    :formData="data"
    :onChange
    :onSubmit
    :onError
    :experimental_defaultFormStateBehavior="{
      allOf: 'populateDefaults',
    }"
  />
</template>

<style scoped>
::v-deep(pre) {
  @apply whitespace-pre-wrap;
}
::v-deep(fieldset:not(#root):has(.field)) {
  @apply border p-2;
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
  @apply bg-red-50;
}
::v-deep(.has-error) {
  @apply bg-red-50;
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
::v-deep(input[type="checkbox"], input[type="radio"]) {
  @apply mr-2;
}
</style>
