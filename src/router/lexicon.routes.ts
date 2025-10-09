import { type RouteRecordRaw } from "vue-router";
const CreateLexicon = () => import("@/lexicon/CreateLexicon.vue");
const LexiconView = () => import("@/lexicon/LexiconView.vue");
const LexiconOverview = () => import("@/lexicon/LexiconOverview.vue");
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
    path: "/library/lexicon/:resourceId",
    component: LexiconView,
    meta: { protected: true },
    children: [
      {
        path: "",
        component: LexiconOverview,
        meta: { protected: true },
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
