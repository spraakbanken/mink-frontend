<script setup lang="ts">
/** Wrap any FormKit forms with this to provide our custom config and sync locale. */
import { watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { changeLocale, FormKitProvider } from "@formkit/vue";
import { formkitConfig } from "@/formkit";

const { locale } = useI18n();

watchEffect(() => changeLocale(locale.value));
</script>

<template>
  <FormKitProvider :config="formkitConfig">
    <slot />
  </FormKitProvider>
</template>
