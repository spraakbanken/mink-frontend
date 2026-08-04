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
    // The `protected` flag is inherited by child routes
    meta: { protected: true },
    children: [
      {
        path: "",
        component: CorpusOverviewView,
      },
      {
        path: "config",
        component: CorpusConfigurationView,
        meta: { title: "configuration" },
      },
      {
        path: "config/custom",
        component: CorpusConfigCustomView,
        meta: { title: "config.custom" },
      },
      {
        path: "sources/:filename",
        component: CorpusSourceView,
      },
      {
        path: "exports",
        component: CorpusExportListView,
        meta: { title: "result" },
      },
      {
        path: "exports/:path",
        component: CorpusExportView,
        props: true,
      },
      {
        path: "delete",
        component: CorpusDeleteView,
        meta: { title: "delete" },
      },
    ],
  },
];

export default corpusRoutes;
