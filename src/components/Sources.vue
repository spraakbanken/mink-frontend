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
  <div>+ <input type="file" @change="upload" /></div>
</template>

<script setup>
import useSources from "@/composables/sources";
import ActionButton from "./layout/ActionButton.vue";

const { sources, loadSources, remove, upload } = useSources();

loadSources();
</script>

<style></style>
