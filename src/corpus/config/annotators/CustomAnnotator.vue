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
    <div class="list-none ml-4 -indent-4">
      <input type="checkbox" class="hidden" :checked="selected" />
      <PhPlusSquare class="text-sm inline -ml-0.5 mr-1" />
      <code>{{ func }}</code> –
      {{ description }}
    </div>
  </div>
</template>
