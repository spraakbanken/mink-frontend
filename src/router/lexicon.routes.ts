import { type RouteRecordRaw } from "vue-router";
const CreateLexicon = () => import("@/lexicon/CreateLexicon.vue");
const LexiconConfigurationView = () =>
  import("@/lexicon/config/LexiconConfigurationView.vue");
const LexiconView = () => import("@/lexicon/LexiconView.vue");
const LexiconOverview = () => import("@/lexicon/LexiconOverview.vue");
const LexiconConfigCustom = () =>
  import("@/lexicon/config/LexiconConfigCustom.vue");
const SourceView = () => import("@/sources/SourceView.vue");
const ExportListView = () => import("@/lexicon/exports/ExportListView.vue");
const ExportView = () => import("@/lexicon/exports/ExportView.vue");
const LexiconDelete = () => import("@/lexicon/LexiconDelete.vue");

const lexiconRoutes: RouteRecordRaw[] = [
  {
    path: "/library/lexicon/new",
    component: CreateLexicon,
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
        component: LexiconOverview,
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
        component: LexiconConfigCustom,
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
        component: ExportListView,
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
        component: LexiconDelete,
        meta: {
          title: "delete",
          protected: true,
        },
      },
    ],
  },
];

export default lexiconRoutes;
