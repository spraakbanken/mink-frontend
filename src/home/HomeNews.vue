<script setup lang="ts">
import { onMounted, reactive } from "vue";
import useLocale from "@/i18n/locale.composable";
import { fetchFeaturedNews, type NewsItem } from "@/home/news.service";

const { locale, th } = useLocale();
const items = reactive<NewsItem[]>([]);

onMounted(async () => {
  try {
    items.push(...(await fetchFeaturedNews()));
  } catch (error) {
    console.error("Could not fetch and parse news", error);
  }
});

function getDate(date: Date) {
  return date.toLocaleDateString(locale.value, { dateStyle: "short" });
}
</script>

<template>
  <div v-if="items.length" class="max-w-screen-md mx-auto">
    <article
      v-for="(item, i) in items"
      :key="i"
      class="bg-sky-50 dark:bg-sky-800 shadow shadow-sky-200 dark:shadow-sky-600 text-sky-800 dark:text-sky-200 p-1 px-2 my-2"
    >
      <header class="font-bold">{{ th(item.title) }}</header>

      <time :datetime="item.created.toString()" class="my-1 text-sm italic">
        {{ getDate(item.created) }}
      </time>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="th(item.body)"></div>
    </article>
  </div>
</template>
