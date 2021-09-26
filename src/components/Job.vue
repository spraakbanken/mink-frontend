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
  <router-link :to="`/corpus/${corpusId}/config`" custom v-slot="{ navigate }">
    <ActionButton @click="navigate" class="bg-blue-100 border-blue-200">
      Ny analys
    </ActionButton>
  </router-link>
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

let loadJobTimer = null;
function loadJob() {
  spin(getJob(corpusId), "Kollar analysstatus").then((status) => {
    store.commit("setStatus", { corpusId, status });
    if (status.job_status != "done")
      // Refresh automatically.
      loadJobTimer = setTimeout(loadJob, 10_000);
  });
  spin(getExports(corpusId), "Listar resultatfiler").then((exports) =>
    store.commit("setExports", { corpusId, exports })
  );
}

loadJob();

onUnmounted(() => clearTimeout(loadJobTimer));

function downloadResult() {
  spin(downloadExports(corpusId), "Laddar ner analysresultat");
}
</script>

<style>
</style>
