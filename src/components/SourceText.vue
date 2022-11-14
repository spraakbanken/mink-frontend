<script setup>
import { downloadFile } from "@/util";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
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
  <div
    class="relative rounded shadow-inner overflow-hidden"
    :class="{ 'h-20': !expanded }"
  >
    <div class="absolute z-10 top-2 right-2 flex gap-2">
      <ActionButton @click="toggleExpand">
        {{ expanded ? t("expand.close") : t("expand.open") }}
      </ActionButton>
      <ActionButton @click="download">
        <icon :icon="['far', 'file']" class="mr-1" />
        Ladda ner
      </ActionButton>
    </div>
    <div
      class="bg-zinc-700 text-white whitespace-pre-wrap font-mono text-xs p-2"
    >
      {{ text }}
    </div>
    <div
      v-if="!expanded"
      class="absolute w-full h-20 bg-gradient-to-t from-zinc-700 bottom-0"
    ></div>
  </div>
</template>
