import { createRouter, createWebHistory } from 'vue-router';
import AuthLayout from '../layouts/AuthLayout.vue'

const routes = [
  { path: '/', redirect: '/auth/login' },
  {
    path: '/auth/login',
    name: 'Login',
    component: AuthLayout,
  },
  {
    path: '/auth/admin',
    name: 'AdminLogin',
    component: () => import('../views/auth/AdminLogin.vue'),
  },
  // Placeholder dashboard routes
  {
    path: '/docgia/dashboard',
    name: 'DocGiaDashboard',
    component: () => import('../views/dashboard/DocGiaDashboard.vue'),
  },
  {
    path: '/docgia/search-books',
    name: 'SearchBooks',
    component: () => import('../views/docgia/SearchBooks.vue'),
  },
  {
    path: '/docgia/borrowed-books',
    name: 'BorrowedBooks',
    component: () => import('../views/docgia/BorrowedBooks.vue'),
  },
  {
    path: '/docgia/borrow-history',
    name: 'BorrowHistory',
    component: () => import('../views/docgia/BorrowHistory.vue'),
  },
  {
    path: '/nhanvien/dashboard',
    name: 'NhanVienDashboard',
    component: () => import('../views/dashboard/NhanVienDashboard.vue'),
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/dashboard/AdminDashboard.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
