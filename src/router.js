import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import { createRouter, createWebHistory } from "vue-router";
import store from "./store";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  // If not authenticated, redirect to login page.
  if (to.path != "/login" && !store.state.user) return "/login";
});

export default router;
