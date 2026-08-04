import { type RouteRecordRaw } from "vue-router";
const MetadataCreateView = () => import("@/metadata/MetadataCreateView.vue");
const MetadataDeleteView = () => import("@/metadata/MetadataDeleteView.vue");
const MetadataOverviewView = () =>
  import("@/metadata/MetadataOverviewView.vue");
const MetadataView = () => import("@/metadata/MetadataView.vue");

const metadataRoutes: RouteRecordRaw[] = [
  {
    path: "/library/metadata/new",
    component: MetadataCreateView,
    meta: {
      title: "metadata.new",
      protected: true,
    },
  },
  {
    path: "/library/metadata/:id",
    component: MetadataView,
    meta: { protected: true },
    children: [
      {
        path: "",
        component: MetadataOverviewView,
        meta: { protected: true },
      },
      {
        path: "delete",
        component: MetadataDeleteView,
        meta: {
          title: "delete",
          protected: true,
        },
      },
    ],
  },
];

export default metadataRoutes;
