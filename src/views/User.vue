<template>
  <div v-if="isAuthenticated">
    <PageTitle>{{ payload.name }}</PageTitle>
    <div class="my-4">
      <a :href="logoutUrl">
        <ActionButton variant="warning">
          <icon :icon="['fas', 'person-running']" class="mr-1" />
          {{ $t("logout") }}
        </ActionButton>
      </a>
    </div>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import { getLogoutUrl } from "@/auth";
import { useJwt } from "@/composables/jwt";

const { requireAuthentication, isAuthenticated, payload } = useJwt();

const logoutUrl = getLogoutUrl();

requireAuthentication();
</script>

<style></style>
