<script setup lang="ts">
import { PhFloppyDisk, PhLock, PhWarning } from "@phosphor-icons/vue";
import { computed, defineAsyncComponent, ref, watchEffect } from "vue";
import { computedAsync } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useCorpus } from "../corpus.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import HelpBox from "@/components/HelpBox.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import useMessenger from "@/message/messenger.composable";
import PendingContent from "@/spin/PendingContent.vue";
import { useCorpusStore } from "@/store/corpus.store";
import { useAuth } from "@/auth/auth.composable";
import ActionButton from "@/components/ActionButton.vue";
import api from "@/api/api";
import LayoutSection from "@/components/LayoutSection.vue";

const corpusId = useCorpusIdParam();
const { config } = useCorpus(corpusId);
const { alertError } = useMessenger();
const corpusStore = useCorpusStore();
const { canWrite } = useAuth();
const { t } = useI18n();

const YamlEditor = defineAsyncComponent(
  () => import("@/editor/YamlEditor.vue"),
);

const input = ref(config.value || "");
const schema = computedAsync(() => api.sparvSchema());
const isValid = ref(true);

/** Reactively check if content is OK to save, and otherwise give a reason why not */
const saveErrorMessage = computed(() => {
  if (input.value == config.value) return t("save.no_changes");
  if (!isValid.value) return t("save.invalid");
  return "";
});

/** Assign YAML content to input whenever it is loaded */
watchEffect(() => (input.value = config.value || ""));

/** Save current input as config by uploading it */
async function upload() {
  await corpusStore.uploadConfig(corpusId, input.value).catch(alertError);
}
</script>

<template>
  <LayoutSection :title="$t('config.custom')">
    <HelpBox>
      <i18n-t scope="global" keypath="config.custom.help">
        <template #sparv>
          <a :href="$t('sparv.url')">Sparv</a>
        </template>
        <template #topic>
          <a
            href="https://spraakbanken.gu.se/sparv/user-manual/corpus-configuration/"
            target="_blank"
            >Corpus Configuration</a
          >
        </template>
      </i18n-t>
    </HelpBox>

    <HelpBox v-if="!canWrite('corpora', corpusId)">
      <PhLock class="inline mb-0.5 mr-1" />
      {{ $t("resource.access_denied") }}
    </HelpBox>

    <template v-else>
      <HelpBox important>
        <PhWarning class="inline mb-1 mr-1" />
        {{ $t("config.custom.upload.caution") }}
      </HelpBox>

      <HelpBox important>
        <PhWarning class="inline mb-1 mr-1" />
        {{ $t("config.custom.upload.overwrite") }}
      </HelpBox>
    </template>

    <LayoutBox>
      <PendingContent :on="`corpus/${corpusId}/config`">
        <YamlEditor
          v-if="config"
          v-model="input"
          :disabled="!canWrite('corpora', corpusId)"
          :schema
          @validated="isValid = $event"
        >
          <template #toolbar-right>
            <ActionButton
              @click="upload"
              class="button-primary"
              :disabled="!!saveErrorMessage"
              :title="saveErrorMessage"
            >
              <PhFloppyDisk class="inline mb-0.5 mr-1" />
              {{ $t("save") }}
            </ActionButton>
          </template>
        </YamlEditor>
      </PendingContent>
    </LayoutBox>
  </LayoutSection>
</template>
