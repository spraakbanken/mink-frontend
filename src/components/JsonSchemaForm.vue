<script setup lang="ts">
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { applyPureReactInVue } from "veaury";

const VeauryForm = applyPureReactInVue(Form);

defineProps<{
  schema: any;
  data: any;
  onChange?: () => {};
  onSubmit?: () => {};
  onError?: () => {};
}>();
</script>

<template>
  <VeauryForm
    :schema
    :validator="validator"
    :form-data="data"
    :on-change
    :on-submit
    :on-error
    :experimental_defaultFormStateBehavior="{
      allOf: 'populateDefaults',
    }"
  />
</template>

<style scoped>
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
</style>
