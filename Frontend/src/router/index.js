import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/pages/Home.vue";
import { Nhanvien } from "./Nhanvien";
import { Docgia } from "./Docgia";

const routes = [
  { path: "/Home", name: "Home", component: Home },
  ...Nhanvien,
  ...Docgia,
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
