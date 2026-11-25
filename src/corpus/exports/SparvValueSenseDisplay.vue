<script lang="ts" setup>
defineProps<{
  value: string;
}>();
</script>

<template>
  <a
    v-if="value"
    :href="`https://spraakbanken.gu.se/karp-red/?mode=saldom&lexicon=saldo&query=and(equals%7CsenseID%7C%22${value}%22)`"
    target="_blank"
    >{{ value }}</a
  >
</template>
