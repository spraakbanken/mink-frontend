<script setup lang="ts">
import { computed } from "vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useCorpus from "@/corpus/corpus.composable";
import useConfig from "@/corpus/config/config.composable";
import { useResourceStore } from "@/store/resource.store";
import PageTitle from "@/components/PageTitle.vue";

const resourceStore = useResourceStore();
const corpusId = useCorpusIdParam();
const { loadCorpus } = useCorpus(corpusId);
const { corpusName } = useConfig(corpusId);

const corpus = computed(() => resourceStore.corpora[corpusId]);

loadCorpus();
</script>

<template>
  <template v-if="corpus">
    <PageTitle subtitle="corpus">
      <router-link
        v-if="$route.path != `/library/corpus/${corpusId}`"
        :to="`/library/corpus/${corpusId}`"
        class="text-inherit no-underline hover:underline"
      >
        {{ corpusName || corpusId }}
      </router-link>
      <template v-else>
        {{ corpusName || corpusId }}
      </template>
    </PageTitle>
    <router-view />
  </template>
</template>
