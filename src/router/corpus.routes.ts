import { type RouteRecordRaw } from "vue-router";
const CreateCorpus = () => import("@/corpus/CreateCorpus.vue");
const CorpusView = () => import("@/corpus/CorpusView.vue");
const CorpusOverview = () => import("@/corpus/CorpusOverview.vue");
const CorpusConfiguration = () =>
  import("@/corpus/config/CorpusConfiguration.vue");
const SchemaConfig = () => import("@/corpus/config/SchemaConfig.vue");
const CorpusConfigCustom = () =>
  import("@/corpus/config/CorpusConfigCustom.vue");
const CorpusResult = () => import("@/corpus/exports/CorpusResult.vue");
const CorpusDelete = () => import("@/corpus/CorpusDelete.vue");
const SourceView = () => import("@/corpus/sources/SourceView.vue");

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
        path: "config",
        component: CorpusConfiguration,
        meta: { title: "configuration" },
      },
      {
        path: "config/full",
        component: SchemaConfig,
        meta: { title: "configuration" },
      },
      {
        path: "config/full/metadata",
        component: SchemaConfig,
        meta: { title: "metadata" },
        props: {
          properties: ["metadata"],
        },
      },
      {
        path: "config/full/sparv",
        component: SchemaConfig,
        meta: { title: "sparv" },
        props: {
          properties: [
            "sparv",
            "threads",
            "parent",
            "install",
            "uninstall",
            "preload",
          ],
        },
      },
      {
        path: "config/full/annotations",
        component: SchemaConfig,
        meta: { title: "annotations" },
        props: {
          properties: [
            "classes",
            "custom_annotations",
            "dateformat",
            "geo",
            "hist",
            "hunpos",
            "misc",
            "segment",
            "stanza",
            "sbx_freeling",
          ],
        },
      },
      {
        path: "config/full/import",
        component: SchemaConfig,
        meta: { title: "import" },
        props: {
          properties: [
            "import",
            "xml_import",
            "docx_import",
            "odt_import",
            "pdf_import",
            "text_import",
            "xml_import",
          ],
        },
      },
      {
        path: "config/full/export",
        component: SchemaConfig,
        meta: { title: "export" },
        props: {
          properties: [
            "export",
            "conll_export",
            "csv_export",
            "cwb",
            "korp",
            "passthrough",
            "stats_export",
            "xml_export",
          ],
        },
      },
      {
        path: "config/custom",
        component: CorpusConfigCustom,
        meta: { title: "config.custom" },
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
