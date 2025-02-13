<script setup lang="ts">
import { ref } from "vue";
import { PhMinusSquare, PhPlusSquare } from "@phosphor-icons/vue";
import ActionButton from "./ActionButton.vue";

defineProps<{
  collapsible?: boolean;
  title?: string;
}>();

const collapsed = ref(false);
</script>

<template>
  <section
    class="relative border rounded-sm p-2 bg-white dark:bg-zinc-900 dark:border-zinc-700 overflow-hidden"
  >
    <div class="flex justify-between mb-2">
      <h2 v-if="title" class="text-xl font-semibold uppercase">{{ title }}</h2>
      <div class="grow cursor-pointer" @click="collapsed = !collapsed" />
      <div class="items-baseline justify-end gap-2 text-sm">
        <slot name="controls" />

        <ActionButton
          v-if="collapsible"
          @click="collapsed = !collapsed"
          class="button-mute"
        >
          <PhPlusSquare v-if="collapsed" class="inline mr-1" />
          <PhMinusSquare v-else class="inline mr-1" />
          {{ collapsed ? "Open" : "Close" }}
        </ActionButton>
      </div>
    </div>

    <div v-show="!collapsible || !collapsed">
      <slot />
    </div>
  </section>
</template>
