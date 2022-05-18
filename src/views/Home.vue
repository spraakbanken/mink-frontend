<template>
  <Section :title="$t('corpuses')">
    <PendingContent on="corpora" class="flex flex-wrap -mx-2">
      <router-link
        v-for="(corpus, corpusId) of corpora"
        :key="corpusId"
        v-slot="{ navigate }"
        :to="`/corpus/${corpusId}`"
        custom
      >
        <PadButton class="hover:bg-gray-50 flex flex-col" @click="navigate">
          <strong>{{ corpusId }}</strong>
          <span v-if="corpus.sources">
            {{ $t("files", corpus.sources.length) }}
          </span>
          <div
            v-if="useJob(corpusId).jobStatusMessage.value === 'done'"
            class="flex"
          >
            Sparv
            <img
              src="@/assets/tick-mark.svg"
              class="h-4 opacity-75 mt-1 ml-2"
            />
          </div>
          <div v-else class="flex">
            Sparv
            <img
              src="@/assets/incorrect.svg"
              class="h-4 opacity-75 mt-1 ml-2"
            />
          </div>
          <div class="flex">
            Korp
            <img
              src="@/assets/incorrect.svg"
              class="h-4 opacity-75 mt-1 ml-2"
            />
          </div>
        </PadButton>
      </router-link>
      <router-link v-slot="{ navigate }" to="/corpus" custom>
        <PadButton class="bg-blue-100 border-blue-200" @click="navigate">
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
  });
});
</script>
