import { type RouteRecordRaw } from "vue-router";
const CorpusConfigCustomView = () =>
  import("@/corpus/config/CorpusConfigCustomView.vue");
const CorpusConfigurationView = () =>
  import("@/corpus/config/CorpusConfigurationView.vue");
const CorpusCreateView = () => import("@/corpus/CorpusCreateView.vue");
const CorpusDeleteView = () => import("@/corpus/CorpusDeleteView.vue");
const CorpusExportListView = () =>
  import("@/corpus/exports/CorpusExportListView.vue");
const CorpusExportView = () => import("@/corpus/exports/CorpusExportView.vue");
const CorpusOverviewView = () => import("@/corpus/CorpusOverviewView.vue");
const CorpusView = () => import("@/corpus/CorpusView.vue");
const SourceView = () => import("@/sources/SourceView.vue");

const corpusRoutes: RouteRecordRaw[] = [
  {
    path: "/library/corpus/new",
    component: CorpusCreateView,
    meta: {
      title: "corpus.new",
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
        component: CorpusOverviewView,
        meta: { protected: true },
      },
      {
        path: "config",
        component: CorpusConfigurationView,
        meta: {
          title: "configuration",
          protected: true,
        },
      },
      {
        path: "config/custom",
        component: CorpusConfigCustomView,
        meta: {
          title: "config.custom",
          protected: true,
        },
      },
      {
        path: "sources/:filename",
        component: SourceView,
        props: (route) => ({
          type: "corpus",
          id: route.params.id as string,
          filename: route.params.filename as string,
        }),
        meta: {
          createTitle: (params) => params.filename as string,
          protected: true,
        },
      },
      {
        path: "exports",
        component: CorpusExportListView,
        meta: {
          title: "result",
          protected: true,
        },
      },
      {
        path: "exports/:path",
        component: CorpusExportView,
        props: true,
        meta: {
          createTitle: (params) => decodeURIComponent(params.path as string),
          protected: true,
        },
      },
      {
        path: "delete",
        component: CorpusDeleteView,
        meta: {
          title: "delete",
          protected: true,
        },
      },
    ],
  },
];

export default corpusRoutes;
