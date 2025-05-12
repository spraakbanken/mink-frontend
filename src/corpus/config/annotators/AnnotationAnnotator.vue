<script lang="ts" setup>
defineProps<{
  id: string;
  description: string;
  selected: boolean;
}>();

defineEmits<{
  (e: "toggle", id: string): void;
}>();
</script>

<template>
  <label class="block ml-5 -indent-5">
    <input
      type="checkbox"
      :checked="selected"
      @change="$emit('toggle', id)"
      class="mr-2"
    />
    <code>{{ id }}</code>
    <span v-if="description" class="text-sm opacity-80">
      <br />
      {{ description }}
    </span>
  </label>
</template>
