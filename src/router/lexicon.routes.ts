import { type RouteRecordRaw } from "vue-router";
const LexiconConfigCustomView = () =>
  import("@/lexicon/views/LexiconConfigCustomView.vue");
const LexiconConfigurationView = () =>
  import("@/lexicon/views/LexiconConfigurationView.vue");
const LexiconCreateView = () => import("@/lexicon/views/LexiconCreateView.vue");
const LexiconDeleteView = () => import("@/lexicon/views/LexiconDeleteView.vue");
const LexiconExportListView = () =>
  import("@/lexicon/views/LexiconExportListView.vue");
const LexiconExportView = () => import("@/lexicon/views/LexiconExportView.vue");
const LexiconOverviewView = () =>
  import("@/lexicon/views/LexiconOverviewView.vue");
const LexiconSourceView = () => import("@/lexicon/views/LexiconSourceView.vue");
const LexiconView = () => import("@/lexicon/views/LexiconView.vue");

const lexiconRoutes: RouteRecordRaw[] = [
  {
    path: "/library/lexicon/new",
    component: LexiconCreateView,
    meta: {
      title: "lexicon.new",
      protected: true,
    },
  },
  {
    path: "/library/lexicon/:id",
    component: LexiconView,
    // The `protected` flag is inherited by child routes
    meta: { protected: true },
    children: [
      {
        path: "",
        component: LexiconOverviewView,
      },
      {
        path: "config",
        component: LexiconConfigurationView,
        meta: { title: "configuration" },
      },
      {
        path: "config/custom",
        component: LexiconConfigCustomView,
        meta: { title: "config.custom" },
      },
      {
        // This route expects the source filename in the 'path' query param
        path: "sources/file",
        component: LexiconSourceView,
      },
      {
        // TODO Compat added 2026-08-21. Remove after 6 months?
        path: "sources/:filename",
        redirect: (to) => {
          // Redirect to the 'sources/file' route with the 'path' query param
          return {
            path: `/library/lexicon/${to.params.id}/sources/file`,
            query: { path: to.params.filename },
          };
        },
      },
      {
        path: "exports",
        component: LexiconExportListView,
        meta: { title: "result" },
      },
      {
        // This route expects the export file path in the 'path' query param
        path: "exports/file",
        component: LexiconExportView,
      },
      {
        // TODO Compat added 2026-08-21. Remove after 6 months?
        path: "exports/:path",
        redirect: (to) => {
          // Redirect to the 'exports/file' route with the 'path' query param
          return {
            path: `/library/lexicon/${to.params.id}/exports/file`,
            query: { path: to.params.path },
          };
        },
      },
      {
        path: "delete",
        component: LexiconDeleteView,
        meta: { title: "delete" },
      },
    ],
  },
];

export default lexiconRoutes;
