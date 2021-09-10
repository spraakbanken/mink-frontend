<template>
  <h1>Korpus: {{ route.params.corpusId }}</h1>
  <router-link to="/">Startsida</router-link>
  <h2>Texter</h2>
  <table>
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
</template>

<script setup>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { getCorpus } from "@/assets/api";
import { computed } from "@vue/reactivity";

const route = useRoute();
const store = useStore();

const sources = computed(() => store.state.sources[route.params.corpusId]);

getCorpus(route.params.corpusId).then((sourcesFetched) =>
  store.commit("setSources", {
    corpusId: route.params.corpusId,
    sources: sourcesFetched,
  })
);
</script>

<style>
</style>
