<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import once from "lodash/once";
import { downloadFile } from "@/util";
import ActionButton from "@/components/ActionButton.vue";
import TextData from "@/components/TextData.vue";

/** Defer loading if file is large. */
const AUTOLOAD_LIMIT = 500_000;

const props = defineProps<{
  load: () => Promise<string | undefined>;
  filename: string;
  size?: number;
  noLoad?: boolean;
}>();

const text = ref();
const shouldDeferLoading = computed(() => (props.size || 0) > AUTOLOAD_LIMIT);

/** Wraps the load call to ensure it's only called once (or not at all). */
const load = once(() => props.load());

/** Load text and store it for showing. */
async function show() {
  text.value = await load();
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
  <TextData v-if="text" :text="text" />

  <div class="my-2 flex gap-2">
    <ActionButton v-if="!noLoad && text === undefined" @click="show()">
      <icon :icon="['fas', 'rotate']" class="mr-1" />
      {{ $t("load") }}
    </ActionButton>

    <ActionButton @click="download">
      <icon :icon="['far', 'file']" class="mr-1" />
      {{ $t("download") }}
    </ActionButton>
  </div>
</template>
