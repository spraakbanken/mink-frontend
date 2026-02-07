<script setup lang="ts">
import { defineAsyncComponent, ref, useTemplateRef, watch } from "vue";
import { computedAsync, useSessionStorage } from "@vueuse/core";
import { PhFloppyDisk } from "@phosphor-icons/vue";
import {
  loadMetadataSchema,
  loadTemplate,
  ResourceType,
} from "./metadataEditor";
import LayoutBox from "@/components/LayoutBox.vue";
import HelpBox from "@/components/HelpBox.vue";
import PageTitle from "@/components/PageTitle.vue";
import { downloadFile, randomString, removeExtension } from "@/util";
import ActionButton from "@/components/ActionButton.vue";

// Data stored in the session: separate across tabs, survives reloads
const name = useSessionStorage<string>("metadataEditor.name", randomString);
const yaml = useSessionStorage<string>("metadataEditor.yaml", "");

const YamlEditor = defineAsyncComponent(
  () => import("@/editor/YamlEditor.vue"),
);

const isValid = ref(true);
const isNameValid = ref(true);
const nameInput = useTemplateRef("nameInput");
const selectedType = ref<ResourceType>();
const schema = computedAsync(loadMetadataSchema);

// When selecting a template type, load the template.
watch(selectedType, async () => {
  if (selectedType.value) {
    yaml.value = await loadTemplate(selectedType.value);
    selectedType.value = undefined;
  }
});

function validateName() {
  isNameValid.value = nameInput.value?.checkValidity() ?? false;
}

/** Trigger download of current YAML content. */
function save() {
  downloadFile(yaml.value, `${name.value}.yaml`);
}
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
        <YamlEditor
          v-model="yaml"
          :schema
          @open="name = removeExtension($event)"
          @validated="isValid = $event"
        >
          <template #toolbar-left>
            <!-- Load template -->
            <select v-model="selectedType">
              <option :value="undefined" disabled>
                {{ $t("metadata_editor.load_template") }}
              </option>
              <option v-for="type in ResourceType" :key="type">
                {{ type }}
              </option>
            </select>
          </template>

          <template #toolbar-right>
            <!-- Filename -->
            <div>
              {{ $t("identifier") }}:
              <input
                ref="nameInput"
                type="text"
                v-model="name"
                size="12"
                pattern="[a-z0-9_\-]+"
                required
                @input="validateName()"
              />
              .yaml
            </div>

            <!-- Save -->
            <ActionButton
              @click="save()"
              :class="{ 'button-primary': yaml && isValid && isNameValid }"
              :disabled="!yaml || !isNameValid"
            >
              <PhFloppyDisk class="inline mb-0.5 mr-1" />
              {{ $t("save") }}
            </ActionButton>
          </template>
        </YamlEditor>
      </LayoutBox>
    </div>
  </div>
</template>
