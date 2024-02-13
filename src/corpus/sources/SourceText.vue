<script setup lang="ts">
import { onMounted, ref } from "vue";
import { downloadFile } from "@/util";
import ActionButton from "@/components/ActionButton.vue";
import TextData from "@/components/TextData.vue";

const props = defineProps<{
  load: () => Promise<string | undefined>;
  filename: string;
  noLoad?: boolean;
}>();

const text = ref();
const loadPromise = props.load();

onMounted(async () => {
  if (!props.noLoad) text.value = await loadPromise;
});

async function download() {
  const text = await loadPromise;
  downloadFile(text!, props.filename || "mink-source");
}
</script>

<template>
  <TextData v-if="text" :text="text" />

  <div class="my-2">
    <ActionButton @click="download">
      <icon :icon="['far', 'file']" class="mr-1" />
      {{ $t("download") }}
    </ActionButton>
  </div>
</template>
