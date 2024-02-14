import { type RouteRecordRaw } from "vue-router";
import HomeView from "@/home/HomeView.vue";
import LibraryView from "@/library/LibraryView.vue";
import LoginView from "@/auth/LoginView.vue";
import SignupView from "@/auth/SignupView.vue";
import UserView from "@/user/UserView.vue";
import AccessDenied from "@/auth/AccessDenied.vue";
import NotFound from "@/page/NotFound.vue";
import corpusRoutes from "./corpus.routes";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: HomeView,
    meta: {
      title: "home",
    },
  },
  {
    path: "/library",
    component: LibraryView,
    meta: { title: "library" },
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
    meta: { title: "account" },
  },
  {
    path: "/access-denied",
    component: AccessDenied,
    meta: { title: "accessdenied" },
  },
  ...corpusRoutes,
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: NotFound,
    meta: { title: "notfound" },
  },
];

export default routes;
