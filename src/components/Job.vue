<template>
  <Section v-if="jobStatus">
    <div>{{ jobStatus.message }}</div>
    <pre class="text-sm">{{ jobStatus.sparv_output }}</pre>
  </Section>
  <ActionButton
    v-if="exports && exports.length"
    @click="downloadResult"
    class="mr-2 bg-green-200 border-green-300"
  >
    Ladda ner resultat
  </ActionButton>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { spin } from "@/assets/spin";
import { downloadExports, getExports, getJob } from "@/assets/api";
import Section from "./layout/Section.vue";
import ActionButton from "./layout/ActionButton.vue";
import { onUnmounted } from "@vue/runtime-core";

const store = useStore();

const { corpusId } = defineProps({
  corpusId: String,
});

const jobStatus = computed(() => store.state.corpora[corpusId].status);
const exports = computed(() => store.state.corpora[corpusId].exports);

function downloadResult() {
  spin(downloadExports(corpusId), "Laddar ner analysresultat");
}
</script>

<style></style>
