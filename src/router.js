import { createRouter, createWebHistory } from "vue-router";
import store from "./store";
import Home from "@/views/Home.vue";
import CreateCorpus from "@/views/CreateCorpus.vue";
import Corpus from "@/views/Corpus.vue";
import CorpusMetadata from "@/views/CorpusMetadata.vue";
import CorpusSources from "@/views/CorpusSources.vue";
import CorpusConfiguration from "@/views/CorpusConfiguration.vue";
import CorpusResult from "@/views/CorpusResult.vue";
import CorpusJob from "@/views/CorpusJob.vue";
import User from "@/views/User.vue";
import { checkLogin, getLoginUrl } from "./auth";

const routes = [
  { path: "/", component: Home },
  { path: "/corpus", component: CreateCorpus },
  {
    path: "/corpus/:corpusId",
    component: Corpus,
    children: [
      {
        path: "",
        component: CorpusMetadata,
      },
      { path: "config", component: CorpusConfiguration },
      { path: "sources", component: CorpusSources },
      {
        path: "sources/:filename",
        component: () =>
          import(/* webpackChunkName: source */ "@/views/Source.vue"),
        props: true,
      },
      { path: "status", component: CorpusJob },
      { path: "exports", component: CorpusResult },
    ],
  },
  { path: "/user", component: User },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async () => {
  // Always ensure authentication.
  if (!store.state.jwt) {
    // Fetch JWT.
    const jwt = await checkLogin();
    // No token, user authentication needed.
    if (!jwt) {
      window.location.href = getLoginUrl();
    }
    // Store JWT for subsequent navigation.
    store.commit("setJwt", jwt);
  }
});

export default router;
