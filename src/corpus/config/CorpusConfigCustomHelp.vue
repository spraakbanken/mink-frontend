<script setup lang="ts">
import HelpBox from "@/components/HelpBox.vue";
</script>

<template>
  <HelpBox>
    <i18n-t scope="global" keypath="config.custom.help">
      <template #sparv>
        <a :href="$t('sparv.url')">Sparv</a>
      </template>
      <template #topic>
        <a
          href="https://spraakbanken.gu.se/sparv/#/user-manual/corpus-configuration"
        >
          Corpus Configuration
        </a>
      </template>
    </i18n-t>
  </HelpBox>
</template>
