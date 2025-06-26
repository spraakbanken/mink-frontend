<script setup lang="ts">
import { PhGlobe } from "@phosphor-icons/vue";
import { languageNames, type LocaleId } from "./i18n";
</script>

<template>
  <div class="text-nowrap">
    <PhGlobe class="inline mb-0.5 mr-1" />
    <select
      id="locale-select"
      :aria-label="$t('locale.switcher.label')"
      v-model="$i18n.locale"
      class="bg-transparent border-0 appearance-none p-0"
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
  padding-right: 0.75em;
  background: url(@/assets/dropdown.svg) no-repeat 100% 50%;
}

@media (prefers-color-scheme: dark) {
  select.appearance-none {
    background-image: url(@/assets/dropdown-light.svg);
  }
}
</style>
