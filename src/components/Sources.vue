<template>
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
  <Spinner v-if="isSpinning" />
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import useSpin from "@/composables/spin";
import { getCorpus, putSources, removeSource } from "@/assets/api";

const store = useStore();
const { spin, isSpinning, Spinner } = useSpin();

const { corpusId } = defineProps({
  corpusId: String,
});

const sources = computed(() => store.state.corpora[corpusId].sources || []);

function loadSources() {
  spin(getCorpus(corpusId)).then((sourcesFetched) =>
    store.commit("setSources", {
      corpusId: corpusId,
      sources: sourcesFetched,
    })
  );
}

loadSources();

async function remove(source) {
  await spin(removeSource(corpusId, source.name));
  loadSources();
}

async function upload(event) {
  await spin(putSources(corpusId, event.target.files));
  loadSources();
}
</script>

<style>
</style>
