<script setup lang="ts">
import { computed } from "vue";
import { useAuth } from "@/auth/auth.composable";
import { useResourceStore } from "@/store/resource.store";
import useCorpusIdParam from "./corpusIdParam.composable";
import useCorpus from "./corpus.composable.js";
import useConfig from "./config/config.composable";
import PageTitle from "@/components/PageTitle.vue";

const resourceStore = useResourceStore();
const { requireAuthentication, isAuthenticated } = useAuth();
const corpusId = useCorpusIdParam();
const { loadCorpus } = useCorpus(corpusId);
const { corpusName } = useConfig(corpusId);

const corpus = computed(() => resourceStore.corpora[corpusId]);

requireAuthentication(async () => {
  await loadCorpus();
});
</script>

<template>
  <div v-if="isAuthenticated">
    <template v-if="corpus">
      <PageTitle subtitle="corpus">
        <router-link
          :to="`/corpus/${corpusId}`"
          class="text-inherit hover:underline"
        >
          {{ corpusName || corpusId }}
        </router-link>
      </PageTitle>
      <router-view />
    </template>
  </div>
</template>
