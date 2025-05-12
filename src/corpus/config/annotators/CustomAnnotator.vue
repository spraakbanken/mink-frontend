<script lang="ts" setup>
import { PhPlusSquare } from "@phosphor-icons/vue";

defineProps<{
  func: string;
  description: string;
  selected: boolean;
}>();

defineEmits<{
  (e: "add"): void;
}>();
</script>

<template>
  <div class="cursor-pointer has-checked:bg-sky-400/10" @click="$emit('add')">
    <div class="ml-5 -indent-5">
      <input type="checkbox" class="hidden" :checked="selected" />
      <PhPlusSquare class="text-sm inline mr-1.5" />
      <code>{{ func }}</code> –
      {{ description }}
    </div>
  </div>
</template>
