import { createRouter, createWebHistory } from "vue-router";
import Home from "@/home/Home.vue";
import Dashboard from "@/corpora/Dashboard.vue";
import Login from "@/auth/Login.vue";
import Signup from "@/auth/Signup.vue";
import CreateCorpus from "@/corpora/CreateCorpus.vue";
import Corpus from "@/corpus/Corpus.vue";
import Overview from "@/corpus/Overview.vue";
import CorpusSources from "@/corpus/sources/CorpusSources.vue";
import CorpusConfiguration from "@/corpus/config/CorpusConfiguration.vue";
import CorpusResult from "@/corpus/exports/CorpusResult.vue";
import CorpusDelete from "@/corpus/CorpusDelete.vue";
import Source from "@/corpus/sources/Source.vue";
import User from "@/user/User.vue";
import AccessDenied from "@/auth/AccessDenied.vue";
import NotFound from "@/NotFound.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/dashboard", component: Dashboard },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/corpus", component: CreateCorpus },
  {
    path: "/corpus/:corpusId",
    component: Corpus,
    children: [
      { path: "", component: Overview },
      { path: "config", component: CorpusConfiguration },
      { path: "sources", component: CorpusSources },
      {
        path: "sources/:filename",
        component: Source,
        props: true,
      },
      { path: "exports", component: CorpusResult },
      { path: "delete", component: CorpusDelete },
    ],
  },
  { path: "/user", component: User },
  { path: "/access-denied", component: AccessDenied },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
