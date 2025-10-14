<template>
  <div class="container mt-5">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">
          <i class="bi bi-briefcase me-2"></i>
          Dashboard Nhân viên
        </h4>
      </div>
      <div class="card-body">
        <div class="alert alert-success">
          <i class="bi bi-check-circle me-2"></i>
          Chào mừng bạn đã đăng nhập thành công với tư cách <strong>Nhân viên</strong>!
        </div>

        <h5>Thông tin tài khoản</h5>
        <ul class="list-unstyled">
          <li><strong>Tên:</strong> {{ userInfo.userName }}</li>
          <li><strong>Email:</strong> {{ userInfo.email }}</li>
          <li><strong>Loại:</strong> Nhân viên</li>
        </ul>

        <div class="mt-4">
          <h5>Chức năng quản lý</h5>
          <div class="row g-3">
            <div class="col-md-4">
              <div class="card feature-card">
                <div class="card-body text-center">
                  <i class="bi bi-people fs-1 text-primary"></i>
                  <h6 class="mt-2">Quản lý đọc giả</h6>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card feature-card">
                <div class="card-body text-center">
                  <i class="bi bi-book-half fs-1 text-success"></i>
                  <h6 class="mt-2">Quản lý sách</h6>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card feature-card">
                <div class="card-body text-center">
                  <i class="bi bi-arrow-left-right fs-1 text-warning"></i>
                  <h6 class="mt-2">Mượn/Trả sách</h6>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card feature-card">
                <div class="card-body text-center">
                  <i class="bi bi-building fs-1 text-info"></i>
                  <h6 class="mt-2">Nhà xuất bản</h6>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card feature-card">
                <div class="card-body text-center">
                  <i class="bi bi-graph-up fs-1 text-danger"></i>
                  <h6 class="mt-2">Thống kê</h6>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card feature-card">
                <div class="card-body text-center">
                  <i class="bi bi-gear fs-1 text-secondary"></i>
                  <h6 class="mt-2">Cài đặt</h6>
                </div>
              </div>
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
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
