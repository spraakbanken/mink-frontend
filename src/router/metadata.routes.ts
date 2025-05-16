import { type RouteRecordRaw } from "vue-router";
const MetadataView = () => import("@/metadata/MetadataView.vue");
const MetadataOverview = () => import("@/metadata/MetadataOverview.vue");
const CreateMetadata = () => import("@/metadata/CreateMetadata.vue");
const MetadataDelete = () => import("@/metadata/MetadataDelete.vue");

const metadataRoutes: RouteRecordRaw[] = [
  {
    path: "/library/metadata/new",
    component: CreateMetadata,
    meta: {
      title: "metadata.new",
      protected: true,
    },
  },
  {
    path: "/library/metadata/:resourceId",
    component: MetadataView,
    meta: { protected: true },
    children: [
      {
        path: "",
        component: MetadataOverview,
        meta: { protected: true },
      },
      {
        path: "delete",
        component: MetadataDelete,
        meta: {
          title: "delete",
          protected: true,
        },
      },
    ],
  },
];

export default metadataRoutes;
