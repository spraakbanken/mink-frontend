<script setup lang="ts">
import { useRoute } from "vue-router";
import { PhSignIn } from "@phosphor-icons/vue";
import { getLoginUrl } from "@/auth/sbAuth";
import { unarray } from "@/util";
import UrlButton from "@/components/UrlButton.vue";

const route = useRoute();
</script>

<template>
  <UrlButton
    class="button-primary"
    :href="getLoginUrl(unarray(route.query.destination) || '/corpus')"
  >
    <PhSignIn class="inline mb-1" />
    {{ $t("login") }}
  </UrlButton>
</template>
