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
  <div class="list-none ml-4 -indent-4">
    <input
      :id="id"
      type="checkbox"
      :checked="selected"
      @change="$emit('toggle', id)"
      class="mr-2"
    />
    <label :for="id">
      <code>{{ id }}</code> –
      {{ description }}
    </label>
  </div>
</template>
