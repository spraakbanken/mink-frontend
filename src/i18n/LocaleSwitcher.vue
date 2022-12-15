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
