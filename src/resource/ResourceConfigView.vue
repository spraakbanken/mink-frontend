<script lang="ts" setup>
import RouteTabs from "@/components/RouteTabs.vue";
</script>

<template>
  <div>
    <RouteTabs
      :routes="[
        { path: 'form', label: $t('config.form') },
        { path: 'custom', label: $t('config.custom') },
      ]"
      class="mb-2 border-b border-zinc-300 dark:border-zinc-700"
    />
    <router-view />
  </div>
</template>
