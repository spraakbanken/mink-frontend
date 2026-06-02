<script setup lang="ts">
import { useAppConfig } from "@/app/useAppConfig";
import HelpBox from "@/components/HelpBox.vue";
import useNotFound from "@/components/notfound.composable";
import PageTitle from "@/components/PageTitle.vue";

const { tools } = useAppConfig();
const { showNotFoundPage } = useNotFound();

// Show 404 if no tools are enabled
if (!tools.length) showNotFoundPage();
</script>

<template>
  <PageTitle>{{ $t("tools") }}</PageTitle>

  <ul class="flex flex-col gap-4">
    <li>
      <HelpBox v-if="tools.includes('metadataEditor')">
        <h3 class="text-3xl">
          <router-link to="/tools/metadata-editor">
            {{ $t("metadata_editor") }}
          </router-link>
        </h3>
        <p>
          {{ $t("metadata_editor.summary") }}
        </p>
      </HelpBox>
    </li>
  </ul>
</template>
