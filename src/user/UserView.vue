<script setup lang="ts">
import AdminModeSwitcher from "@/user/AdminModeSwitcher.vue";
import { getLogoutUrl } from "@/auth/auth";
import { useAuth } from "@/auth/auth.composable";
import PageTitle from "@/components/PageTitle.vue";
import UrlButton from "@/components/UrlButton.vue";
import LayoutBox from "@/components/LayoutBox.vue";

const { requireAuthentication, isAuthenticated, payload, canUserAdmin } =
  useAuth();

const logoutUrl = getLogoutUrl();

requireAuthentication();
</script>

<template>
  <div v-if="payload && isAuthenticated">
    <PageTitle>{{ payload.name }}</PageTitle>

    <div class="my-4">
      <UrlButton class="button-warning" :href="logoutUrl">
        <icon :icon="['fas', 'person-running']" class="mr-1" />
        {{ $t("logout") }}
      </UrlButton>
    </div>

    <LayoutBox v-if="canUserAdmin" :title="$t('user.settings')">
      <div class="my-4">
        <AdminModeSwitcher />
      </div>
    </LayoutBox>
  </div>
</template>
