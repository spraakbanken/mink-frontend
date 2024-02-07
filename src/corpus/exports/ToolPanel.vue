<script setup lang="ts">
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
}>();
</script>

<template>
  <div class="flex flex-col gap-2 my-4">
    <div class="flex flex-wrap gap-2 justify-between items-baseline">
      <h3 class="font-bold">{{ name }}</h3>

      <div class="flex gap-2 justify-end">
        <ActionButton
          :disabled="!canInstall"
          class="whitespace-nowrap"
          :class="{ 'button-primary': canInstall && !isInstalled }"
          @click="$emit('install')"
        >
          {{
            $t(
              !isInstalled
                ? "exports.tools.install"
                : "exports.tools.reinstall",
            )
          }}
        </ActionButton>

        <UrlButton
          :href="showUrl"
          target="_blank"
          :disabled="!isInstalled"
          class="button-primary"
        >
          {{ $t("exports.tools.view") }}
        </UrlButton>
      </div>
    </div>

    <div class="text-sm text-gray-500 dark:text-gray-400">
      <div>{{ info }}</div>
      <a v-if="linkUrl && linkText" :href="linkUrl">
        {{ linkText }}
      </a>
    </div>
  </div>
</template>
