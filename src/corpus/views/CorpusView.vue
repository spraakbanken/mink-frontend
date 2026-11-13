<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { compact } from "es-toolkit";
import { useCorpus } from "../corpus.composable";
import { useAppConfig } from "@/app/useAppConfig";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ResourceViewTemplate from "@/resource/ResourceViewTemplate.vue";
import useSources from "@/resource/sources.composable";
import type { Tab } from "@/components/RouteTabs.vue";
import useResource from "@/resource/resource.composable";

const { appConfig, exploreTools } = useAppConfig();
const id = useResourceIdParam();
const { sources } = useSources("corpus", id);
const { isConfigValid } = useCorpus(id);
const { job, isRunning } = useResource<"corpus">(id);
const { t } = useI18n();

const tabs = computed<Tab[]>(() => {
  const tabs = [
    // Required:
    // TODO Do this for lexicon/metadata also
    // Wanted:
    // TODO Let content take more space and add HelpBoxes
    {
      path: `/library/corpus/${id}/status`,
      label: t("status"),
      loading: isRunning.value,
    },
    {
      path: `/library/corpus/${id}/sources`,
      label: t("sources"),
      error: !sources.value.length,
    },
    {
      path: `/library/corpus/${id}/config`,
      label: t("configuration"),
      error: !isConfigValid.value,
    },
    appConfig.sharing
      ? { path: `/library/corpus/${id}/sharing`, label: t("sharing") }
      : null,
    {
      path: `/library/corpus/${id}/analyse`,
      label: t("analysis"),
      error: job.value?.status.sparv == "error",
    },
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
