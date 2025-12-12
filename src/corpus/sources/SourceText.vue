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

const text = ref();
const shouldDeferLoading = computed(() => (props.size || 0) > AUTOLOAD_LIMIT);

/** Wraps the load call to ensure it's only called once (or not at all). */
const load = once(() => props.load());

/** Load text and store it for showing. */
async function show() {
  const content = await load();

  if (typeof content != "string") {
    console.error("Source text is not string, use `<SourceText no-load>`");
    return;
  }

  text.value = content;
}

// Load the text unless it is disabled or only manual.
onMounted(async () => {
  if (!props.noLoad && !shouldDeferLoading.value) await show();
});

async function download() {
  const text = await load();
  downloadFile(text!, props.filename || "mink-source");
}
</script>

<template>
  <TextData v-if="text" :text="text" :language="language" />

  <div class="my-2 flex gap-2">
    <ActionButton v-if="!noLoad && text === undefined" @click="show()">
      <PhArrowsClockwise class="inline mb-1 mr-1" />
      {{ $t("load") }}
    </ActionButton>

    <ActionButton @click="download">
      <PhDownloadSimple weight="fill" class="inline mb-0.5 mr-1" />
      {{ $t("download") }}
    </ActionButton>
  </div>
</template>
