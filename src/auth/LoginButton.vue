<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { PhSignIn } from "@phosphor-icons/vue";
import { whenever } from "@vueuse/core";
import { useAuth } from "./auth.composable";
import { getLoginUrl } from "@/auth/sbAuth";
import { unarray } from "@/util";
import UrlButton from "@/components/UrlButton.vue";

const route = useRoute();
const router = useRouter();
const { isAuthenticated } = useAuth();

whenever(isAuthenticated, () => {
  const destination = unarray(route.query.destination);
  router.push(destination || "/corpus");
});
</script>

<template>
  <UrlButton
    class="button-primary"
    :href="getLoginUrl(unarray(route.query.destination) || '/corpus')"
  >
    <PhSignIn weight="bold" class="inline mb-1 mr-1" />
    {{ $t("login") }}
  </UrlButton>
</template>
