<template>
  <PadButton class="hover:bg-gray-50 flex flex-col">
    <strong>{{ corpusName || id }}</strong>
    <span v-if="corpus.sources && corpus.sources.length">
      {{ $t("files", corpus.sources.length) }}
    </span>
    <div class="flex mt-4 text-sm text-gray-500">
      <span v-if="isJobDone">Done</span>
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
