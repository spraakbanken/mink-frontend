<template>
  <h1>Korpus: {{ route.params.corpusId }}</h1>
  <router-link to="/">Startsida</router-link>
  <h2>Texter</h2>
  <table border>
    <thead>
      <tr>
        <th>Namn</th>
        <th>Typ</th>
        <th>Ändrad</th>
        <th>Funktioner</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="source in sources" :key="source">
        <td>{{ source.name }}</td>
        <td>{{ source.type }}</td>
        <td>{{ source.last_modified }}</td>
        <td>
          <button @click="remove(source)">ta bort</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div>+ <input type="file" @change="upload" /></div>
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
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  getCorpus,
  getJob,
  getExports,
  putSources,
  removeSource,
  removeCorpus,
} from "@/assets/api";
import { computed, ref } from "@vue/reactivity";
import useSpin from "@/composables/spin";

const route = useRoute();
const router = useRouter();
const store = useStore();
const { spin, isSpinning, Spinner } = useSpin();

const corpusId = computed(() => route.params.corpusId);
const sources = computed(() => store.state.sources[corpusId.value]);
const jobStatus = ref(null);
const exports = ref(null);

function loadSources() {
  spin(getCorpus(corpusId.value)).then((sourcesFetched) =>
    store.commit("setSources", {
      corpusId: corpusId.value,
      sources: sourcesFetched,
    })
  );
}

let loadJobTimer = null;
async function loadJob() {
  spin(getJob(corpusId.value)).then((status) => {
    jobStatus.value = status;
    if (status.job_status != "done")
      // Refresh automatically.
      loadJobTimer = setTimeout(loadJob, 10_000);
  });
  spin(getExports(corpusId.value)).then(
    (contents) => (exports.value = contents)
  );
}

loadSources();
loadJob();

async function upload(event) {
  await spin(putSources(corpusId.value, event.target.files));
  loadSources();
}

async function remove(source) {
  await spin(removeSource(corpusId.value, source.name));
  loadSources();
}

async function deleteCorpus() {
  await spin(removeCorpus(corpusId.value));
  store.commit("removeCorpus", corpusId.value);
  router.push("/");
}
</script>

<style>
</style>
