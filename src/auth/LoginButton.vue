<script setup lang="ts">
import { useRoute } from "vue-router";
import { getLoginUrl } from "@/auth/auth";
import { unarray } from "@/util";
import UrlButton from "@/components/UrlButton.vue";

const route = useRoute();
</script>

<template>
  <UrlButton
    class="button-primary"
    :href="getLoginUrl(unarray(route.query.destination) || '/corpus')"
  >
    <icon :icon="['fas', 'right-to-bracket']" />
    {{ $t("login") }}
  </UrlButton>
</template>
