import { type RouteRecordRaw } from "vue-router";
const MetadataCreateView = () =>
  import("@/metadata/views/MetadataCreateView.vue");
const MetadataDeleteView = () =>
  import("@/metadata/views/MetadataDeleteView.vue");
const MetadataOverviewView = () =>
  import("@/metadata/views/MetadataOverviewView.vue");
const MetadataView = () => import("@/metadata/views/MetadataView.vue");

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
    // The `protected` flag is inherited by child routes
    meta: { protected: true },
    children: [
      {
        path: "",
        component: MetadataOverviewView,
      },
      {
        path: "delete",
        component: MetadataDeleteView,
        meta: { title: "delete" },
      },
    ],
  },
];

export default metadataRoutes;
