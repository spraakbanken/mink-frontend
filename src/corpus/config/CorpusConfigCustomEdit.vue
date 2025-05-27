<script setup lang="ts">
import Yaml from "js-yaml";
import { ref, watchEffect } from "vue";
import Ajv2020 from "ajv/dist/2020";
import { PhFileX, PhWarning } from "@phosphor-icons/vue";
import { useI18n } from "vue-i18n";
import { isError } from "es-toolkit";
import useCorpusIdParam from "../corpusIdParam.composable";
import useConfig from "./config.composable";
import CorpusConfigCustomHelp from "./CorpusConfigCustomHelp.vue";
import useMessenger from "@/message/messenger.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import HelpBox from "@/components/HelpBox.vue";
import PendingContent from "@/spin/PendingContent.vue";
import ActionButton from "@/components/ActionButton.vue";
import RouteButton from "@/components/RouteButton.vue";
import schema from "@/assets/sparvconfig.schema.json";

const ajv = new Ajv2020();
const schemaValidate = ajv.compile(schema);

const corpusId = useCorpusIdParam();
const { configAsCustom: config, saveConfig } = useConfig(corpusId);
const { alertError } = useMessenger();
const { t } = useI18n();

const input = ref(config.value || "");
const error = ref<{ hint: string; details?: string }>();
const showErrorDetails = ref<boolean>(false);

function validate() {
  error.value = undefined;

  // Check YAML syntax
  let data;
  try {
    data = Yaml.load(input.value);
  } catch (err) {
    error.value = {
      hint: t("config.invalid.yaml"),
      details: isError(err) ? err.message : undefined,
    };
    return;
  }

  // Check data against Sparv config schema
  if (!schemaValidate(data)) {
    error.value = {
      hint: t("config.invalid.schema"),
      details: schemaValidate.errors
        ?.map((e) => `${e.instancePath} ${e.message}`)
        .join("\n"),
    };
  }

  // Keep details open if there are any
  showErrorDetails.value = showErrorDetails.value && !!error.value?.details;
}

async function upload() {
  if (input.value == config.value) return;
  await saveConfig(input.value).catch(alertError);
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

          <div
            v-if="error"
            tabindex="0"
            class="text-red-600 cursor-pointer"
            @click="showErrorDetails = !showErrorDetails"
            @keydown.enter="showErrorDetails = !showErrorDetails"
          >
            <PhFileX class="inline text-xl" />
            {{ error.hint }}
          </div>

          <ActionButton
            @click="upload"
            class="button-primary"
            :disabled="input == config || !!error"
            :title="input == config ? $t('save.no_changes') : error?.hint"
          >
            {{ $t("save") }}
          </ActionButton>
        </div>

        <pre
          v-if="error?.details && showErrorDetails"
          class="bg-red-600/10 text-red-600 p-2 text-xs"
          >{{ error.details }}</pre
        >

        <textarea class="w-full h-96 font-mono text-sm" v-model="input" />
      </PendingContent>
    </LayoutBox>
  </div>
</template>
