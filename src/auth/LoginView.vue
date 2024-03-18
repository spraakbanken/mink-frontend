<script setup lang="ts">
import LoginButton from "@/auth/LoginButton.vue";
import PageTitle from "@/components/PageTitle.vue";
</script>

<template>
  <PageTitle>{{ $t("login") }}</PageTitle>
  <p class="my-2">{{ $t("login.required") }}</p>
  <LoginButton />
</template>
