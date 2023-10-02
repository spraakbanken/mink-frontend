<script setup>
import ActionButton from "@/components/ActionButton.vue";

defineProps([
  "name",
  "info",
  "link-url",
  "link-text",
  "can-install",
  "is-installed",
  "show-url",
]);
defineEmits(["install"]);
</script>

<template>
  <div class="flex flex-col gap-2 my-4">
    <div class="flex flex-wrap gap-2 justify-between items-baseline">
      <h3 class="font-bold">{{ name }}</h3>

      <div class="flex gap-2 justify-end">
        <ActionButton
          :variant="canInstall && !isInstalled ? 'primary' : null"
          :disabled="!canInstall"
          class="whitespace-nowrap"
          @click="canInstall ? $emit('install') : null"
        >
          {{
            $t(
              !isInstalled ? "exports.tools.install" : "exports.tools.reinstall"
            )
          }}
        </ActionButton>

        <a v-if="isInstalled" :href="showUrl" target="_blank">
          <ActionButton variant="primary">
            {{ $t("exports.tools.view") }}
          </ActionButton>
        </a>
        <ActionButton v-else disabled>
          {{ $t("exports.tools.view") }}
        </ActionButton>
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
