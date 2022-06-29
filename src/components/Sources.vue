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
      <div
        :class="
          uploadMessage
            ? ['bg-red-50', 'border-red-200']
            : ['bg-blue-50', 'border-blue-100']
        "
        class="border-dashed border-4"
      >
        <label class="absolute uppercase opacity-75 text-sm font-bold p-1">
          {{ $t("addFile") }}
        </label>
        <div class="p-8">
          <div class="flex justify-center items-center">
            {{ $t("dragANDdrop") }}:
            <input type="file" class="ml-2" @change="uploadSingle" />
          </div>
          <div v-if="uploadMessage" class="mt-4 text-center text-red-800">
            {{ $t("error.message") }}: "{{ uploadMessage }}"
          </div>
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
import { ref } from "@vue/runtime-core";
import PendingContent from "./PendingContent.vue";

const { sources, loadSources, remove, upload } = useSources();
const { corpusId } = useCorpusIdParam();

const uploadMessage = ref("");

loadSources();

async function uploadDrop(files) {
  uploadMessage.value = null;
  upload(files).catch((error) => (uploadMessage.value = error.message));
}

function uploadSingle(event) {
  uploadMessage.value = null;
  upload(event.target.files).catch(
    (error) => (uploadMessage.value = error.message)
  );
}
</script>

<style></style>
