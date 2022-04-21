<template>
  <Section title="Korpusar">
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
          <span v-if="corpus.sources">{{ corpus.sources.length }} filer</span>
          <span>{{ useJob(corpusId).jobStatusMessage.value }}</span>
        </PadButton>
      </router-link>
      <router-link to="/corpus" custom v-slot="{ navigate }">
        <PadButton @click="navigate" class="bg-blue-100 border-blue-200">
          + Ny korpus
        </PadButton>
      </router-link>
    </PendingContent>
  </Section>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { listCorpora } from "@/assets/api";
import useSpin from "@/assets/spin";
import PadButton from "@/components/layout/PadButton.vue";
import Section from "@/components/layout/Section.vue";
import useJob from "@/composables/job";
import { onMounted } from "@vue/runtime-core";
import PendingContent from "@/components/PendingContent.vue";

const store = useStore();
const { spin } = useSpin();

const corpora = computed(() => store.state.corpora);

onMounted(() => {
  spin(listCorpora(), "Hämtar korpusar", "corpora").then((corporaFetched) =>
    store.commit("setCorpora", corporaFetched)
  );
});
</script>
