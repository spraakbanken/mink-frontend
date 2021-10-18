<template>
  <div
    @drop.prevent="drop"
    @dragover.prevent
    class="bg-blue-50 border-blue-100 border-dashed border-4"
  >
    <label class="absolute uppercase opacity-75 text-sm font-bold p-1">
      Lägg till textfil
    </label>
    <div class="p-8 flex justify-center items-center">
      Dra och släpp, eller:
      <input type="file" @change="upload" class="ml-2" />
    </div>
  </div>
</template>

<script setup>
import useSources from "@/composables/sources";

const { upload } = useSources();

function drop(event) {
  const files = event.dataTransfer.items
    ? [...event.dataTransfer.items]
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
    : event.dataTransfer.files;
  upload(files);
}

// function dragover(event) {}
</script>

<style></style>
