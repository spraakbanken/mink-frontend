import { createRouter, createWebHistory } from "vue-router";
import { checkJwt } from "@/auth/sbAuth";
import routes from "@/router/main.routes";

// Specify typing for router meta.
import "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    createTitle?: (
      params: RouteParams,
      resourceName?: string,
    ) => string | undefined;
    /** Require authentication to view page. */
    protected?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  // For protected routes, require authentication by checking JWT.
  if (to.meta.protected) {
    const jwt = await checkJwt();
    // If not authenticated, redirect to login page.
    if (!jwt) return { path: "/login", query: { destination: to.fullPath } };
  }
});

export default router;
