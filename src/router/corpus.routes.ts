import { type RouteRecordRaw } from "vue-router";
const CreateCorpus = () => import("@/corpus/CreateCorpus.vue");
const CorpusView = () => import("@/corpus/CorpusView.vue");
const CorpusOverview = () => import("@/corpus/CorpusOverview.vue");
const CorpusConfiguration = () =>
  import("@/corpus/config/CorpusConfiguration.vue");
const CorpusConfigCustom = () =>
  import("@/corpus/config/CorpusConfigCustom.vue");
const CorpusResult = () => import("@/corpus/exports/CorpusResult.vue");
const CorpusDelete = () => import("@/corpus/CorpusDelete.vue");
const SourceView = () => import("@/corpus/sources/SourceView.vue");

const corpusRoutes: RouteRecordRaw[] = [
  { path: "/corpus", redirect: "/library" },
  {
    // Redirect /corpus/* to /library/corpus/*
    path: "/corpus/:pathMatch(.*)*",
    redirect: (to) => ({
      path: `/library/corpus/${(to.params.pathMatch as string[]).join("/")}`,
    }),
  },
  {
    path: "/library/corpus/new",
    component: CreateCorpus,
    meta: { title: "new_corpus" },
  },
  {
    path: "/library/corpus/:corpusId",
    component: CorpusView,
    children: [
      {
        path: "",
        component: CorpusOverview,
        meta: { createTitle: (params, resourceName) => resourceName },
      },
      {
        path: "config",
        component: CorpusConfiguration,
        meta: { title: "configuration" },
      },
      {
        path: "config/custom",
        component: CorpusConfigCustom,
        meta: { title: "config.custom" },
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
];

export default corpusRoutes;
