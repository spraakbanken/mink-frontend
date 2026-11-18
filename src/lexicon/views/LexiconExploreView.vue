<script setup lang="ts">
import { computed } from "vue";
import { useLexicon } from "../lexicon.composable";
import ToolPanel from "@/resource/ToolPanel.vue";
import { ensureTrailingSlash } from "@/util";
import PendingContent from "@/spin/PendingContent.vue";
import useSpin from "@/spin/spin.composable";
import { useUserStore } from "@/store/user.store";
import useMessenger from "@/alert/alert.composable";
import useResource from "@/resource/resource.composable";
import { useAppConfig } from "@/app/useAppConfig";
import HelpBox from "@/components/HelpBox.vue";

const props = defineProps<{
  id: string;
}>();

const { lexiconSettings } = useAppConfig();
const { isPending } = useSpin();
const { installKarpred, installKarps, uninstallKarpred, uninstallKarps } =
  useLexicon(props.id);
const { isRunning, job } = useResource<"lexicon">(props.id);
const { canWrite } = useUserStore();
const { showAlert } = useMessenger();

const karpredUrl =
  lexiconSettings.karpred && ensureTrailingSlash(lexiconSettings.karpred.url);
const karpsUrl =
  lexiconSettings.karps && ensureTrailingSlash(lexiconSettings.karps.url);

const canInstall = computed(
  () =>
    canWrite("lexicon", props.id) &&
    !isRunning.value &&
    job.value?.status.karp_pipeline == "done" &&
    !isPending(`${props.id}/job`),
);
</script>

<template>
  <div class="flex flex-col gap-2">
    <HelpBox>{{ $t("lexicon.tools.help") }}</HelpBox>
    <div class="grid lg:grid-cols-2 gap-2">
      <PendingContent
        v-if="lexiconSettings.karpred"
        :on="`${id}/job/install/karpred`"
      >
        <ToolPanel
          :name="$t('lexicon.karpred')"
          :info="$t('lexicon.karpred.help')"
          :can-install
          :is-installed="job?.installed_karpred"
          :show-url="`${karpredUrl}?mode=mink&lexicon=${id}`"
          @install="installKarpred().catch(showAlert)"
          @uninstall="uninstallKarpred().catch(showAlert)"
        />
      </PendingContent>

      <PendingContent
        v-if="lexiconSettings.karps"
        :on="`${id}/job/install/karps`"
      >
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
  </div>
</template>
