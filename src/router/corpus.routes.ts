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
const ExportView = () => import("@/corpus/exports/ExportView.vue");
const SourceView = () => import("@/corpus/sources/SourceView.vue");

const corpusRoutes: RouteRecordRaw[] = [
  {
    path: "/library/corpus/new",
    component: CreateCorpus,
    meta: {
      title: "new_corpus",
      protected: true,
    },
  },
  {
    path: "/library/corpus/:id",
    component: CorpusView,
    meta: { protected: true },
    children: [
      {
        path: "",
        name: "corpus.overview",
        component: CorpusOverview,
        meta: { protected: true },
      },
      {
        path: "config",
        component: CorpusConfiguration,
        meta: {
          title: "configuration",
          protected: true,
        },
      },
      {
        path: "config/custom",
        component: CorpusConfigCustom,
        meta: {
          title: "config.custom",
          protected: true,
        },
      },
      {
        path: "sources/:filename",
        component: SourceView,
        props: true,
        meta: {
          createTitle: (params) => params.filename as string,
          protected: true,
        },
      },
      {
        path: "exports",
        component: CorpusResult,
        meta: {
          title: "result",
          protected: true,
        },
      },
      {
        path: "exports/:path",
        component: ExportView,
        props: true,
        meta: {
          createTitle: (params) => decodeURIComponent(params.path as string),
          protected: true,
        },
      },
      {
        path: "delete",
        component: CorpusDelete,
        meta: {
          title: "delete",
          protected: true,
        },
      },
    ],
  },
];

export default corpusRoutes;
