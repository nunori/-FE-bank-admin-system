import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";
import KioskButtonPreview from "@/components/kiosk/KioskButtonPreview.vue";
import KioskButtonView from "@/views/KioskButtonView.vue";
import TicketCustomView from "@/views/TicketCustomView.vue";
import BranchLayoutView from "@/views/BranchLayoutView.vue";

const routes = [
  {
    path: "/",
    name: "HomeRedirect",
    component: HomeView,
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
    path: "/kiosk/preview",
    name: "KioskPreview",
    component: KioskButtonPreview,
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
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: HomeView, // 별도의 404 컴포넌트 연결 가능
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
