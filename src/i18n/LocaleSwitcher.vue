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
import { watch } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const { locale } = useI18n();
const store = useStore();

// Sync from store to switcher once
locale.value = store.state.locale;

// Sync from switcher to store at-will
watch(locale, () => {
  store.commit("setLocale", locale.value);
});
</script>
