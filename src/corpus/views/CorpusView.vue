<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAppConfig } from "@/app/useAppConfig";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import ResourceViewTemplate from "@/resource/ResourceViewTemplate.vue";

const { exploreTools } = useAppConfig();
const id = useResourceIdParam();
const { t } = useI18n();

const tabs = computed(() => {
  const tabs = [
    // TODO Sharing tab
    // TODO Use #metadata etc on config page
    // TODO Make ConfigCustom make sense
    // TODO Let content take more space and add HelpBoxes
    // TODO Move delete to Overview
    // TODO Notification bubble for primary action
    // TODO Fix tab isActive for subpaths ('' -> '/overview'?)
    // TODO Do this for lexicon/metadata also
    { path: `/library/corpus/${id}`, label: t("overview") },
    { path: `/library/corpus/${id}/sources`, label: t("sources") },
    { path: `/library/corpus/${id}/config`, label: t("configuration") },
    { path: `/library/corpus/${id}/analyse`, label: t("analysis") },
    { path: `/library/corpus/${id}/exports`, label: t("result") },
  ];

  if (exploreTools)
    tabs.push({
      path: `/library/corpus/${id}/explore`,
      label: t("exports.tools"),
    });

  return tabs;
});
</script>

<template>
  <ResourceViewTemplate type="corpus" :id :tabs />
</template>
