<template>
  <PadButton class="flex">
    <strong>{{ corpusName || id }}</strong>
    <span v-if="corpus.sources && corpus.sources.length">
      {{ $t("files", corpus.sources.length) }}
    </span>
    <div class="flex mt-2 text-sm text-gray-500">
      <CorpusStateMessage :corpus-id="id" />
    </div>
  </PadButton>
</template>

<script setup>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import PadButton from "@/components/layout/PadButton.vue";
import CorpusStateMessage from "./CorpusStateMessage.vue";
import useConfig from "@/composables/config";
import useSources from "@/composables/sources";

const props = defineProps({
  id: {
    type: String,
    required: true,
    validator: (x) => x,
  },
});

const store = useStore();
const { loadConfig, corpusName } = useConfig(props.id);
const { loadSources } = useSources(props.id);

const corpus = computed(() => store.state.corpora[props.id]);

loadConfig();
loadSources();
</script>
