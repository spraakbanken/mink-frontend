<template>
  <Filedrop @drop="fileHandler">
    <slot />
    <div
      :class="
        variant == 'primary'
          ? [
              'bg-blue-50',
              'border-blue-100',
              'dark:bg-blue-200',
              'dark:border-blue-300',
              'dark:text-blue-800',
            ]
          : [
              'bg-zinc-100',
              'border-zinc-200',
              'dark:bg-zinc-700',
              'dark:border-zinc-500',
            ]
      "
      class="border-dashed border-4"
    >
      <label class="absolute uppercase opacity-70 text-sm font-bold p-1">
        {{ $t("addFile") }}
      </label>
      <div class="p-8">
        <div class="flex flex-col justify-center items-center opacity-70">
          <label for="file-input" class="cursor-pointer">
            {{ $t("dragANDdrop") }}
          </label>
          <input
            id="file-input"
            type="file"
            class="hidden"
            multiple
            @change="(event) => fileHandler(event.target.files)"
          />
        </div>
      </div>
    </div>
  </Filedrop>
</template>

<script setup>
import useSources from "./sources.composable";
import Filedrop from "./Filedrop.vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";

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
const { uploadSources } = useSources(corpusId);

const fileHandler = props.fileHandler || uploadSources;
</script>

<style></style>
