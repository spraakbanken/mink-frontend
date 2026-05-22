<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import useLocale from "@/i18n/locale.composable";
import { useNews } from "@/news/useNews";
import type { NewsItem } from "@/news/news.types";

const { formatDate, th } = useLocale();
const newsService = useNews();

const items = computedAsync<NewsItem[]>(
  () => newsService.loadFeaturedNews(),
  [],
);
</script>

<template>
  <div v-if="items.length" class="max-w-(--breakpoint-md) mx-auto">
    <article
      v-for="(item, i) in items"
      :key="i"
      class="bg-sky-50 dark:bg-sky-800 shadow-sm shadow-sky-200 dark:shadow-sky-600 text-sky-800 dark:text-sky-200 p-1 px-2 my-2"
    >
      <header class="font-semibold">{{ th(item.title) }}</header>

      <time :datetime="item.created.toString()" class="my-1 text-sm italic">
        {{ formatDate(item.created, false) }}
      </time>

      <div v-html="th(item.body)"></div>
    </article>
  </div>
</template>
