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
        <CorpusButton :id="corpusId" @click="navigate" />
      </router-link>
      <router-link v-slot="{ navigate }" to="/corpus" custom>
        <PadButton variant="primary" @click="navigate">
          + {{ $t("new_corpus") }}
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
import CorpusButton from "@/components/CorpusButton.vue";

const store = useStore();
const { spin } = useSpin();

const corpora = computed(() => store.state.corpora);

onMounted(() => {
  spin(listCorpora(), "Hämtar korpusar", "corpora").then((corporaFetched) => {
    store.commit("setCorpora", corporaFetched);
  });
});
</script>
