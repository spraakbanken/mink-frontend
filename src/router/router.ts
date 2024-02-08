import { createRouter, createWebHistory } from "vue-router";
import routes from "./main.routes";

// Specify typing for router meta.
import "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    createTitle?: (params: RouteParams, corpusId: string) => string;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
