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
const LexiconView = () => import("@/lexicon/views/LexiconView.vue");
const SourceView = () => import("@/sources/SourceView.vue");

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
    meta: { protected: true },
    children: [
      {
        path: "",
        component: LexiconOverviewView,
        meta: { protected: true },
      },
      {
        path: "config",
        component: LexiconConfigurationView,
        meta: {
          title: "configuration",
          protected: true,
        },
      },
      {
        path: "config/custom",
        component: LexiconConfigCustomView,
        meta: {
          title: "config.custom",
          protected: true,
        },
      },
      {
        path: "sources/:filename",
        component: SourceView,
        props: (route) => ({
          type: "lexicon",
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
        component: LexiconExportListView,
        meta: {
          title: "result",
          protected: true,
        },
      },
      {
        path: "exports/:path",
        component: LexiconExportView,
        props: true,
        meta: {
          createTitle: (params) => decodeURIComponent(params.path as string),
          protected: true,
        },
      },
      {
        path: "delete",
        component: LexiconDeleteView,
        meta: {
          title: "delete",
          protected: true,
        },
      },
    ],
  },
];

export default lexiconRoutes;
