<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import useLocale from "@/i18n/locale.composable";
import LayoutSection from "@/components/LayoutSection.vue";
import { useNews } from "@/news/useNews";
import type { NewsItem } from "@/news/news.types";

const { formatDate, th } = useLocale();
const newsService = useNews();

const items = computedAsync<NewsItem[]>(() => newsService.loadLatestNews(), []);
</script>

<template>
  <LayoutSection v-if="items.length" :title="$t('news')" class="text-center">
    <div
      v-if="items.length"
      class="flex flex-wrap justify-center gap-4 text-sm text-start"
    >
      <article
        v-for="(item, i) in items"
        :key="i"
        class="w-96 bg-white dark:bg-zinc-800 shadow-sm p-2 px-3 my-2"
      >
        <header class="mb-2">
          <h3 class="font-semibold">{{ th(item.title) }}</h3>
          <time
            :datetime="item.created.toString()"
            class="block text-sm italic"
          >
            {{ formatDate(item.created, false) }}
          </time>
        </header>

        <div class="prose" v-html="th(item.body)"></div>
      </article>
    </div>
  </LayoutSection>
</template>
