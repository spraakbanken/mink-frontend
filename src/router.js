import Home from "./views/Home.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [{ path: "/", component: Home }];

export default createRouter({
  history: createWebHistory(),
  routes,
});
