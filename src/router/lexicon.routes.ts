import { RouterView, type RouteRecordRaw } from "vue-router";
const LexiconAnalyseView = () =>
  import("@/lexicon/views/LexiconAnalyseView.vue");
const LexiconConfigCustomView = () =>
  import("@/lexicon/views/LexiconConfigCustomView.vue");
const LexiconConfigFormView = () =>
  import("@/lexicon/views/LexiconConfigFormView.vue");
const LexiconCreateView = () => import("@/lexicon/views/LexiconCreateView.vue");
const LexiconDeleteView = () => import("@/lexicon/views/LexiconDeleteView.vue");
const LexiconExploreView = () =>
  import("@/lexicon/views/LexiconExploreView.vue");
const LexiconExportListView = () =>
  import("@/lexicon/views/LexiconExportListView.vue");
const LexiconExportView = () => import("@/lexicon/views/LexiconExportView.vue");
const LexiconOverviewView = () =>
  import("@/lexicon/views/LexiconOverviewView.vue");
const LexiconSourcesView = () =>
  import("@/lexicon/views/LexiconSourcesView.vue");
const LexiconSourceView = () => import("@/lexicon/views/LexiconSourceView.vue");
const LexiconView = () => import("@/lexicon/views/LexiconView.vue");
const ResourceConfigView = () => import("@/resource/ResourceConfigView.vue");

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
        redirect: (to) => `${to.path}/status`,
      },
      {
        path: "status",
        component: LexiconOverviewView,
      },
      {
        path: "config",
        component: ResourceConfigView,
        children: [
          {
            path: "",
            redirect: (to) => `${to.path}/form`,
          },
          {
            path: "form",
            component: LexiconConfigFormView,
            meta: { title: "configuration" },
          },

          {
            path: "custom",
            component: LexiconConfigCustomView,
            meta: { title: "config.custom" },
          },
        ],
      },
      {
        path: "sources",
        component: RouterView,
        children: [
          {
            path: "",
            component: LexiconSourcesView,
            meta: { title: "sources" },
          },
          {
            // This route expects the source filename in the 'path' query param
            path: "file",
            component: LexiconSourceView,
          },
          {
            // TODO Compat added 2026-08-21. Remove after 6 months?
            path: ":filename",
            redirect: (to) => {
              // Redirect to the 'sources/file' route with the 'path' query param
              return {
                path: `/library/lexicon/${to.params.id}/sources/file`,
                query: { path: to.params.filename },
              };
            },
          },
        ],
      },
      {
        path: "analyse",
        component: LexiconAnalyseView,
        meta: { title: "analysis" },
      },

      {
        path: "exports",
        component: RouterView,
        children: [
          {
            path: "",
            component: LexiconExportListView,
            meta: { title: "result" },
          },
          {
            // This route expects the export file path in the 'path' query param
            path: "file",
            component: LexiconExportView,
          },
          {
            // TODO Compat added 2026-08-21. Remove after 6 months?
            path: ":path",
            redirect: (to) => {
              // Redirect to the 'exports/file' route with the 'path' query param
              return {
                path: `/library/lexicon/${to.params.id}/exports/file`,
                query: { path: to.params.path },
              };
            },
          },
        ],
      },
      {
        path: "explore",
        component: LexiconExploreView,
        meta: { title: "exports.tools" },
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
