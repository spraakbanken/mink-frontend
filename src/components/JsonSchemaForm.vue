<script setup lang="ts">
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { applyPureReactInVue } from "veaury";
import type { FormEvent } from "react";
import useMessenger from "@/message/messenger.composable";

const VeauryForm = applyPureReactInVue(Form);

defineProps<{
  schema: any;
  data: any;
  onChange?: (event: FormEvent, fieldId: string) => {};
  onSubmit?: (event: FormEvent) => {};
}>();

type Error = {
  message: string;
  property: string;
};

const { alert } = useMessenger();

function onError(errors: Error[]) {
  errors.forEach((error) =>
    alert(`${error.property.split(".").pop()} ${error.message}`, "error"),
  );
}
</script>

<template>
  <!-- eslint-disable -->
  <!-- (needed to keep React-friendly attr casing) -->
  <VeauryForm
    :schema
    :validator="validator"
    :formData="data"
    :onChange
    :onSubmit
    :onError="onError"
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
::v-deep(.has-error) {
  @apply bg-red-50;
}
</style>
