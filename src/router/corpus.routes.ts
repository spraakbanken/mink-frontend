import { type RouteRecordRaw } from "vue-router";
import CreateCorpus from "@/corpus/CreateCorpus.vue";
import CorpusView from "@/corpus/CorpusView.vue";
import CorpusOverview from "@/corpus/CorpusOverview.vue";
import CorpusMetadata from "@/corpus/config/CorpusMetadata.vue";
import CorpusConfiguration from "@/corpus/config/CorpusConfiguration.vue";
import CorpusResult from "@/corpus/exports/CorpusResult.vue";
import CorpusDelete from "@/corpus/CorpusDelete.vue";
import SourceView from "@/corpus/sources/SourceView.vue";

const corpusRoutes: RouteRecordRaw[] = [
  { path: "/corpus", redirect: "/library" },
  {
    // Redirect /corpus/* to /library/corpus/*
    path: "/corpus/:pathMatch(.*)*",
    redirect: (to) => ({
      path: `/library/corpus/${(to.params.pathMatch as string[]).join("/")}`,
    }),
  },
  {
    path: "/library/corpus/new",
    component: CreateCorpus,
    meta: { title: "new_corpus" },
  },
  {
    path: "/library/corpus/:corpusId",
    component: CorpusView,
    children: [
      {
        path: "",
        component: CorpusOverview,
        meta: { createTitle: (params, resourceName) => resourceName },
      },
      {
        path: "metadata",
        component: CorpusMetadata,
        meta: { title: "metadata" },
      },
      {
        path: "config",
        component: CorpusConfiguration,
        meta: { title: "configuration" },
      },
      {
        path: "sources/:filename",
        component: SourceView,
        props: true,
        meta: {
          createTitle: (params) => params.filename as string,
        },
      },
      {
        path: "exports",
        component: CorpusResult,
        meta: { title: "result" },
      },
      {
        path: "delete",
        component: CorpusDelete,
        meta: { title: "delete" },
      },
    ],
  },
];

export default corpusRoutes;
