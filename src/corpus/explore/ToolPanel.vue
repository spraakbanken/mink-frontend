<script setup lang="ts">
import { PhArrowSquareOut, PhGearFine, PhTrash } from "@phosphor-icons/vue";
import ActionButton from "@/components/ActionButton.vue";
import UrlButton from "@/components/UrlButton.vue";

defineProps<{
  name: string;
  info: string;
  canInstall?: boolean;
  isInstalled?: boolean;
  showUrl: string;
  linkUrl?: string;
  linkText?: string;
}>();
defineEmits<{
  (e: "install"): void;
  (e: "uninstall"): void;
}>();
</script>

<template>
  <div class="flex gap-3 items-center">
    <div class="flex-1 self-start">
      <h3 class="font-semibold">{{ name }}</h3>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        <div>{{ info }}</div>
        <a v-if="linkUrl && linkText" :href="linkUrl" target="_blank">
          {{ linkText }}
        </a>
      </div>
    </div>

    <div class="flex flex-col gap-2 items-end">
      <UrlButton
        v-if="isInstalled"
        :href="showUrl"
        target="_blank"
        class="button-primary"
      >
        <PhArrowSquareOut weight="bold" class="inline mb-1 mr-1" />
        {{ $t("exports.tools.view") }}
      </UrlButton>

      <ActionButton
        :disabled="!canInstall"
        class="whitespace-nowrap"
        :class="{ 'button-primary': canInstall && !isInstalled }"
        @click="$emit('install')"
      >
        <PhGearFine weight="bold" class="inline mb-1 mr-1" />
        {{
          $t(!isInstalled ? "exports.tools.install" : "exports.tools.reinstall")
        }}
      </ActionButton>

      <ActionButton
        v-if="isInstalled"
        :disabled="!canInstall"
        class="whitespace-nowrap button-mute button-danger"
        @click="$emit('uninstall')"
      >
        <PhTrash weight="bold" class="inline mb-1 mr-1" />
        {{ $t("exports.tools.uninstall") }}
      </ActionButton>
    </div>
  </div>
</template>
