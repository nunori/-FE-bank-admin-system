import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";
import KioskButtonView from "@/views/KioskButtonView.vue";
import TicketCustomView from "@/views/TicketCustomView.vue";
import BranchLayoutView from "@/views/BranchLayoutView.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
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
    path: "/kiosk/buttons",
    name: "ButtonCustom",
    component: KioskButtonView,
  },
  {
    path: "/kiosk/ticket-custom",
    name: "TicketCustom",
    component: TicketCustomView,
  },
  {
    path: "/branch-layout",
    name: "BranchLayoutCustom",
    component: BranchLayoutView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
