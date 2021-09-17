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
  <Spinner v-if="isSpinning" />
</template>

<script setup>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { getCorpus, putSources } from "@/assets/api";
import { computed } from "@vue/reactivity";
import useSpin from "@/composables/spin";

const route = useRoute();
const store = useStore();
const { spin, isSpinning, Spinner } = useSpin();

const sources = computed(() => store.state.sources[route.params.corpusId]);

function loadCorpus() {
  spin(getCorpus(route.params.corpusId)).then((sourcesFetched) =>
    store.commit("setSources", {
      corpusId: route.params.corpusId,
      sources: sourcesFetched,
    })
  );
}

loadCorpus();

async function upload(event) {
  console.log(event.target.files[0]);
  await spin(putSources(route.params.corpusId, event.target.files));
  console.log("awaited");
  loadCorpus();
}
</script>

<style>
</style>
