<script setup lang="ts">
import { ref, watch } from "vue";
import { computedAsync, useSessionStorage } from "@vueuse/core";
import {
  loadMetadataSchema,
  loadTemplateMemoized,
  ResourceType,
} from "./metadataEditor";
import LayoutBox from "@/components/LayoutBox.vue";
import HelpBox from "@/components/HelpBox.vue";
import PageTitle from "@/components/PageTitle.vue";
import YamlEditor from "@/components/YamlEditor.vue";

/** YAML input stored in the session: separate across tabs, survives reloads */
const yaml = useSessionStorage<string>("mink-metadata-editor-yaml", "");

const selectedType = ref<ResourceType>();
const schema = computedAsync(loadMetadataSchema);

// When selecting a template type, load the template.
watch(selectedType, async () => {
  if (selectedType.value) {
    yaml.value = await loadTemplateMemoized(selectedType.value);
    selectedType.value = undefined;
  }
});
</script>

<template>
  <div>
    <PageTitle>{{ $t("metadata_editor") }}</PageTitle>

    <HelpBox class="my-4">
      <i18n-t keypath="metadata_editor.help" scope="global">
        <template #repository>
          <a :href="$t('metadata_editor.help.repository.url')" target="_blank">
            {{ $t("metadata_editor.help.repository.label") }}
          </a>
        </template>
        <template #info>
          <a :href="$t('metadata_editor.help.info.url')" target="_blank">
            {{ $t("metadata_editor.help.info.label") }}
          </a>
        </template>
      </i18n-t>
    </HelpBox>

    <div class="flex flex-wrap gap-4 items-start">
      <LayoutBox class="w-xl grow">
        <YamlEditor v-model="yaml" :schema>
          <template #toolbar>
            <!-- Load template -->
            <div>
              <select v-model="selectedType">
                <option :value="undefined" disabled>
                  {{ $t("metadata_editor.load_template") }}
                </option>
                <option v-for="type in ResourceType" :key="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </template>
        </YamlEditor>
      </LayoutBox>
    </div>
  </div>
</template>
