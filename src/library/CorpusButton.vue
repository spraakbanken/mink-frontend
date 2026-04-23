<script setup lang="ts">
import { PhUser } from "@phosphor-icons/vue";
import { onMounted } from "vue";
import useSpin from "@/spin/spin.composable";
import PadButton from "@/components/PadButton.vue";
import CorpusStateMessage from "@/corpus/CorpusStateMessage.vue";
import { useCorpus } from "@/corpus/corpus.composable";
import useSources from "@/resource/sources.composable";
import useLocale from "@/i18n/locale.composable";
import { useAuth } from "@/auth/auth.composable";
import { useConfigStore } from "@/store/config.store";

const props = defineProps<{
  id: string;
}>();

const { loadConfig } = useConfigStore();
const { spin } = useSpin();
const { corpus } = useCorpus(props.id);
const { sources } = useSources("corpus", props.id);
const { th } = useLocale();
const { isCurrentUser } = useAuth();

// Start loading specific data using a common spin token, to only show one spinner
onMounted(() => {
  spin(loadConfig("corpus", props.id), "resources");
});
</script>

<template>
  <PadButton class="flex" :to="`/library/corpus/${id}`">
    <strong>{{ th(corpus?.name) || id }}</strong>

    <span v-if="sources.length">
      {{ $t("files", sources.length || 0) }}
    </span>

    <div
      v-if="corpus?.owner && !isCurrentUser(corpus.owner)"
      class="text-sm mt-1"
    >
      <PhUser class="inline mr-1" />
      {{ corpus.owner.name }}
    </div>

    <div class="flex mt-2 text-sm">
      <CorpusStateMessage :id />
    </div>
  </PadButton>
</template>
