import { type RouteRecordRaw } from "vue-router";
import MetadataView from "@/metadata/MetadataView.vue";
import MetadataOverview from "@/metadata/MetadataOverview.vue";
import CreateMetadata from "@/metadata/CreateMetadata.vue";
import MetadataDelete from "@/metadata/MetadataDelete.vue";

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
