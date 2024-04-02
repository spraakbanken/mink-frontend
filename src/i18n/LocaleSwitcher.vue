<script setup lang="ts">
import { languageNames, type LocaleId } from "./i18n";
</script>

<template>
  <select v-model="$i18n.locale" class="bg-transparent border-0">
    <option
      v-for="locale in $i18n.availableLocales"
      :key="locale"
      :value="locale"
    >
      {{ languageNames[locale as LocaleId] }}
    </option>
  </select>
</template>
