import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import CreateCorpus from "@/views/CreateCorpus.vue";
import Corpus from "@/views/Corpus.vue";
import CorpusMetadata from "@/views/CorpusMetadata.vue";
import CorpusSources from "@/views/CorpusSources.vue";
import CorpusConfiguration from "@/views/CorpusConfiguration.vue";
import CorpusResult from "@/views/CorpusResult.vue";
import CorpusJob from "@/views/CorpusJob.vue";
import Source from "@/views/Source.vue";
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
      { path: "config", component: CorpusConfiguration },
      { path: "sources", component: CorpusSources },
      {
        path: "sources/:filename",
        component: Source,
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

export default router;
