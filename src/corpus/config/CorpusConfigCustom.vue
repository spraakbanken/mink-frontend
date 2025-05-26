<script setup lang="ts">
import { PhPencilSimple, PhWarning } from "@phosphor-icons/vue";
import CorpusConfigCustomHelp from "./CorpusConfigCustomHelp.vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useConfig from "@/corpus/config/config.composable";
import FileUpload from "@/components/FileUpload.vue";
import HelpBox from "@/components/HelpBox.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import useMessenger from "@/message/messenger.composable";
import SyntaxHighlight from "@/components/SyntaxHighlight.vue";
import PendingContent from "@/spin/PendingContent.vue";
import RouteButton from "@/components/RouteButton.vue";

const corpusId = useCorpusIdParam();
const { config, saveConfig } = useConfig(corpusId);
const { alertError } = useMessenger();

async function upload(files: File[]) {
  const configYaml = await files[0].text();
  await saveConfig(configYaml).catch(alertError);
}
</script>

<template>
  <CorpusConfigCustomHelp />

  <div class="flex flex-wrap gap-4 items-start">
    <LayoutBox class="w-96 grow" :title="$t('upload')">
      <HelpBox important>
        <PhWarning class="inline mb-1 mr-1" />
        {{ $t("config.custom.upload.caution") }}
      </HelpBox>

      <HelpBox important>
        <PhWarning class="inline mb-1 mr-1" />
        {{ $t("config.custom.upload.overwrite") }}
      </HelpBox>

      <PendingContent :on="`corpus/${corpusId}/config`" blocking>
        <FileUpload :file-handler="upload" accept=".yaml,.yml" primary />
      </PendingContent>
    </LayoutBox>

    <LayoutBox class="w-96 grow" :title="$t('show')">
      <PendingContent :on="`corpus/${corpusId}/config`">
        <SyntaxHighlight v-if="config" language="yaml" :code="config" />
      </PendingContent>

      <template #controls>
        <RouteButton
          :to="`/library/corpus/${corpusId}/config/custom/edit`"
          class="button-primary"
        >
          <PhPencilSimple weight="bold" class="inline mb-1 mr-1" />
          {{ $t("edit") }}
        </RouteButton>
      </template>
    </LayoutBox>
  </div>
</template>
