<script setup lang="ts">
import { PhSignOut } from "@phosphor-icons/vue";
import { storeToRefs } from "pinia";
import AdminModeSwitcher from "@/user/AdminModeSwitcher.vue";
import { getLogoutUrl } from "@/api/sbauth";
import PageTitle from "@/components/PageTitle.vue";
import UrlButton from "@/components/UrlButton.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import { useUserStore } from "@/store/user.store";
import { useJwtStore } from "@/store/jwt.store";

const { userName } = storeToRefs(useJwtStore());
const { userInfo } = useUserStore();
</script>

<template>
  <PageTitle>{{ userName }}</PageTitle>

  <div class="my-4">
    <UrlButton class="button-warning" :href="getLogoutUrl()">
      <PhSignOut weight="bold" class="inline mb-1 mr-1" />
      {{ $t("logout") }}
    </UrlButton>
  </div>

  <LayoutBox v-if="userInfo?.is_admin" :title="$t('user.settings')">
    <div class="my-4">
      <AdminModeSwitcher />
    </div>
  </LayoutBox>
</template>
