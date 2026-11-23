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
import type { Tab } from "@/components/RouteTabs.vue";
import useResource from "@/resource/resource.composable";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ResourceViewTemplate from "@/resource/ResourceViewTemplate.vue";
import useSources from "@/resource/sources.composable";
import { useAppConfig } from "@/app/useAppConfig";

const { exploreTools } = useAppConfig();
const id = useResourceIdParam();
const { sources } = useSources("lexicon", id);
const { job, isRunning } = useResource<"lexicon">(id);
const { t } = useI18n();

const tabs = computed<Tab[]>(() => {
  const tabs = [
    {
      path: `/library/lexicon/${id}/status`,
      label: t("status"),
      icon: PhChecks,
      loading: isRunning.value,
    },
    {
      path: `/library/lexicon/${id}/sources`,
      label: t("sources"),
      icon: PhFiles,
      error: !sources.value.length,
    },
    {
      path: `/library/lexicon/${id}/config`,
      label: t("configuration"),
      icon: PhWrench,
    },
    {
      path: `/library/lexicon/${id}/analyse`,
      label: t("analysis"),
      icon: PhGearFine,
      error: job.value?.status.karp_pipeline == "error",
    },
    {
      path: `/library/lexicon/${id}/exports`,
      icon: PhDownloadSimple,
      label: t("result"),
    },
    exploreTools
      ? {
          path: `/library/lexicon/${id}/explore`,
          label: t("exports.tools"),
          icon: PhMagnifyingGlass,
        }
      : null,
  ];

  return compact(tabs);
});
</script>

<template>
  <ResourceViewTemplate type="lexicon" :id :tabs />
</template>
