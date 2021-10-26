import { createRouter, createWebHistory } from "vue-router";
import store from "./store";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import CreateCorpus from "@/views/CreateCorpus.vue";
import Corpus from "@/views/Corpus.vue";
import CorpusMetadata from "@/views/CorpusMetadata.vue";
import CorpusSources from "@/views/CorpusSources.vue";
import CorpusConfiguration from "@/views/CorpusConfiguration.vue";
import CorpusJob from "@/views/CorpusJob.vue";
import User from "@/views/User.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/corpus", component: CreateCorpus },
  {
    path: "/corpus/:corpusId",
    component: Corpus,
    children: [
      {
        path: "",
        component: CorpusMetadata,
      },
      { path: "sources", component: CorpusSources },
      { path: "config", component: CorpusConfiguration },
      { path: "status", component: CorpusJob },
    ],
  },
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
