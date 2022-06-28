<template>
  <PageTitle>{{ $t("login") }}</PageTitle>
  <p class="my-2">{{ $t("login.required") }}</p>
  <ActionButton variant="primary" @click="gotoLogin">
    <icon :icon="['fas', 'right-to-bracket']" />
    {{ $t("login") }}
  </ActionButton>
</template>

<script setup>
import { getLoginUrl } from "@/auth";
import { useRoute } from "vue-router";
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";

const route = useRoute();

function gotoLogin() {
  window.location.href = getLoginUrl(route.query.destination);
}
</script>
