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
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { title: "dashboard" },
  },
  {
    path: "/login",
    component: Login,
    meta: { title: "login" },
  },
  {
    path: "/signup",
    component: Signup,
    meta: { title: "signup" },
  },
  {
    path: "/corpus",
    component: CreateCorpus,
    meta: { title: "new_corpus" },
  },
  {
    path: "/corpus/:corpusId",
    component: Corpus,
    children: [
      {
        path: "",
        component: Overview,
        meta: { createTitle: (t, corpusName) => corpusName },
      },
      {
        path: "config",
        component: CorpusConfiguration,
        meta: {
          createTitle: (t, corpusName) =>
            `${t("configuration")} – ${corpusName}`,
        },
      },
      {
        path: "sources",
        component: CorpusSources,
        meta: {
          createTitle: (t, corpusName) => `${t("texts")} – ${corpusName}`,
        },
      },
      {
        path: "sources/:filename",
        component: Source,
        props: true,
        meta: {
          createTitle: (t, corpusName, params) => params.filename,
        },
      },
      {
        path: "exports",
        component: CorpusResult,
        meta: {
          createTitle: (t, corpusName) => `${t("result")} – ${corpusName}`,
        },
      },
      {
        path: "delete",
        component: CorpusDelete,
        meta: {
          createTitle: (t, corpusName) => `${t("delete")} – ${corpusName}`,
        },
      },
    ],
  },
  {
    path: "/user",
    component: User,
    meta: { title: "account" },
  },
  {
    path: "/access-denied",
    component: AccessDenied,
    meta: { title: "accessdenied" },
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
    meta: { title: "notfound" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
