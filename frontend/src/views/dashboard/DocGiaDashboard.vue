<template>
  <div class="container-fluid px-4 mt-5">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">
          <i class="bi bi-person-circle me-2"></i>
          Dashboard Đọc giả
        </h4>
      </div>
      <div class="card-body">
        <div class="alert alert-success">
          <i class="bi bi-check-circle me-2"></i>
          Chào mừng bạn đã đăng nhập thành công với tư cách <strong>Đọc giả</strong>!
        </div>

        <h5>Thông tin tài khoản</h5>
        <ul class="list-unstyled">
          <li><strong>Tên:</strong> {{ userInfo.userName }}</li>
          <li><strong>Email:</strong> {{ userInfo.email }}</li>
          <li><strong>Loại:</strong> Đọc giả</li>
        </ul>

        <div class="mt-4">
          <h5>Chức năng</h5>
          <div class="row g-3">
            <div class="col-md-4">
              <router-link to="/docgia/search-books" class="text-decoration-none">
                <div class="card feature-card">
                  <div class="card-body text-center">
                    <i class="bi bi-book fs-1 text-primary"></i>
                    <h6 class="mt-2">Tìm sách</h6>
                    <p class="text-muted small mb-0">Tìm kiếm và mượn sách</p>
                  </div>
                </div>
              </router-link>
            </div>
            <div class="col-md-4">
              <router-link to="/docgia/borrowed-books" class="text-decoration-none">
                <div class="card feature-card">
                  <div class="card-body text-center">
                    <i class="bi bi-bookmark-check fs-1 text-success"></i>
                    <h6 class="mt-2">Sách đã mượn</h6>
                    <p class="text-muted small mb-0">Xem sách đang mượn</p>
                  </div>
                </div>
              </router-link>
            </div>
            <div class="col-md-4">
              <router-link to="/docgia/borrow-history" class="text-decoration-none">
                <div class="card feature-card">
                  <div class="card-body text-center">
                    <i class="bi bi-clock-history fs-1 text-info"></i>
                    <h6 class="mt-2">Lịch sử</h6>
                    <p class="text-muted small mb-0">Xem lịch sử mượn trả</p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <button @click="logout" class="btn btn-outline-danger">
            <i class="bi bi-box-arrow-right me-1"></i>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService'

const router = useRouter()
const userInfo = ref({
  userName: '',
  email: '',
  userType: ''
})

onMounted(() => {
  const info = authService.getUserInfo()
  if (info.userName && info.email) {
    userInfo.value = {
      userName: info.userName,
      email: info.email,
      userType: info.userType || ''
    }
  } else {
    // Nếu chưa đăng nhập, redirect về login
    router.push('/auth/login')
  }
})

const logout = () => {
  authService.logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 10px;
}

.feature-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-color: #667eea;
}
</style>
