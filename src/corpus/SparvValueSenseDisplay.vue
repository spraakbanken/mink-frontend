<script lang="ts" setup>
const props = defineProps<{
  value: string;
}>();

const [, main, num] = props.value.match(/^([^.]+)\.\.([0-9]+)$/) || [];
</script>

<template>
  <a
    v-if="main"
    :href="`https://spraakbanken.gu.se/karp-red/?mode=saldom&lexicon=saldo&query=and(equals%7CsenseID%7C%22${value}%22)`"
    target="_blank"
    >{{ main }}<sup v-if="num != '1'">{{ num }}</sup></a
  >
</template>
