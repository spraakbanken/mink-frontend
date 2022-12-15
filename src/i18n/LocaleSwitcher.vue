<template>
  <select v-model="$i18n.locale" class="bg-transparent border-0">
    <option
      v-for="locale in $i18n.availableLocales"
      :key="locale"
      :value="locale"
    >
      {{ $t(locale) }}
    </option>
  </select>
</template>

<script setup>
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStorage } from "@vueuse/core";

const { locale } = useI18n();
const storedLocale = useStorage("locale", locale.value);

// Sync from storage to switcher once
locale.value = storedLocale.value;

// Sync from switcher to store continually
watch(locale, () => (storedLocale.value = locale.value));
</script>
