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
import useConfig from "@/composables/config";
import PadButton from "@/components/layout/PadButton.vue";
import CorpusStateMessage from "./CorpusStateMessage.vue";
import useCorpus from "@/composables/corpus";

const props = defineProps({
  id: {
    type: String,
    required: true,
    validator: (x) => x,
  },
});

const store = useStore();
const { loadCorpus } = useCorpus(props.id);
const { corpusName } = useConfig(props.id);

const corpus = computed(() => store.state.corpora[props.id]);

loadCorpus();
</script>
