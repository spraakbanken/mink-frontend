<script setup lang="ts">
import { computed } from "vue";
import { useCorpus } from "../corpus.composable";
import ToolPanel from "@/corpus/explore/ToolPanel.vue";
import { ensureTrailingSlash } from "@/util";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";
import useSpin from "@/spin/spin.composable";
import { useCorpusStore } from "@/store/corpus.store";
import { useAuth } from "@/auth/auth.composable";
import useMessenger from "@/message/messenger.composable";

const props = defineProps<{
  id: string;
}>();

const { isPending } = useSpin();
const { installKorp, installStrix, uninstallKorp, uninstallStrix } =
  useCorpusStore();
const { isJobRunning, job, jobState } = useCorpus(props.id);
const { locale3 } = useLocale();
const { canWrite } = useAuth();
const { alertError } = useMessenger();

const korpUrl = ensureTrailingSlash(import.meta.env.VITE_KORP_URL);
const strixUrl = ensureTrailingSlash(import.meta.env.VITE_STRIX_URL);

const canInstall = computed(
  () =>
    canWrite("corpus", props.id) &&
    !isJobRunning.value &&
    jobState.value?.sparv == "done" &&
    !isPending(`${props.id}/job`),
);
</script>

<template>
  <p>{{ $t("exports.tools.help") }}</p>
  <div class="grid gap-4 mt-4">
    <PendingContent :on="`${id}/job/install/korp`">
      <ToolPanel
        name="Korp"
        :info="$t('exports.tools.help.korp')"
        :link-url="$t('exports.tools.help.korp.manual.url')"
        :link-text="$t('exports.tools.help.korp.manual.text')"
        :can-install
        :is-installed="jobState?.korp == 'done' && job?.installed_korp"
        :show-url="`${korpUrl}?mode=mink#?corpus=${id}&lang=${locale3}`"
        @install="installKorp(id).catch(alertError)"
        @uninstall="uninstallKorp(id).catch(alertError)"
      />
    </PendingContent>

    <PendingContent :on="`${id}/job/install/strix`">
      <ToolPanel
        name="Strix"
        :info="$t('exports.tools.help.strix')"
        :link-url="$t('exports.tools.help.strix.manual.url')"
        :link-text="$t('exports.tools.help.strix.manual.text')"
        :can-install
        :is-installed="jobState?.strix == 'done' && job?.installed_strix"
        :show-url="`${strixUrl}?mode=mink&corpora=${id}`"
        @install="installStrix(id).catch(alertError)"
        @uninstall="uninstallStrix(id).catch(alertError)"
      />
    </PendingContent>
  </div>
</template>
