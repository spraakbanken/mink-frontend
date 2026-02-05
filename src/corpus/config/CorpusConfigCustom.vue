<script setup lang="ts">
import { PhLock, PhWarning } from "@phosphor-icons/vue";
import { ref, watchEffect } from "vue";
import { computedAsync } from "@vueuse/core";
import { useCorpus } from "../corpus.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import HelpBox from "@/components/HelpBox.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import useMessenger from "@/message/messenger.composable";
import PendingContent from "@/spin/PendingContent.vue";
import { useCorpusStore } from "@/store/corpus.store";
import { useAuth } from "@/auth/auth.composable";
import YamlEditor from "@/components/editor/YamlEditor.vue";
import ActionButton from "@/components/ActionButton.vue";
import api from "@/api/api";
import LayoutSection from "@/components/LayoutSection.vue";

const corpusId = useCorpusIdParam();
const { config } = useCorpus(corpusId);
const { alertError } = useMessenger();
const corpusStore = useCorpusStore();
const { canWrite } = useAuth();

const input = ref(config.value || "");
const schema = computedAsync(() => api.sparvSchema());
const isValid = ref(true);

watchEffect(() => (input.value = config.value || ""));

async function upload() {
  if (input.value == config.value) return;
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
          v-if="input"
          v-model="input"
          :disabled="!canWrite('corpora', corpusId)"
          :schema
          @validated="isValid = $event"
        >
          <template #toolbar-right>
            <ActionButton
              @click="upload"
              class="button-primary"
              :disabled="input == config || !isValid"
              :title="
                input == config
                  ? $t('save.no_changes')
                  : !isValid
                    ? $t('save.invalid')
                    : ''
              "
            >
              {{ $t("save") }}
            </ActionButton>
          </template>
        </YamlEditor>
      </PendingContent>
    </LayoutBox>
  </LayoutSection>
</template>
