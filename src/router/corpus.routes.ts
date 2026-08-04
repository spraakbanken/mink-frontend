import { type RouteRecordRaw } from "vue-router";
const CorpusConfigCustomView = () =>
  import("@/corpus/views/CorpusConfigCustomView.vue");
const CorpusConfigurationView = () =>
  import("@/corpus/views/CorpusConfigurationView.vue");
const CorpusCreateView = () => import("@/corpus/views/CorpusCreateView.vue");
const CorpusDeleteView = () => import("@/corpus/views/CorpusDeleteView.vue");
const CorpusExportListView = () =>
  import("@/corpus/views/CorpusExportListView.vue");
const CorpusExportView = () => import("@/corpus/views/CorpusExportView.vue");
const CorpusOverviewView = () =>
  import("@/corpus/views/CorpusOverviewView.vue");
const CorpusSourceView = () => import("@/corpus/views/CorpusSourceView.vue");
const CorpusView = () => import("@/corpus/views/CorpusView.vue");

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
        component: CorpusSourceView,
        meta: { protected: true },
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
        meta: { protected: true },
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
