<template>
  <UrlButton
    variant="primary"
    :href="getLoginUrl(route.query.destination || '/corpus')"
  >
    <icon :icon="['fas', 'right-to-bracket']" />
    {{ $t("login") }}
  </UrlButton>
</template>

<script setup>
import { useRoute } from "vue-router";
import { getLoginUrl } from "./auth";
import UrlButton from "@/components/UrlButton.vue";

const route = useRoute();
</script>
