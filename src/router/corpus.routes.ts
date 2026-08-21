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
        // This route expects the source filename in the 'path' query param
        path: "sources/file",
        component: CorpusSourceView,
      },
      {
        // TODO Compat added 2026-08-21. Remove after 6 months?
        path: "sources/:filename",
        redirect: (to) => {
          // Redirect to the 'sources/file' route with the 'path' query param
          return {
            path: `/library/corpus/${to.params.id}/sources/file`,
            query: { path: to.params.filename },
          };
        },
      },
      {
        path: "exports",
        component: CorpusExportListView,
        meta: { title: "result" },
      },
      {
        // This route expects the export file path in the 'path' query param
        path: "exports/file",
        component: CorpusExportView,
      },
      {
        // TODO Compat added 2026-08-21. Remove after 6 months?
        path: "exports/:path",
        redirect: (to) => {
          // Redirect to the 'exports/file' route with the 'path' query param
          return {
            path: `/library/corpus/${to.params.id}/exports/file`,
            query: { path: to.params.path },
          };
        },
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
