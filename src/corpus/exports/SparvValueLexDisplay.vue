<script lang="ts" setup>
defineProps<{
  value: string;
}>();
</script>

<template>
  <a
    v-if="value"
    :href="`https://spraakbanken.gu.se/karp-red/?mode=saldom&lexicon=saldom&query=and(equals%7Clemgram%7C%22${value}%22)`"
    target="_blank"
    >{{ value }}</a
  >
</template>
