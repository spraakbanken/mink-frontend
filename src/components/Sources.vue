<template>
  <table class="w-full my-4">
    <thead>
      <tr>
        <th>Filnamn</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="source in sources" :key="source">
        <td>{{ source.name }}</td>
        <td>
          <ActionButton @click="remove(source)" class="delete mute slim">
            ta bort
          </ActionButton>
        </td>
      </tr>
    </tbody>
  </table>
  <div>+ <input type="file" @change="upload" /></div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { spin } from "@/assets/spin";
import { getCorpus, putSources, removeSource } from "@/assets/api";
import ActionButton from "./layout/ActionButton.vue";

const store = useStore();

const { corpusId } = defineProps({
  corpusId: String,
});

const sources = computed(() => store.state.corpora[corpusId].sources || []);

function loadSources() {
  spin(getCorpus(corpusId), "Hämtar textlista").then((sourcesFetched) =>
    store.commit("setSources", {
      corpusId: corpusId,
      sources: sourcesFetched,
    })
  );
}

loadSources();

async function remove(source) {
  await spin(removeSource(corpusId, source.name), "Raderar textfil");
  loadSources();
}

async function upload(event) {
  await spin(putSources(corpusId, event.target.files), "Laddar upp textfil");
  loadSources();
}
</script>

<style>
</style>
