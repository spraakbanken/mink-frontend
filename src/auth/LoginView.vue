<script setup lang="ts">
import PageTitle from "@/components/PageTitle.vue";
import LoginButton from "./LoginButton.vue";
</script>

<template>
  <PageTitle>{{ $t("login") }}</PageTitle>
  <p class="my-2">{{ $t("login.required") }}</p>
  <LoginButton />
</template>
