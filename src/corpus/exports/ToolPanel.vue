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
  <div class="flex gap-2 my-2 justify-between items-baseline">
    <div>
      <h3 class="font-bold">{{ name }}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ info }}
        <a v-if="linkUrl && linkText" :href="linkUrl">
          <ActionButton class="slim mute">
            {{ linkText }}
          </ActionButton>
        </a>
      </p>
    </div>

    <div class="flex flex-wrap gap-2 justify-end">
      <ActionButton
        :variant="canInstall && !isInstalled ? 'primary' : null"
        :disabled="!canInstall"
        class="whitespace-nowrap"
        @click="canInstall ? $emit('install') : null"
      >
        {{
          $t(!isInstalled ? "exports.tools.install" : "exports.tools.reinstall")
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
</template>
