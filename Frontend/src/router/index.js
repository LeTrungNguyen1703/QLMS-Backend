import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import { Nhanvien } from "./Nhanvien";


const routes = [
  { path: "/home", name: "Home", component: Home },
  ...Nhanvien,
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
