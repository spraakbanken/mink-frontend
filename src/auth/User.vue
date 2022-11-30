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

    <Panel v-if="isAdmin" :title="t('user.settings')">
      <div class="my-4">
        <AdminModeSwitcher />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { getLogoutUrl } from "./auth";
import { useJwt } from "./jwt.composable";
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/ActionButton.vue";
import Panel from "@/components/Panel.vue";
import AdminModeSwitcher from "@/admin/AdminModeSwitcher.vue";
import useAdmin from "@/admin/admin.composable";

const { t } = useI18n();
const { requireAuthentication, isAuthenticated, payload } = useJwt();
const { isAdmin } = useAdmin();

const logoutUrl = getLogoutUrl();

requireAuthentication();
</script>

<style></style>
