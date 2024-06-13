<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Yaml from "js-yaml";
import schema from "@/assets/sparvconfig.schema.json";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useMessenger from "@/message/messenger.composable";
import useConfig from "@/corpus/config/config.composable";
import JsonSchemaForm from "@/components/JsonSchemaForm.vue";

const router = useRouter();
const corpusId = useCorpusIdParam();
const { config, uploadConfig } = useConfig(corpusId);
const { alert, alertError } = useMessenger();
const { t } = useI18n();

const configParsed = computed(() =>
  config.value ? Yaml.load(config.value) : undefined,
);
</script>

<template>
  <JsonSchemaForm v-if="configParsed" :schema="schema" :data="configParsed" />
</template>
