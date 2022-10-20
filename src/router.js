import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import CreateCorpus from "@/views/CreateCorpus.vue";
import Corpus from "@/views/Corpus.vue";
import Overview from "@/views/Overview.vue";
import CorpusSources from "@/views/CorpusSources.vue";
import CorpusConfiguration from "@/views/CorpusConfiguration.vue";
import CorpusResult from "@/views/CorpusResult.vue";
import CorpusDelete from "@/views/CorpusDelete.vue";
import Source from "@/views/Source.vue";
import User from "@/views/User.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
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
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
