<script setup lang="ts">
import PageTitle from "@/components/PageTitle.vue";
</script>

<template>
  <PageTitle>{{ $t("notfound") }}</PageTitle>
  <p>{{ $t("notfound.description") }}</p>
  <p>{{ $t("notfound.contact") }}</p>
</template>
