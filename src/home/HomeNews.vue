<script setup lang="ts">
import { onMounted, reactive } from "vue";
import useLocale from "@/i18n/locale.composable";
import { fetchNews, type NewsItem } from "@/home/news.service";
import LayoutSection from "@/components/LayoutSection.vue";

const { locale, th } = useLocale();
const items = reactive<NewsItem[]>([]);

onMounted(async () => {
  try {
    const items_ = await fetchNews(false);
    items.push(...items_.filter((item) => !item.tags?.includes("featured")));
  } catch (error) {
    console.error("Could not fetch and parse news", error);
  }
});

function getDate(date: Date) {
  return date.toLocaleDateString(locale.value, { dateStyle: "long" });
}
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
        class="w-96 bg-white dark:bg-zinc-800 shadow p-2 px-3 my-2"
      >
        <header class="mb-2">
          <h3 class="font-semibold">{{ th(item.title) }}</h3>
          <time
            :datetime="item.created.toString()"
            class="block text-sm italic"
          >
            {{ getDate(item.created) }}
          </time>
        </header>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="prose" v-html="th(item.body)"></div>
      </article>
    </div>
  </LayoutSection>
</template>
