import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomeView from "@/home/HomeView.vue";
import LibraryView from "@/corpora/LibraryView.vue";
import LoginView from "@/auth/LoginView.vue";
import SignupView from "@/auth/SignupView.vue";
import CreateCorpus from "@/corpora/CreateCorpus.vue";
import CorpusView from "@/corpus/CorpusView.vue";
import CorpusOverview from "@/corpus/CorpusOverview.vue";
import CorpusMetadata from "@/corpus/config/CorpusMetadata.vue";
import CorpusConfiguration from "@/corpus/config/CorpusConfiguration.vue";
import CorpusResult from "@/corpus/exports/CorpusResult.vue";
import CorpusDelete from "@/corpus/CorpusDelete.vue";
import SourceView from "@/corpus/sources/SourceView.vue";
import UserView from "@/user/UserView.vue";
import AccessDenied from "@/auth/AccessDenied.vue";
import NotFound from "@/page/NotFound.vue";

// Specify typing for router meta.
import "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    createTitle?: (params: RouteParams, corpusId: string) => string;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: HomeView,
    meta: {
      title: "home",
    },
  },
  {
    path: "/corpus",
    component: LibraryView,
    meta: { title: "library" },
  },
  {
    path: "/login",
    component: LoginView,
    meta: { title: "login" },
  },
  {
    path: "/signup",
    component: SignupView,
    meta: { title: "signup" },
  },
  {
    path: "/corpus/new",
    component: CreateCorpus,
    meta: { title: "new_corpus" },
  },
  {
    path: "/corpus/:corpusId",
    component: CorpusView,
    children: [
      {
        path: "",
        component: CorpusOverview,
        meta: { createTitle: (params, corpusName) => corpusName },
      },
      {
        path: "metadata",
        component: CorpusMetadata,
        meta: { title: "metadata" },
      },
      {
        path: "config",
        component: CorpusConfiguration,
        meta: { title: "configuration" },
      },
      {
        path: "sources/:filename",
        component: SourceView,
        props: true,
        meta: {
          createTitle: (params) => params.filename as string,
        },
      },
      {
        path: "exports",
        component: CorpusResult,
        meta: { title: "result" },
      },
      {
        path: "delete",
        component: CorpusDelete,
        meta: { title: "delete" },
      },
    ],
  },
  {
    path: "/user",
    component: UserView,
    meta: { title: "account" },
  },
  {
    path: "/access-denied",
    component: AccessDenied,
    meta: { title: "accessdenied" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: NotFound,
    meta: { title: "notfound" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
