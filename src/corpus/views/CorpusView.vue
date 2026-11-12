<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { compact } from "es-toolkit";
import { useAppConfig } from "@/app/useAppConfig";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ResourceViewTemplate from "@/resource/ResourceViewTemplate.vue";

const { appConfig, exploreTools } = useAppConfig();
const id = useResourceIdParam();
const { t } = useI18n();

const tabs = computed(() => {
  const tabs = [
    // Required:
    // TODO Do this for lexicon/metadata also
    // TODO Move delete to Overview
    // Wanted:
    // TODO Let content take more space and add HelpBoxes
    // TODO Notification bubble for primary action
    // TODO Add no-content message to Result tab
    { path: `/library/corpus/${id}/status`, label: t("status") },
    { path: `/library/corpus/${id}/sources`, label: t("sources") },
    { path: `/library/corpus/${id}/config`, label: t("configuration") },
    appConfig.sharing
      ? { path: `/library/corpus/${id}/sharing`, label: t("sharing") }
      : null,
    { path: `/library/corpus/${id}/analyse`, label: t("analysis") },
    { path: `/library/corpus/${id}/exports`, label: t("result") },
    exploreTools
      ? {
          path: `/library/corpus/${id}/explore`,
          label: t("exports.tools"),
        }
      : null,
  ];

  return compact(tabs);
});
</script>

<template>
  <ResourceViewTemplate type="corpus" :id :tabs />
</template>
