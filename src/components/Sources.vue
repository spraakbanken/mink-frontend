<template>
  <PendingContent :on="`corpus/${corpusId}/sources`">
    <Filedrop @drop="uploadDrop">
      <table v-if="sources.length" class="w-full mt-4">
        <thead>
          <tr>
            <th class="w-full">{{ $t("fileName") }}</th>
            <th class="text-right">{{ $t("fileSize") }}</th>
            <th />
          </tr>
        </thead>
        <tbody class="border-b-0">
          <tr v-for="source in sources" :key="source">
            <td>
              <router-link :to="`/corpus/${corpusId}/sources/${source.name}`">
                {{ source.name }}
              </router-link>
            </td>
            <td class="text-right whitespace-nowrap">
              {{ (source.size / 1000).toFixed(1) }} KB
            </td>
            <td class="text-right">
              <ActionButton
                variant="danger"
                class="mute slim"
                @click="remove(source)"
              >
                <icon :icon="['far', 'trash-can']" />
              </ActionButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-blue-50 border-blue-100 border-dashed border-4">
        <label class="absolute uppercase opacity-75 text-sm font-bold p-1">
          {{ $t("addFile") }}
        </label>
        <div class="p-8 flex justify-center items-center">
          {{ $t("dragANDdrop") }}:
          <input type="file" class="ml-2" @change="uploadSingle" />
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
import useExports from "@/composables/exports";

const { sources, loadSources, remove, upload } = useSources();
const { corpusId } = useCorpusIdParam();

onMounted(() => {
  loadSources();
});

function uploadDrop(files) {
  upload(files);
}

function uploadSingle(event) {
  upload(event.target.files);
}
</script>

<style></style>
