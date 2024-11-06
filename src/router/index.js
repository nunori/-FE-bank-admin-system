import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";
import KioskButtonView from "@/views/KioskButtonView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
  },
  {
    path: "/kiosk/button-custom",
    name: "ButtonCustom",
    component: KioskButtonView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
