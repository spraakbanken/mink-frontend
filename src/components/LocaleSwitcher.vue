<template>
  <select v-model="$i18n.locale" class="bg-transparent text-gray-600">
    <option v-for="(locale, i) in locales" :key="`locale-${i}`" :value="locale">
      {{ $t(locale) }}
    </option>
  </select>
</template>

<script>
export default {
  name: "LocaleSwitcher",
  data() {
    return { locales: ["sv", "en"] };
  },
};
</script>
