<template>
  <PadButton class="hover:bg-gray-50 flex flex-col">
    <strong>{{ corpusName }}</strong>
    <span v-if="corpus.sources">
      {{ $t("files", corpus.sources.length) }}
    </span>
    <div class="flex">
      Sparv
      <img
        v-if="isJobDone"
        src="@/assets/tick-mark.svg"
        class="h-4 opacity-75 mt-1 ml-2"
      />
      <img
        v-else
        src="@/assets/incorrect.svg"
        class="h-4 opacity-75 mt-1 ml-2"
      />
    </div>
    <div class="flex">
      Korp
      <img src="@/assets/incorrect.svg" class="h-4 opacity-75 mt-1 ml-2" />
    </div>
  </PadButton>
</template>

<script setup>
import useJob from "@/composables/job";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import PadButton from "@/components/layout/PadButton.vue";
import useConfig from "@/composables/config";

const props = defineProps(["id"]);

const store = useStore();
const { isJobDone } = useJob(props.id);
const { corpusName } = useConfig(props.id);

const corpus = computed(() => store.state.corpora[props.id]);
</script>
