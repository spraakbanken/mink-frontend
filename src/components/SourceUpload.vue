<template>
  <Filedrop @drop="uploadDrop">
    <slot />
    <div
      :class="
        uploadMessage
          ? ['bg-red-50', 'border-red-200']
          : variant == 'primary'
          ? ['bg-blue-50', 'border-blue-100']
          : ['bg-gray-50', 'border-gray-100']
      "
      class="border-dashed border-4"
    >
      <label class="absolute uppercase opacity-75 text-sm font-bold p-1">
        {{ $t("addFile") }}
      </label>
      <div class="p-8">
        <div class="flex justify-center items-center">
          {{ $t("dragANDdrop") }}:
          <input type="file" class="ml-2" multiple @change="uploadInput" />
        </div>
        <div v-if="uploadMessage" class="mt-4 text-center text-red-800">
          {{ $t("error.message") }}: "{{ uploadMessage }}"
        </div>
      </div>
    </div>
  </Filedrop>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import useSources from "@/composables/sources";
import Filedrop from "./Filedrop.vue";
import useCorpusIdParam from "@/composables/corpusIdParam";

const props = defineProps({
  fileHandler: {
    type: Function,
    default: null,
  },
  variant: {
    type: String,
    default: null,
  },
});

const corpusId = useCorpusIdParam();
const { upload } = useSources(corpusId);
const uploadMessage = ref("");

function defaultFileHandler(files) {
  upload(files).catch((error) => (uploadMessage.value = error.message));
}

async function uploadDrop(files) {
  uploadMessage.value = null;
  (props.fileHandler || defaultFileHandler)(files);
}

function uploadInput(event) {
  uploadMessage.value = null;
  (props.fileHandler || defaultFileHandler)(event.target.files);
}
</script>

<style></style>
