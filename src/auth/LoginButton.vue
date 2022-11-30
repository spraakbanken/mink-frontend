<template>
  <a :href="getLoginUrl(route.query.destination)">
    <ActionButton variant="primary">
      <icon :icon="['fas', 'right-to-bracket']" />
      {{ $t("login") }}
    </ActionButton>
  </a>
</template>

<script setup>
import { useRoute } from "vue-router";
import { getLoginUrl } from "@/auth/auth";
import ActionButton from "@/components/ActionButton.vue";

const route = useRoute();
</script>
