<template>
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
  <Filedrop />
</template>

<script setup>
import useSources from "@/composables/sources";
import ActionButton from "./layout/ActionButton.vue";
import Filedrop from "./Filedrop.vue";

const { sources, loadSources, remove } = useSources();

loadSources();
</script>

<style></style>
