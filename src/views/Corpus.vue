<template>
  <h1>Korpus: {{ route.params.corpusId }}</h1>
  <router-link to="/">Startsida</router-link>
  <h2>Texter</h2>
  <Sources :corpusId="corpusId" />
  <div><button @click="deleteCorpus">Radera korpus</button></div>
  <h2>Analys</h2>
  <router-link :to="`/corpus/${corpusId}/config`">+ Ny analys</router-link>
  <div v-if="jobStatus">
    <h3>Status</h3>
    <div>{{ jobStatus.message }}</div>
    <pre>{{ jobStatus.sparv_output }}</pre>
  </div>
  <div v-if="exports">
    <h3>Resultat</h3>
    <div v-for="file in exports" :key="file.name">{{ file.name }}</div>
  </div>
  <Spinner v-if="isSpinning" />
</template>

<script setup>
import { onUnmounted } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getJob, getExports, removeCorpus } from "@/assets/api";
import { computed, ref } from "@vue/reactivity";
import useSpin from "@/composables/spin";
import Sources from "@/components/Sources.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();
const { spin, isSpinning, Spinner } = useSpin();

const corpusId = computed(() => route.params.corpusId);
const jobStatus = computed(() => store.state.corpora[corpusId.value].status);
const exports = computed(() => store.state.corpora[corpusId.value].exports);

let loadJobTimer = null;
async function loadJob() {
  spin(getJob(corpusId.value)).then((status) => {
    store.commit("setStatus", { corpusId: corpusId.value, status });
    if (status.job_status != "done")
      // Refresh automatically.
      loadJobTimer = setTimeout(loadJob, 10_000);
  });
  spin(getExports(corpusId.value)).then((exports) =>
    store.commit("setExports", { corpusId: corpusId.value, exports })
  );
}

loadJob();

async function deleteCorpus() {
  await spin(removeCorpus(corpusId.value));
  store.commit("removeCorpus", corpusId.value);
  router.push("/");
}

onUnmounted(() => clearTimeout(loadJobTimer));
</script>

<style>
</style>
