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
      </tr>
    </thead>
    <tbody></tbody>
    <tr v-for="source in sources" :key="source">
      <td>{{ source.name }}</td>
      <td>{{ source.type }}</td>
      <td>{{ source.last_modified }}</td>
    </tr>
  </table>
  <div>+ <input type="file" @change="upload" /></div>
  <h2>Analys</h2>
  <button @click="createJob">+ Ny analys</button>
  <Spinner v-if="isSpinning" />
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getCorpus, putSources } from "@/assets/api";
import { computed } from "@vue/reactivity";
import useSpin from "@/composables/spin";

const route = useRoute();
const router = useRouter();
const store = useStore();
const { spin, isSpinning, Spinner } = useSpin();

const corpusId = computed(() => route.params.corpusId);
const sources = computed(() => store.state.sources[corpusId.value]);

function loadCorpus() {
  spin(getCorpus(corpusId.value)).then((sourcesFetched) =>
    store.commit("setSources", {
      corpusId: corpusId.value,
      sources: sourcesFetched,
    })
  );
}

loadCorpus();

async function upload(event) {
  console.log(event.target.files[0]);
  await spin(putSources(corpusId.value, event.target.files));
  console.log("awaited");
  loadCorpus();
}

async function createJob() {
  router.push(`/corpus/${corpusId.value}/config`);
}
</script>

<style>
</style>
