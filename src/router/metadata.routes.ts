import { type RouteRecordRaw } from "vue-router";
const MetadataView = () => import("@/metadata/MetadataView.vue");
const MetadataOverview = () => import("@/metadata/MetadataOverview.vue");
const CreateMetadata = () => import("@/metadata/CreateMetadata.vue");
const MetadataDelete = () => import("@/metadata/MetadataDelete.vue");

const metadataRoutes: RouteRecordRaw[] = [
  {
    path: "/library/metadata/new",
    component: CreateMetadata,
    meta: { title: "metadata.new" },
  },
  {
    path: "/library/metadata/:resourceId",
    component: MetadataView,
    children: [
      {
        path: "",
        component: MetadataOverview,
        meta: {
          createTitle: (params, resourceName) =>
            resourceName || (params.resourceId as string),
        },
      },
      {
        path: "delete",
        component: MetadataDelete,
        meta: { title: "delete" },
      },
    ],
  },
];

export default metadataRoutes;
