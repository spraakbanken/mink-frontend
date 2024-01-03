<template>
  <div v-if="isAuthenticated">
    <PageTitle>{{ payload.name }}</PageTitle>

    <div class="my-4">
      <UrlButton class="mink-warning" :href="logoutUrl">
        <icon :icon="['fas', 'person-running']" class="mr-1" />
        {{ $t("logout") }}
      </UrlButton>
    </div>

    <Panel v-if="isAdmin" :title="$t('user.settings')">
      <div class="my-4">
        <AdminModeSwitcher />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { getLogoutUrl } from "@/auth/auth";
import { useAuth } from "@/auth/auth.composable";
import useAdmin from "./admin.composable";
import AdminModeSwitcher from "./AdminModeSwitcher.vue";
import PageTitle from "@/components/PageTitle.vue";
import UrlButton from "@/components/UrlButton.vue";
import Panel from "@/components/Panel.vue";

const { requireAuthentication, isAuthenticated, payload } = useAuth();
const { isAdmin } = useAdmin();

const logoutUrl = getLogoutUrl();

requireAuthentication();
</script>

<style></style>
