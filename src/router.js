import { createRouter, createWebHistory } from "vue-router";
import store from "./store";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Corpus from "@/views/Corpus.vue";
import CreateCorpus from "@/views/CreateCorpus.vue";
import ConfigureJob from "@/views/ConfigureJob.vue";
import User from "@/views/User.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/corpus", component: CreateCorpus },
  { path: "/corpus/:corpusId", component: Corpus },
  { path: "/corpus/:corpusId/config", component: ConfigureJob },
  { path: "/user", component: User },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  // If not authenticated, redirect to login page.
  if (to.path != "/login" && !store.state.auth) return "/login";
});

export default router;
