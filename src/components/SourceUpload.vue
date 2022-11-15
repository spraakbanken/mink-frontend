<template>
  <Filedrop @drop="fileHandler">
    <slot />
    <div
      :class="
        variant == 'primary'
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
          <input
            type="file"
            class="ml-2"
            multiple
            @change="(event) => fileHandler(event.target.files)"
          />
        </div>
      </div>
    </div>
  </Filedrop>
</template>

<script setup>
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

const fileHandler = props.fileHandler || upload;
</script>

<style></style>
