<script setup lang="ts">
import { languageNames, type LocaleId } from "./i18n";
</script>

<template>
  <div>
    <icon icon="language" />
    <select
      v-model="$i18n.locale"
      class="bg-transparent border-0 appearance-none"
    >
      <option
        v-for="locale in $i18n.availableLocales"
        :key="locale"
        :value="locale"
      >
        {{ languageNames[locale as LocaleId] }}
      </option>
    </select>
  </div>
</template>

<style scoped>
select.appearance-none {
  padding-right: 1.4em;
  background: url(@/assets/dropdown.svg) no-repeat 95% 50%;
}
</style>
