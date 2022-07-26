<template>
  <PageTitle>{{ $t("login") }}</PageTitle>
  <p class="my-2">{{ $t("login.required") }}</p>
  <LoginButton />
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import LoginButton from "../components/LoginButton.vue";
</script>
