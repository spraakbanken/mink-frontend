<script setup lang="ts">
import { useRouter } from "vue-router";
import { watchImmediate } from "@vueuse/core";
import { storeToRefs } from "pinia";
import AdminResourceList from "./AdminResourceList.vue";
import PageTitle from "@/components/PageTitle.vue";
import { useResourceStore } from "@/store/resource.store";
import HelpBox from "@/components/HelpBox.vue";
import useAlert from "@/alert/alert.composable";
import { useUserStore } from "@/store/user.store";

const router = useRouter();
const resourceStore = useResourceStore();
const { adminMode } = storeToRefs(useUserStore());
const { showAlert } = useAlert();

watchImmediate(adminMode, () => {
  // adminMode is undefined initially. If it resolves to false, go to the normal Library view instead.
  if (adminMode.value) resourceStore.loadResourceIds().catch(showAlert);
  else if (adminMode.value === false) router.push("/library");
});
</script>

<template>
  <div v-if="adminMode">
    <PageTitle subtitle="admin.page.subtitle">{{ $t("resources") }}</PageTitle>

    <HelpBox>
      {{ $t("admin.resources.help") }}
    </HelpBox>

    <AdminResourceList />
  </div>
</template>
