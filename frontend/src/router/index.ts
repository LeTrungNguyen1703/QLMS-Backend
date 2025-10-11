import { createRouter, createWebHistory } from 'vue-router';
import AuthLayout from '../layouts/AuthLayout.vue'

const routes = [
  { path: '/', redirect: '/auth/login' },
  {
    path: '/auth/login',
    name: 'Login',
    component: AuthLayout,
  },
  // Placeholder dashboard routes
  {
    path: '/docgia/dashboard',
    name: 'DocGiaDashboard',
    component: () => import('../views/dashboard/DocGiaDashboard.vue'),
  },
  {
    path: '/nhanvien/dashboard',
    name: 'NhanVienDashboard',
    component: () => import('../views/dashboard/NhanVienDashboard.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
