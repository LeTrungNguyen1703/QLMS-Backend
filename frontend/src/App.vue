<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <header class="app-header d-flex align-items-center">
    <div class="container d-flex justify-content-between align-items-center py-3">
      <div class="brand d-flex align-items-center">
        <div class="brand-logo">QLMS</div>
        <div class="brand-text ms-3">
          <div class="brand-title">Quản lý mượn sách</div>
          <div class="brand-sub">Thư viện - quản lý mượn / trả sách</div>
        </div>
      </div>

      <nav>
        <RouterLink class="btn btn-outline-light" to="/auth/login">
          <i class="bi bi-box-arrow-in-right me-1"></i>
          Đăng nhập
        </RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <router-view />
  </main>
</template>

<style>
/* Global resets kept */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f7fb;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.brand-logo {
  font-weight: 800;
  font-size: 1.6rem;
  letter-spacing: 1px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
}

.brand-title {
  font-weight: 700;
  font-size: 1rem;
}

.brand-sub {
  font-size: 0.8rem;
  opacity: 0.9;
}

.btn-outline-light {
  color: #fff;
  border-color: rgba(255,255,255,0.35);
  border-width: 1px;
  background: transparent;
}

.btn-outline-light:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
}

.btn-link {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

main {
  min-height: calc(100vh - 88px); /* leave space for header */
}
</style>
