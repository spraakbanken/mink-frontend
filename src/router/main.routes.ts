import { type RouteRecordRaw } from "vue-router";
import HomeView from "@/home/HomeView.vue";
const LibraryView = () => import("@/library/LibraryView.vue");
const ResourceRedirectView = () =>
  import("@/resource/ResourceRedirectView.vue");
import LoginView from "@/auth/LoginView.vue";
import SignupView from "@/auth/SignupView.vue";
const UserView = () => import("@/user/UserView.vue");
const AdminResourcesView = () => import("@/library/AdminResourcesView.vue");
import AccessDenied from "@/auth/AccessDenied.vue";
import NotFound from "@/page/NotFound.vue";
import corpusRoutes from "@/router/corpus.routes";
import metadataRoutes from "@/router/metadata.routes";
const MetadataEditorView = () =>
  import("@/metadata_editor/MetadataEditorView.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: HomeView,
    meta: { title: "home" },
  },
  {
    path: "/library",
    component: LibraryView,
    meta: {
      title: "library",
      protected: true,
    },
  },
  {
    // Redirects to the resource page for an unknown resource type.
    path: "/library/resource/:resourceId",
    component: ResourceRedirectView,
    meta: { protected: true },
  },
  {
    path: "/login",
    component: LoginView,
    meta: { title: "login" },
  },
  {
    path: "/signup",
    component: SignupView,
    meta: { title: "signup" },
  },
  {
    path: "/user",
    component: UserView,
    meta: {
      title: "account",
      protected: true,
    },
  },
  {
    path: "/access-denied",
    component: AccessDenied,
    meta: { title: "accessdenied" },
  },
  {
    path: "/admin/resources",
    component: AdminResourcesView,
    meta: {
      title: "resources",
      protected: true,
    },
  },
  ...corpusRoutes,
  ...metadataRoutes,
  {
    path: "/metadata-editor",
    component: MetadataEditorView,
    meta: { title: "metadata_editor" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: NotFound,
    meta: { title: "notfound" },
  },
];

export default routes;
