<script setup lang="ts">
import ActionButton from "@/components/ActionButton.vue";
import { useToggle } from "@vueuse/core";

defineProps<{
  text: string;
  height?: number;
}>();

const [expanded, toggleExpanded] = useToggle();
</script>

<template>
  <div
    class="relative bg-zinc-700 dark:bg-zinc-600 rounded shadow-inner text-sm"
  >
    <div class="absolute z-10 bottom-2 right-2 flex gap-2">
      <ActionButton @click="toggleExpanded()">
        <template v-if="expanded">
          <icon :icon="['far', 'square-minus']" class="mr-1" />
          {{ $t("expand.close") }}
        </template>
        <template v-else>
          <icon :icon="['far', 'square-plus']" class="mr-1" />
          {{ $t("expand.open") }}
        </template>
      </ActionButton>

      <slot name="controls" />
    </div>
    <div
      class="text-white overflow-hidden font-mono text-xs p-2 pb-10 whitespace-pre-wrap [overflow-wrap:anywhere]"
      :class="{ [`collapsed h-${height || 40}`]: !expanded }"
    >
      {{ expanded ? text : text.slice(0, 800) }}
    </div>
  </div>
</template>

<style scoped>
.collapsed {
  mask-image: linear-gradient(black 50%, transparent);
}
</style>
