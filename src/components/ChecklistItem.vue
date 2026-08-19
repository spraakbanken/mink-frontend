<script lang="ts" setup>
import { PhCheckFat, PhMinus, PhWarningOctagon } from "@phosphor-icons/vue";

export type ChecklistItemStatus = "none" | "success" | "warning" | "error";

defineProps<{
  status?: ChecklistItemStatus;
}>();
</script>

<template>
  <div class="flex justify-between">
    <div class="shrink me-2">
      <!-- Status icon -->
      <PhCheckFat
        v-if="status == 'success'"
        class="inline mb-1 me-1 text-lime-600"
      />
      <PhWarningOctagon
        v-else-if="status == 'error'"
        class="inline mb-1 me-1 text-red-600 dark:text-red-400"
      />
      <PhMinus v-else class="inline mb-1 me-1" />

      <!-- Label -->
      <slot />
    </div>

    <div>
      <!-- Optional actions -->
      <slot name="actions" />
    </div>
  </div>
</template>
