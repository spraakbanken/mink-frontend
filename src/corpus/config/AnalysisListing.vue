<script setup lang="ts">
import { analysisListing, type AnnotationGroup } from "@/api/analysis";

const props = defineProps<{ group: AnnotationGroup }>();

const ids = analysisListing[props.group];
</script>

<template>
  <details class="prose">
    <summary>{{ $t("annotations.analyses", ids.length) }}</summary>
    <ul>
      <li v-for="id in ids" :key="id">
        <a :href="$t('annotations.analyses.url', [id])" target="_blank">
          {{ id }}
        </a>
      </li>
    </ul>
  </details>
</template>
