<script setup lang="ts">
import { PhSignOut } from "@phosphor-icons/vue";
import AdminModeSwitcher from "@/user/AdminModeSwitcher.vue";
import { getLogoutUrl } from "@/auth/sbAuth";
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
        <PhSignOut weight="bold" class="inline mb-1 mr-1" />
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
