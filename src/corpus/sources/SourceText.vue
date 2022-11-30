<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { downloadFile } from "@/util";
import ActionButton from "@/components/ActionButton.vue";

const { t } = useI18n();

const props = defineProps(["load", "filename", "noLoad"]);
const text = ref();
const expanded = ref(false);
let loadPromise = null;

onMounted(async () => {
  loadPromise = props.load();
  if (!props.noLoad) text.value = await loadPromise;
});

async function download() {
  downloadFile(await loadPromise, props.filename || "mink-source");
}

function toggleExpand() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <div v-if="text" class="relative bg-zinc-700 rounded shadow-inner text-sm">
    <div class="absolute z-10 bottom-2 right-2 flex gap-2">
      <ActionButton @click="toggleExpand">
        <template v-if="expanded">
          <icon :icon="['far', 'square-minus']" class="mr-1" />
          {{ t("expand.close") }}
        </template>
        <template v-else>
          <icon :icon="['far', 'square-plus']" class="mr-1" />

          {{ t("expand.open") }}
        </template>
      </ActionButton>
      <ActionButton @click="download">
        <icon :icon="['far', 'file']" class="mr-1" />
        {{ t("download") }}
      </ActionButton>
    </div>
    <div
      class="text-white overflow-hidden whitespace-pre-wrap font-mono text-xs p-2 pb-10"
      :class="{ 'h-20': !expanded }"
    >
      {{ expanded ? text : text.slice(0, 800) }}
    </div>
  </div>
  <div v-else>
    <ActionButton @click="download">
      <icon :icon="['far', 'file']" class="mr-1" />
      {{ t("download") }}
    </ActionButton>
  </div>
</template>

<style scoped>
.h-20 {
  mask-image: linear-gradient(black 50%, transparent);
}
</style>
