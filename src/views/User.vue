<template>
  <PageTitle>{{ payload.name }}</PageTitle>
  <div class="my-4">
    <a :href="logoutUrl">
      <ActionButton variant="warning">{{ $t("logout") }}</ActionButton>
    </a>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import { getLogoutUrl } from "@/auth";
import { useJwt } from "@/composables/jwt";

const { payload } = useJwt();

const logoutUrl = getLogoutUrl();
</script>

<style></style>
