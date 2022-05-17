<template>
  <Section title="corpuses">    
    <PendingContent on="corpora" class="flex flex-wrap -mx-2">
      <router-link
        v-for="(corpus, corpusId) of corpora"
        :key="corpusId"
        :to="`/corpus/${corpusId}`"
        custom
        v-slot="{ navigate }"
      >
        <PadButton @click="navigate" class="hover:bg-gray-50 flex flex-col">
          <strong>{{ corpusId }}</strong>
          <span v-if="corpus.sources && corpus.sources.length > 1">{{ corpus.sources.length }} {{ $t("files") }}</span>
          <span v-else-if="corpus.sources">{{ corpus.sources.length }} {{ $t("file") }}</span>
          <!--<span>{{ useJob(corpusId).jobStatusMessage.value }}</span>-->
          <div v-if="useJob(corpusId).jobStatusMessage.value === 'done'" class="flex">
             Sparv <img src="@/assets/tick-mark.svg" class="h-4 opacity-75 mt-1 ml-2">
          </div>
          <div v-else class="flex">
             Sparv <img src="@/assets/incorrect.svg" class="h-4 opacity-75 mt-1 ml-2">
          </div>
          <div class="flex">
             Korp <img src="@/assets/incorrect.svg" class="h-4 opacity-75 mt-1 ml-2">
          </div>
        </PadButton>
      </router-link>
      <router-link to="/corpus" custom v-slot="{ navigate }">
        <PadButton @click="navigate" class="bg-blue-100 border-blue-200">
          + {{ $t("new") }} {{ $t("corpus") }}
        </PadButton>
      </router-link>
    </PendingContent>
  </Section>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { listCorpora, getCorpus } from "@/assets/api";
import useSpin from "@/assets/spin";
import PadButton from "@/components/layout/PadButton.vue";
import Section from "@/components/layout/Section.vue";
import useJob from "@/composables/job";
import { onMounted, resolveComponent } from "@vue/runtime-core";
import PendingContent from "@/components/PendingContent.vue";

const store = useStore();
const { spin } = useSpin();

const corpora = computed(() => store.state.corpora);

onMounted(() => {
  spin(listCorpora(), "Hämtar korpusar", "corpora").then((corporaFetched) => {
    store.commit("setCorpora", corporaFetched);
    })
});
</script>
