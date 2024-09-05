<script setup lang="ts">
import { ref } from "vue";
import { useElementSize, useToggle } from "@vueuse/core";
import { PhCaretDoubleDown, PhCaretDoubleUp } from "@phosphor-icons/vue";
import ActionButton from "./ActionButton.vue";

defineProps<{
  /** Maximum height (px). */
  maxHeight: number;
}>();

const el = ref(null);
const { height } = useElementSize(el);
const [expanded, toggleExpanded] = useToggle();
</script>

<template>
  <div>
    <!-- Outer wrapper, whose height gets limited -->
    <div
      :class="{ mask: !expanded && height > maxHeight }"
      :style="{
        // Set max height to slightly less than requested, to avoid ridiculously small differences between closed and expanded heights.
        maxHeight: !expanded ? maxHeight - 50 + 'px' : undefined,
      }"
    >
      <!-- Inner wrapper, of which height is measured (content's intrinsic height) -->
      <div ref="el">
        <slot />
      </div>
    </div>

    <div v-if="height > maxHeight" class="text-center p-2 text-sm">
      <ActionButton class="button-slim" @click="toggleExpanded()">
        <PhCaretDoubleUp v-if="expanded" class="inline mb-1 mr-0.5" />
        <PhCaretDoubleDown v-else class="inline mb-1 mr-0.5" />
        {{ expanded ? $t("expand.close") : $t("expand.open") }}
      </ActionButton>
    </div>
  </div>
</template>

<style scoped>
.mask {
  mask-image: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 4em);
}
</style>
