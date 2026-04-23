<script setup lang="ts">
import { computed } from "vue";
import { useLexicon } from "./lexicon.composable";
import ToolPanel from "@/resource/ToolPanel.vue";
import { ensureTrailingSlash } from "@/util";
import PendingContent from "@/spin/PendingContent.vue";
import useSpin from "@/spin/spin.composable";
import { useAuth } from "@/auth/auth.composable";
import useAlert from "@/alert/alert.composable";
import useResource from "@/resource/resource.composable";

const props = defineProps<{
  id: string;
}>();

const { isPending } = useSpin();
const { installKarps, uninstallKarps } = useLexicon(props.id);
const { isRunning, job } = useResource<"lexicon">(props.id);
const { canWrite } = useAuth();
const { showAlert } = useAlert();

const karpsUrl = ensureTrailingSlash(import.meta.env.VITE_KARPS_URL);

const canInstall = computed(
  () =>
    canWrite("lexicon", props.id) &&
    !isRunning.value &&
    job.value?.status.karp_pipeline == "done" &&
    !isPending(`${props.id}/job`),
);
</script>

<template>
  <p>{{ $t("lexicon.tools.help") }}</p>
  <div class="grid gap-4 mt-4">
    <PendingContent :on="`${id}/job/install/karps`">
      <ToolPanel
        :name="$t('lexicon.karps')"
        :info="$t('lexicon.karps.help')"
        :can-install
        :is-installed="job?.installed_karps"
        :show-url="`${karpsUrl}?resources=${id}`"
        @install="installKarps().catch(showAlert)"
        @uninstall="uninstallKarps().catch(showAlert)"
      />
    </PendingContent>
  </div>
</template>
