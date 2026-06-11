<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import useLocale from "@/i18n/locale.composable";
import LayoutSection from "@/components/LayoutSection.vue";
import { useNews } from "@/news/useNews";
import type { NewsItem } from "@/news/news.types";
import CardBox from "@/components/CardBox.vue";

const { formatDate, th } = useLocale();
const newsService = useNews();

const items = computedAsync<NewsItem[]>(() => newsService.loadLatestNews(), []);
</script>

<template>
  <LayoutSection v-if="items.length" :title="$t('news')" class="text-center">
    <div
      v-if="items.length"
      class="mt-8 flex flex-wrap justify-center gap-4 text-start"
    >
      <CardBox
        v-for="(item, i) in items"
        :key="i"
        tag="article"
        :title="th(item.title)"
        class="w-sm"
      >
        <template #subtitle>
          <time :datetime="item.created.toString()">
            {{ formatDate(item.created, false) }}
          </time>
        </template>

        <div class="prose" v-html="th(item.body)"></div>
      </CardBox>
    </div>
  </LayoutSection>
</template>
