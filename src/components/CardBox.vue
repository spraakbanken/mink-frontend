<script lang="ts" setup>
defineProps<{
  tag?: string;
  title?: string;
  titleTag?: string;
  subtitle?: string;
}>();
</script>

<template>
  <component
    :is="tag || 'div'"
    class="bg-white dark:bg-zinc-800 p-4 rounded-sm shadow"
  >
    <component v-if="title" :is="titleTag || 'h3'" class="font-semibold">
      {{ title }}
    </component>

    <div v-if="$slots.subtitle || subtitle" class="italic mb-2">
      <slot name="subtitle">
        {{ subtitle }}
      </slot>
    </div>

    <slot />
  </component>
</template>
