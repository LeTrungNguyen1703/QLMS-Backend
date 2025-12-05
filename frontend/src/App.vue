<script setup lang="ts">
import {RouterLink, useRoute} from 'vue-router';
import {ref, watch, provide, onMounted} from 'vue';
import {Cloudinary} from '@cloudinary/url-gen';
import {authService} from "./services/authService.ts";
import router from "./router";

const route = useRoute();
const searchQuery = ref('');
const showSearch = ref(false);

// Provide searchQuery để child components có thể inject
provide('searchQuery', searchQuery);

// Check authentication status - use ref for reactivity
const isAuthenticated = ref(authService.isAuthenticated());

// Watch for route changes and update auth status
watch(() => route.path, (newPath) => {
  isAuthenticated.value = authService.isAuthenticated(); // Update on route change
  showSearch.value = newPath === '/docgia/search-books';
  if (!showSearch.value) {
    searchQuery.value = '';
  }
}, {immediate: true});

// Update auth status on mount and add storage event listener
onMounted(() => {
  isAuthenticated.value = authService.isAuthenticated();

  // Listen for storage changes (useful for multi-tab scenarios)
  window.addEventListener('storage', (e) => {
    if (e.key === 'authToken') {
      isAuthenticated.value = authService.isAuthenticated();
    }
  });
});

const handleLogout = () => {
  authService.logout(); // Clear all localStorage items
  isAuthenticated.value = false; // Force reactive update
  router.push('/docgia/search-books'); // Redirect to search page
}

const handleLogin = () => {
  router.push('/auth/login');
}

</script>


<template>
  <header class="app-header d-flex align-items-center">
    <div class="container-fluid d-flex justify-content-between align-items-center py-3 px-4">
      <RouterLink to="/" class="brand d-flex align-items-center text-decoration-none">
        <div class="brand-logo"><i class="bi bi-book-half"></i></div>
        <div class="brand-text ms-3">
          <div class="brand-title">Quản lý mượn sách</div>
          <div class="brand-sub">Thư viện - quản lý mượn / trả sách</div>
        </div>
      </RouterLink>

      <nav class="d-flex align-items-center gap-3">
        <!-- Search bar - chỉ hiện khi ở trang tìm sách -->
        <div v-if="showSearch" class="search-bar">
          <div class="input-group">
            <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Tìm sách theo tên, tác giả..."
            />
            <button class="btn btn-light" type="button">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>

        <!-- Navigation buttons for authenticated users -->
        <template v-if="isAuthenticated">
          <button @click="handleLogout" class="btn btn-outline-light">
            <i class="bi bi-box-arrow-right me-1"></i>
            Đăng xuất
          </button>
          <RouterLink class="btn btn-outline-light" to="/docgia/dashboard" aria-label="Dashboard">
            <i class="bi bi-speedometer2 me-1"></i>
            Dashboard
          </RouterLink>
        </template>

        <!-- Login button for anonymous users -->
        <template v-else>
          <button @click="handleLogin" class="btn btn-light">
            <i class="bi bi-box-arrow-in-right me-1"></i>
            Đăng nhập
          </button>
        </template>
      </nav>
    </div>
  </header>

  <main>
    <router-view/>
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
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.brand {
  color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.brand:hover {
  color: #fff;
  transform: translateY(-2px);
}

.brand:hover .brand-logo {
  background: rgba(255, 255, 255, 0.15);
}

.brand-logo {
  font-weight: 800;
  font-size: 1.6rem;
  letter-spacing: 1px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.brand-title {
  font-weight: 700;
  font-size: 1rem;
}

.brand-sub {
  font-size: 0.8rem;
  opacity: 0.9;
}

.search-bar {
  width: 400px;
}

.search-bar .input-group {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-bar .form-control {
  border: none;
  border-radius: 8px 0 0 8px;
  background: rgba(255, 255, 255, 0.95);
}

.search-bar .form-control:focus {
  background: #fff;
  box-shadow: none;
}

.search-bar .btn-light {
  border: none;
  border-radius: 0 8px 8px 0;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
}

.search-bar .btn-light:hover {
  background: #fff;
  color: #5568d3;
}

.btn-outline-light {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.35);
  border-width: 1px;
  background: transparent;
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.btn-link {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

main {
  min-height: calc(100vh - 88px);
  width: 100%;
  padding: 0;
  margin: 0;
}

/* Đảm bảo container-fluid thực sự full width */
.container-fluid {
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (max-width: 768px) {
  .search-bar {
    width: 250px;
  }

  .brand-text {
    display: none;
  }
}
</style>
