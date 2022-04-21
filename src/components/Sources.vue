<template>
  <PendingContent :on="`corpus/${corpusId}/sources`">
    <Filedrop @drop="uploadDrop">
      <table class="w-full mt-4">
        <thead>
          <tr>
            <th>Filnamn</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="border-b-0">
          <tr v-for="source in sources" :key="source">
            <td>
              <router-link :to="`/corpus/${corpusId}/sources/${source.name}`">
                {{ source.name }}
              </router-link>
            </td>
            <td class="text-right">
              <ActionButton
                @click="remove(source)"
                class="mute slim hover:bg-red-200"
              >
                ta bort
              </ActionButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-blue-50 border-blue-100 border-dashed border-4">
        <label class="absolute uppercase opacity-75 text-sm font-bold p-1">
          Lägg till textfil
        </label>
        <div class="p-8 flex justify-center items-center">
          Dra och släpp, eller:
          <input type="file" @change="uploadSingle" class="ml-2" />
        </div>
      </div>
    </Filedrop>
  </PendingContent>
</template>

<script setup>
import useSources from "@/composables/sources";
import useCorpusIdParam from "@/composables/corpusIdParam";
import ActionButton from "./layout/ActionButton.vue";
import Filedrop from "./Filedrop.vue";
import { onMounted } from "@vue/runtime-core";
import PendingContent from "./PendingContent.vue";

const { sources, loadSources, remove, upload } = useSources();
const { corpusId } = useCorpusIdParam();

onMounted(() => loadSources());

function uploadDrop(files) {
  upload(files);
}

function uploadSingle(event) {
  upload(event.target.files);
}
</script>

<style></style>
