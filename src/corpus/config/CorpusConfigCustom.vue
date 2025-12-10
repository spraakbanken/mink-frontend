<script setup lang="ts">
import { PhLock, PhPencilSimple, PhWarning } from "@phosphor-icons/vue";
import { useCorpus } from "../corpus.composable";
import CorpusConfigCustomHelp from "./CorpusConfigCustomHelp.vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import FileUpload from "@/components/FileUpload.vue";
import HelpBox from "@/components/HelpBox.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import useMessenger from "@/message/messenger.composable";
import SyntaxHighlight from "@/components/SyntaxHighlight.vue";
import PendingContent from "@/spin/PendingContent.vue";
import RouteButton from "@/components/RouteButton.vue";
import { useCorpusStore } from "@/store/corpus.store";
import { canWrite } from "@/auth/sbAuth";

const corpusId = useCorpusIdParam();
const { config } = useCorpus(corpusId);
const { alertError } = useMessenger();
const corpusStore = useCorpusStore();

async function upload(files: File[]) {
  if (!files[0]) throw new RangeError("No files");
  const configYaml = await files[0].text();
  await corpusStore.uploadConfig(corpusId, configYaml).catch(alertError);
}
</script>

<template>
  <CorpusConfigCustomHelp />

  <div class="flex flex-wrap gap-4 items-start">
    <LayoutBox class="w-96 grow" :title="$t('upload')">
      <div v-if="canWrite('corpora', corpusId)">
        <HelpBox important>
          <PhWarning class="inline mb-1 mr-1" />
          {{ $t("config.custom.upload.caution") }}
        </HelpBox>

        <HelpBox important>
          <PhWarning class="inline mb-1 mr-1" />
          {{ $t("config.custom.upload.overwrite") }}
        </HelpBox>

        <PendingContent :on="`corpus/${corpusId}/config`" blocking>
          <FileUpload
            v-if="canWrite('corpora', corpusId)"
            :file-handler="upload"
            accept=".yaml,.yml"
            primary
          />
        </PendingContent>
      </div>

      <HelpBox v-else>
        <PhLock class="inline mb-0.5 mr-1" />
        {{ $t("resource.access_denied") }}
      </HelpBox>
    </LayoutBox>

    <LayoutBox class="w-96 grow" :title="$t('show')">
      <PendingContent :on="`corpus/${corpusId}/config`">
        <SyntaxHighlight v-if="config" language="yaml" :code="config" />
      </PendingContent>

      <template #controls>
        <RouteButton
          :disabled="!canWrite('corpora', corpusId)"
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
