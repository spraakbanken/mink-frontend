<script setup lang="ts">
import { ref } from "vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useConfig from "@/corpus/config/config.composable";
import { useResourceStore } from "@/store/resource.store";
import { useAuth } from "@/auth/auth.composable";
import PageTitle from "@/components/PageTitle.vue";
import type { Corpus } from "@/store/resource.types";

const resourceStore = useResourceStore();
const { requireAuthentication, isAuthenticated } = useAuth();
const corpusId = useCorpusIdParam();
const { corpusName } = useConfig(corpusId);

const corpus = ref<Corpus>();

requireAuthentication(async () => {
  corpus.value = await resourceStore.loadCorpus(corpusId);
});
</script>

<template>
  <div v-if="isAuthenticated">
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
  </div>
</template>
