<script setup lang="ts">
import logo from "@/assets/mink.svg";
import logoLight from "@/assets/mink-light.svg";

defineProps<{
  large: boolean;
}>();
</script>

<template>
  <!-- Wrap img with picutre+source to select file depending on light/dark mode -->
  <picture>
    <source media="(prefers-color-scheme: dark)" :srcset="logoLight" />
    <img :src="logo" :alt="$t('logo.alt')" :class="[large ? 'h-24' : 'h-16']" />
  </picture>
</template>
