<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import FormSchema from "@formschema/native";
import { ref } from "vue";
import schema from "@/assets/sparvconfig.schema.json";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useMessenger from "@/message/messenger.composable";
import useConfig from "@/corpus/config/config.composable";

const router = useRouter();
const corpusId = useCorpusIdParam();
const { config, uploadConfig } = useConfig(corpusId);
const { alert, alertError } = useMessenger();
const { t } = useI18n();

const configModel = ref(config);

watch(config, () => {
  configModel.value = config.value;
});
</script>

<template>
  <FormSchema :schema="schema"> </FormSchema>
</template>
