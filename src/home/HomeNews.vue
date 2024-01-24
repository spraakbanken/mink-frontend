<script setup lang="ts">
import useLocale from "@/i18n/locale.composable";
import items from "./news.yaml";

const { th } = useLocale();

function getDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
</script>

<template>
  <div v-if="items.length" class="max-w-screen-md mx-auto">
    <article
      v-for="(item, i) in items"
      :key="i"
      class="bg-sky-50 dark:bg-sky-800 shadow shadow-sky-200 dark:shadow-sky-600 text-sky-800 dark:text-sky-200 p-1 px-2 my-2"
    >
      <strong>{{ getDate(item.date) }}: {{ th(item.title) }}</strong>
      <div v-html="th(item.body)"></div>
    </article>
  </div>
</template>
