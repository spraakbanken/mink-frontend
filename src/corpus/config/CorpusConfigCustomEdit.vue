<script setup lang="ts">
import Yaml from "js-yaml";
import { ref, watchEffect } from "vue";
import type { AxiosError } from "axios";
import { PhFileX, PhWarning } from "@phosphor-icons/vue";
import useCorpusIdParam from "../corpusIdParam.composable";
import useConfig from "./config.composable";
import CorpusConfigCustomHelp from "./CorpusConfigCustomHelp.vue";
import { useAuth } from "@/auth/auth.composable";
import useMessenger from "@/message/messenger.composable";
import type { MinkResponse } from "@/api/api.types";
import LayoutBox from "@/components/LayoutBox.vue";
import HelpBox from "@/components/HelpBox.vue";
import PendingContent from "@/spin/PendingContent.vue";
import ActionButton from "@/components/ActionButton.vue";
import { getException } from "@/util";
import RouteButton from "@/components/RouteButton.vue";

const corpusId = useCorpusIdParam();
const { requireAuthentication } = useAuth();
const { config, uploadConfigRaw } = useConfig(corpusId);
const { alertError } = useMessenger();

const input = ref(config.value || "");
const isValid = ref<boolean>();

requireAuthentication();

function validate() {
  isValid.value = !getException(() => Yaml.load(input.value));
}

async function upload() {
  if (input.value == config.value) return;
  try {
    await uploadConfigRaw(input.value);
  } catch (error) {
    alertError(error as AxiosError<MinkResponse>);
  }
}

watchEffect(validate);

// Backend may modify input when saving, then make that visible
watchEffect(() => (input.value = config.value || ""));
</script>

<template>
  <CorpusConfigCustomHelp />

  <div class="flex">
    <LayoutBox class="w-96 grow" :title="$t('edit')">
      <template #controls>
        <RouteButton
          :to="`/library/corpus/${corpusId}/config/custom`"
          :class="{ 'button-primary': input == config }"
        >
          {{ input == config ? $t("show") : $t("cancel") }}
        </RouteButton>
      </template>

      <HelpBox important>
        <PhWarning class="inline mb-1 mr-1" />
        {{ $t("config.custom.upload.caution") }}
      </HelpBox>
      <HelpBox important>
        <PhWarning class="inline mb-1 mr-1" />
        {{ $t("config.custom.upload.overwrite") }}
      </HelpBox>

      <PendingContent :on="`corpus/${corpusId}/config`" blocking>
        <div class="flex gap-2 items-baseline my-2">
          <div class="grow"></div>
          <div v-if="!isValid" :title="$t('yaml.invalid')">
            <PhFileX class="inline text-xl text-red-600" />
          </div>
          <ActionButton
            @click="upload"
            class="button-primary"
            :disabled="input == config || !isValid"
            :title="
              input == config
                ? $t('save.no_changes')
                : !isValid
                  ? $t('yaml.invalid')
                  : undefined
            "
          >
            {{ $t("save") }}
          </ActionButton>
        </div>

        <textarea class="w-full h-96 font-mono text-sm" v-model="input" />
      </PendingContent>
    </LayoutBox>
  </div>
</template>
