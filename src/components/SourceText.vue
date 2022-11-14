<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { downloadFile } from "@/util";
import ActionButton from "./layout/ActionButton.vue";

const { t } = useI18n();

const props = defineProps(["load", "filename"]);
const text = ref();
const expanded = ref(false);

onMounted(async () => (text.value = await props.load()));

function download() {
  downloadFile(text.value, props.filename || "mink-source");
}

function toggleExpand() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <div v-if="text" class="relative bg-zinc-700 rounded shadow-inner text-sm">
    <div class="absolute z-10 top-2 right-2 flex gap-2">
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
        Ladda ner
      </ActionButton>
    </div>
    <div
      class="text-white overflow-hidden whitespace-pre-wrap font-mono text-xs p-2"
      :class="{ 'h-20': !expanded }"
    >
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
.h-20 {
  mask-image: linear-gradient(black 50%, transparent);
}
</style>
