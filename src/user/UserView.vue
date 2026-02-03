<script setup lang="ts">
import { PhSignOut } from "@phosphor-icons/vue";
import AdminModeSwitcher from "@/user/AdminModeSwitcher.vue";
import { getLogoutUrl } from "@/api/sbauth";
import { useAuth } from "@/auth/auth.composable";
import PageTitle from "@/components/PageTitle.vue";
import UrlButton from "@/components/UrlButton.vue";
import LayoutBox from "@/components/LayoutBox.vue";

const { canUserAdmin, userName } = useAuth();
</script>

<template>
  <PageTitle>{{ userName }}</PageTitle>

  <div class="my-4">
    <UrlButton class="button-warning" :href="getLogoutUrl()">
      <PhSignOut weight="bold" class="inline mb-1 mr-1" />
      {{ $t("logout") }}
    </UrlButton>
  </div>

  <LayoutBox v-if="canUserAdmin" :title="$t('user.settings')">
    <div class="my-4">
      <AdminModeSwitcher />
    </div>
  </LayoutBox>
</template>
