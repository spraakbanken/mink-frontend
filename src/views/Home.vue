<template>
  <Section title="Korpusar">
    <div class="flex flex-wrap -mx-2" ref="refCorpusList">
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
          <span>{{ useCheckStatus(corpusId).jobStatusMessage.value }}</span>
        </PadButton>
      </router-link>
      <router-link to="/corpus" custom v-slot="{ navigate }">
        <PadButton @click="navigate" class="bg-blue-100 border-blue-200">
          + Ny korpus
        </PadButton>
      </router-link>
    </div>
  </Section>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { listCorpora } from "@/assets/api";
import { spin } from "@/assets/spin";
import PadButton from "@/components/layout/PadButton.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";
import useCheckStatus from "@/composables/checkStatus";
import { onMounted } from "@vue/runtime-core";

const store = useStore();

const corpora = computed(() => store.state.corpora);
const refCorpusList = ref(null);

onMounted(() => {
  spin(listCorpora(), "Hämtar korpusar", refCorpusList.value).then(
    (corporaFetched) => store.commit("setCorpora", corporaFetched)
  );
});
</script>
