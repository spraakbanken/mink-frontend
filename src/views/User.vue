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
import { getLogoutUrl } from "@/auth";
import { useJwt } from "@/composables/jwt";
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Panel from "@/components/layout/Panel.vue";
import AdminModeSwitcher from "@/components/AdminModeSwitcher.vue";
import useAdmin from "@/composables/admin";

const { t } = useI18n();
const { requireAuthentication, isAuthenticated, payload } = useJwt();
const { isAdmin } = useAdmin();

const logoutUrl = getLogoutUrl();

requireAuthentication();
</script>

<style></style>
