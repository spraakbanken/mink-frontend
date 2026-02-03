<script setup lang="ts">
import { PhUser } from "@phosphor-icons/vue";
import useSpin from "@/spin/spin.composable";
import PadButton from "@/components/PadButton.vue";
import CorpusStateMessage from "@/corpus/CorpusStateMessage.vue";
import { useCorpus } from "@/corpus/corpus.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useLocale from "@/i18n/locale.composable";
import { useAuth } from "@/auth/auth.composable";

const props = defineProps<{
  id: string;
}>();

const corpusStore = useCorpusStore();
const { spin } = useSpin();
const { corpus, hasSources, sources } = useCorpus(props.id);
const { th } = useLocale();
const { isCurrentUser } = useAuth();

const loadPromise = Promise.all([
  corpusStore.loadConfig(props.id),
  corpusStore.loadSources(props.id),
]);
spin(loadPromise, "corpora");
</script>

<template>
  <PadButton class="flex" :to="`/library/corpus/${id}`">
    <strong>{{ th(corpus?.name) || id }}</strong>

    <span v-if="hasSources">
      {{ $t("files", sources.length) }}
    </span>

    <div
      v-if="corpus?.owner && !isCurrentUser(corpus.owner)"
      class="text-sm mt-1"
    >
      <PhUser class="inline mr-1" />
      {{ corpus.owner.name }}
    </div>

    <div class="flex mt-2 text-sm">
      <CorpusStateMessage :corpus-id="id" />
    </div>
  </PadButton>
</template>
