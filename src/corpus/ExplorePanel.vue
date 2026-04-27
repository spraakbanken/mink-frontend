<script setup lang="ts">
import { computed } from "vue";
import { useCorpus } from "./corpus.composable";
import ToolPanel from "@/resource/ToolPanel.vue";
import { ensureTrailingSlash } from "@/util";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";
import useSpin from "@/spin/spin.composable";
import { useAuth } from "@/auth/auth.composable";
import useAlert from "@/alert/alert.composable";
import useResource from "@/resource/resource.composable";

const props = defineProps<{
  id: string;
}>();

const { isPending } = useSpin();
const { installKorp, installStrix, uninstallKorp, uninstallStrix } = useCorpus(
  props.id,
);
const { isRunning, job } = useResource<"corpus">(props.id);
const { locale3 } = useLocale();
const { canWrite } = useAuth();
const { showAlert } = useAlert();

const korpUrl = ensureTrailingSlash(import.meta.env.VITE_KORP_URL);
const strixUrl = ensureTrailingSlash(import.meta.env.VITE_STRIX_URL);

const canInstall = computed(
  () =>
    canWrite("corpus", props.id) &&
    !isRunning.value &&
    job.value?.status.sparv == "done" &&
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
        :is-installed="job?.status.korp == 'done' && job?.installed_korp"
        :show-url="`${korpUrl}?mode=mink#?corpus=${id}&lang=${locale3}`"
        @install="installKorp().catch(showAlert)"
        @uninstall="uninstallKorp().catch(showAlert)"
      />
    </PendingContent>

    <PendingContent :on="`${id}/job/install/strix`">
      <ToolPanel
        name="Strix"
        :info="$t('exports.tools.help.strix')"
        :link-url="$t('exports.tools.help.strix.manual.url')"
        :link-text="$t('exports.tools.help.strix.manual.text')"
        :can-install
        :is-installed="job?.status.strix == 'done' && job?.installed_strix"
        :show-url="`${strixUrl}?mode=mink&corpora=${id}`"
        @install="installStrix().catch(showAlert)"
        @uninstall="uninstallStrix().catch(showAlert)"
      />
    </PendingContent>
  </div>
</template>
