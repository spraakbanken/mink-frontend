import { type RouteRecordRaw } from "vue-router";
import MetadataView from "@/metadata/MetadataView.vue";
import MetadataOverview from "@/metadata/MetadataOverview.vue";

const metadataRoutes: RouteRecordRaw[] = [
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
    ],
  },
];

export default metadataRoutes;
