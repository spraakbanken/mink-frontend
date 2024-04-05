<script setup lang="ts">
import { computed, ref, watch } from "vue";
import useExports from "@/corpus/exports/exports.composable";
import ToolPanel from "@/corpus/explore/ToolPanel.vue";
import { ensureTrailingSlash } from "@/util";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import useJob from "@/corpus/job/job.composable";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";

const corpusId = useCorpusIdParam();
const { exports, loadExports } = useExports(corpusId);
const { isDone } = useCorpusState(corpusId);
const { installKorp, installStrix, jobState } = useJob(corpusId);
const { locale3 } = useLocale();

const korpUrl = ensureTrailingSlash(import.meta.env.VITE_KORP_URL);
const strixUrl = ensureTrailingSlash(import.meta.env.VITE_STRIX_URL);

const isInstallPending = ref(false);
const canInstall = computed(
  () =>
    !!exports.value?.length &&
    !!jobState.value &&
    !["waiting", "running"].includes(jobState.value.korp) &&
    !["waiting", "running"].includes(jobState.value.strix) &&
    !isInstallPending.value,
);

loadExports();

async function korpInstall() {
  isInstallPending.value = true;
  await installKorp();
  isInstallPending.value = false;
}

async function strixInstall() {
  isInstallPending.value = true;
  await installStrix();
  isInstallPending.value = false;
}

// When a job finishes, show download button.
watch(isDone, () => {
  if (isDone.value) {
    loadExports();
  }
});
</script>

<template>
  <p>{{ $t("exports.tools.help") }}</p>
  <PendingContent
    :on="`corpus/${corpusId}/exports`"
    class="grid xl:grid-cols-2 gap-4 mt-4"
  >
    <ToolPanel
      name="Korp"
      :spin-token="`corpus/${corpusId}/install/korp`"
      :info="$t('exports.tools.help.korp')"
      :link-url="$t('exports.tools.help.korp.manual.url')"
      :link-text="$t('exports.tools.help.korp.manual.text')"
      :can-install="canInstall"
      :is-installed="jobState?.korp == 'done'"
      :show-url="`${korpUrl}?mode=mink#?corpus=${corpusId}&lang=${locale3}`"
      @install="korpInstall()"
    />

    <ToolPanel
      name="Strix"
      :spin-token="`corpus/${corpusId}/install/strix`"
      :info="$t('exports.tools.help.strix')"
      :can-install="canInstall"
      :is-installed="jobState?.strix == 'done'"
      :show-url="`${strixUrl}?modeSelected=mink&filters=corpus_id:${corpusId}&lang=${locale3}`"
      @install="strixInstall()"
    />
  </PendingContent>
</template>
