<script setup lang="ts">
import { PhFloppyDisk, PhLock, PhWarning } from "@phosphor-icons/vue";
import { computed, defineAsyncComponent, ref, watchEffect } from "vue";
import { computedAsync } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import HelpBox from "@/components/HelpBox.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import useMessenger from "@/message/messenger.composable";
import PendingContent from "@/spin/PendingContent.vue";
import { useAuth } from "@/auth/auth.composable";
import ActionButton from "@/components/ActionButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import { useConfigStore } from "@/store/config.store";
import type { ResourceType } from "@/api/api.types";

const props = defineProps<{
  type: ResourceType;
  id: string;
  schema?: object;
}>();

const { loadConfig, uploadConfig } = useConfigStore();
const { alertError } = useMessenger();
const { canWrite } = useAuth();
const { t } = useI18n();

// TODO Use store `configs` so it's reloaded
const config = computedAsync(() => loadConfig(props.type, props.id));

const YamlEditor = defineAsyncComponent(
  () => import("@/editor/YamlEditor.vue"),
);

const input = ref(config.value || "");
const isValid = ref(true);

/** Reactively check if content is OK to save, and otherwise give a reason why not */
const saveErrorMessage = computed(() => {
  if (input.value == config.value) return t("save.no_changes");
  if (!isValid.value) return t("save.invalid");
  return "";
});

/** Assign YAML content to input whenever it is loaded */
watchEffect(() => (input.value = config.value || ""));

/** Save current input as config by uploading it */
async function upload() {
  await uploadConfig(props.type, props.id, input.value).catch(alertError);
}
</script>

<template>
  <LayoutSection :title="$t('config.custom')">
    <slot name="head" />

    <HelpBox v-if="!canWrite(type, id)">
      <PhLock class="inline mb-0.5 mr-1" />
      {{ $t("resource.access_denied") }}
    </HelpBox>

    <template v-else>
      <HelpBox important>
        <PhWarning class="inline mb-1 mr-1" />
        {{ $t("config.custom.upload.caution") }}
      </HelpBox>

      <HelpBox important>
        <PhWarning class="inline mb-1 mr-1" />
        {{ $t("config.custom.upload.overwrite") }}
      </HelpBox>
    </template>

    <LayoutBox>
      <PendingContent :on="`${id}/config`">
        <YamlEditor
          v-if="config"
          v-model="input"
          :disabled="!canWrite(type, id)"
          :schema
          @validated="isValid = $event"
        >
          <template #toolbar-right>
            <ActionButton
              @click="upload"
              class="button-primary"
              :disabled="!!saveErrorMessage"
              :title="saveErrorMessage"
            >
              <PhFloppyDisk class="inline mb-0.5 mr-1" />
              {{ $t("save") }}
            </ActionButton>
          </template>
        </YamlEditor>
      </PendingContent>
    </LayoutBox>
  </LayoutSection>
</template>
