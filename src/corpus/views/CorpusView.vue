<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { compact } from "es-toolkit";
import {
  PhChecks,
  PhDownloadSimple,
  PhFiles,
  PhGearFine,
  PhMagnifyingGlass,
  PhWrench,
} from "@phosphor-icons/vue";
import { useCorpus } from "../corpus.composable";
import { useAppConfig } from "@/app/useAppConfig";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ResourceViewTemplate from "@/resource/ResourceViewTemplate.vue";
import useSources from "@/resource/sources.composable";
import type { Tab } from "@/components/RouteTabs.vue";
import useResource from "@/resource/resource.composable";

const { exploreTools } = useAppConfig();
const id = useResourceIdParam();
const { sources } = useSources("corpus", id);
const { isConfigValid } = useCorpus(id);
const { currentStatus, isRunning } = useResource<"corpus">(id);
const { t } = useI18n();

const tabs = computed<Tab[]>(() => {
  const tabs = [
    {
      path: `/library/corpus/${id}/status`,
      label: t("status"),
      icon: PhChecks,
      loading: isRunning.value,
      error: currentStatus.value == "error",
    },
    {
      path: `/library/corpus/${id}/sources`,
      label: t("sources"),
      icon: PhFiles,
      error: !sources.value.length,
    },
    {
      path: `/library/corpus/${id}/config`,
      label: t("configuration"),
      icon: PhWrench,
      error: !isConfigValid.value,
    },
    {
      path: `/library/corpus/${id}/analyse`,
      label: t("analysis"),
      icon: PhGearFine,
    },
    {
      path: `/library/corpus/${id}/exports`,
      icon: PhDownloadSimple,
      label: t("result"),
    },
    exploreTools.length
      ? {
          path: `/library/corpus/${id}/explore`,
          label: t("exports.tools"),
          icon: PhMagnifyingGlass,
        }
      : null,
  ];

  return compact(tabs);
});
</script>

<template>
  <ResourceViewTemplate type="corpus" :id :tabs />
</template>
