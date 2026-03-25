<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { once } from "es-toolkit";
import { PhArrowsClockwise, PhDownloadSimple } from "@phosphor-icons/vue";
import { downloadFile } from "@/util";
import ActionButton from "@/components/ActionButton.vue";
import TextData from "@/components/TextData.vue";
import type { SyntaxLanguage } from "@/highlight";

/** Defer loading if file is large. */
const AUTOLOAD_LIMIT = 500_000;

const props = defineProps<{
  load: () => Promise<string | Blob | undefined>;
  filename: string;
  /** File size (bytes) */
  size?: number;
  noLoad?: boolean;
  language?: SyntaxLanguage & "xml";
}>();

const disabled = ref(false);
const text = ref();
const shouldDeferLoading = computed(() => (props.size || 0) > AUTOLOAD_LIMIT);

/** Wraps the load call to ensure it's only called once (or not at all). */
const load = once(props.load);

/** Load text and store it for showing. */
async function show() {
  const content = await load();

  if (typeof content != "string") {
    disabled.value = true;
    throw new TypeError("Not a text file");
  }

  text.value = content;
}

// Load the text unless it is disabled or only manual.
onMounted(async () => {
  if (!props.noLoad && !shouldDeferLoading.value) await show();
});

/** Trigger download of the file */
async function download() {
  const text = await load();
  if (text) downloadFile(text, props.filename);
}
</script>

<template>
  <TextData v-if="text" :text :language />

  <div class="my-2 flex gap-2">
    <ActionButton
      v-if="!noLoad && text === undefined"
      @click="show()"
      :disabled
    >
      <PhArrowsClockwise class="inline mb-1 mr-1" />
      {{ $t("load") }}
    </ActionButton>

    <ActionButton @click="download">
      <PhDownloadSimple class="inline mb-0.5 mr-1" />
      {{ $t("download") }}
    </ActionButton>
  </div>
</template>
