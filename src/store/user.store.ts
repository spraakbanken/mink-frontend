import { computedAsync } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { useJwtStore } from "./jwt.store";
import api from "@/api/api";

export const useUserStore = defineStore("user", () => {
  const { payload } = storeToRefs(useJwtStore());

  const userInfo = computedAsync(async () => {
    if (!payload.value) return;
    return await api.getUserInfo();
  });

  return {
    userInfo,
  };
});
