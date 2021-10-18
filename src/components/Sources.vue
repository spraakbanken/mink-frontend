<template>
  <Filedrop @drop="upload">
    <table class="w-full mt-4">
      <thead>
        <tr>
          <th>Filnamn</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="border-b-0">
        <tr v-for="source in sources" :key="source">
          <td>{{ source.name }}</td>
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
</template>

<script setup>
import useSources from "@/composables/sources";
import ActionButton from "./layout/ActionButton.vue";
import Filedrop from "./Filedrop.vue";

const { sources, loadSources, remove, upload } = useSources();

loadSources();

function uploadSingle(event) {
  upload(event.target.files);
}
</script>

<style></style>
