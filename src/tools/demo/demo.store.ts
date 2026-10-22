import { defineStore } from "pinia";
import { ref } from "vue";

/** Store demo data between views */
export const useDemoStore = defineStore("demo", () => {
  const source = ref("");
  return { source };
});
