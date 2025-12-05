import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Welcome',
        component: () => import('../views/Welcome.vue'),
    },
    // Customer login route (Public UI)
    {
        path: '/login',
        name: 'CustomerLogin',
        component: () => import('../views/auth/CustomerLogin.vue'),
        meta: {
            public: true,
            title: 'Đăng nhập - Đọc giả'
        }
    },
    // Customer registration route (Public UI)
    {
        path: '/register',
        name: 'CustomerRegister',
        component: () => import('../views/auth/RegisterPage.vue'),
        meta: {
            public: true,
            title: 'Đăng ký tài khoản'
        }
    },
    // Employee login route (Internal - direct URL access only)
    {
        path: '/employee/login',
        name: 'EmployeeLogin',
        component: () => import('../views/auth/EmployeeLogin.vue'),
        meta: {
            internal: true,
            title: 'Đăng nhập - Nhân viên'
        }
    },
    // Admin login route (Internal - direct URL access only)
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('../views/auth/AdminLogin.vue'),
        meta: {
            internal: true,
            title: 'Đăng nhập - Quản trị viên'
        }
    },
    // Legacy auth routes redirects
    {
        path: '/auth/login',
        redirect: '/login',
    },
    {
        path: '/auth/register',
        redirect: '/register',
    },
    {
        path: '/auth/admin',
        redirect: '/admin/login',
    },
    // DocGia (Customer) routes
    {
        path: '/docgia/dashboard',
        name: 'DocGiaDashboard',
        component: () => import('../views/dashboard/DocGiaDashboard.vue'),
        meta: {
            requiresAuth: true,
            role: 'DOCGIA'
        }
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
        meta: {
            requiresAuth: true,
            role: 'DOCGIA'
        }
    },
    {
        path: '/docgia/borrow-history',
        name: 'BorrowHistory',
        component: () => import('../views/docgia/BorrowHistory.vue'),
        meta: {
            requiresAuth: true,
            role: 'DOCGIA'
        }
    },
    // NhanVien (Employee) routes
    {
        path: '/nhanvien/dashboard',
        name: 'NhanVienDashboard',
        component: () => import('../views/dashboard/NhanVienDashboard.vue'),
        meta: {
            requiresAuth: true,
            role: 'NHANVIEN',
            internal: true
        }
    },
    // Admin routes
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/dashboard/AdminDashboard.vue'),
        meta: {
            requiresAuth: true,
            role: 'ADMIN',
            internal: true
        }
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard to set page title
router.beforeEach((to, from, next) => {
    // Set page title
    if (to.meta.title) {
        document.title = `${to.meta.title} - QLMS`;
    } else {
        document.title = 'Hệ thống Quản lý Thư viện - QLMS';
    }

    next();
});

export default router;
