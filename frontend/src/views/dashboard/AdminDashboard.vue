<template>
  <div class="container mt-5">
    <div class="card shadow-lg">
      <div class="card-header bg-gradient-admin text-white">
        <h4 class="mb-0">
          <i class="bi bi-shield-lock-fill me-2"></i>
          Dashboard Quản trị viên
        </h4>
      </div>
      <div class="card-body">
        <div class="alert alert-info border-0">
          <i class="bi bi-info-circle-fill me-2"></i>
          Chào mừng <strong>{{ userInfo.userName }}</strong> - Quản trị viên có toàn quyền quản lý hệ thống!
        </div>

        <h5 class="mb-3">
          <i class="bi bi-person-badge me-2"></i>
          Thông tin tài khoản
        </h5>
        <ul class="list-unstyled ms-3">
          <li class="mb-2"><strong>Tên:</strong> {{ userInfo.userName }}</li>
          <li class="mb-2"><strong>Email:</strong> {{ userInfo.email }}</li>
          <li class="mb-2"><strong>Vai trò:</strong> <span class="badge bg-danger">Admin</span></li>
        </ul>

        <!-- Tab Navigation -->
        <ul class="nav nav-tabs mt-4" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              :class="['nav-link', activeTab === 'overview' ? 'active' : '']"
              @click="activeTab = 'overview'"
              type="button"
            >
              <i class="bi bi-grid-3x3-gap me-1"></i>
              Tổng quan
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              :class="['nav-link', activeTab === 'register-nhanvien' ? 'active' : '']"
              @click="activeTab = 'register-nhanvien'"
              type="button"
            >
              <i class="bi bi-person-plus-fill me-1"></i>
              Đăng ký nhân viên
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              :class="['nav-link', activeTab === 'manage-users' ? 'active' : '']"
              @click="activeTab = 'manage-users'"
              type="button"
            >
              <i class="bi bi-people-fill me-1"></i>
              Quản lý người dùng
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              :class="['nav-link', activeTab === 'system' ? 'active' : '']"
              @click="activeTab = 'system'"
              type="button"
            >
              <i class="bi bi-gear-fill me-1"></i>
              Cấu hình hệ thống
            </button>
          </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content mt-4">
          <!-- Overview Tab -->
          <div v-show="activeTab === 'overview'">
            <h5 class="mb-4">
              <i class="bi bi-speedometer2 me-2"></i>
              Chức năng quản trị
            </h5>
            <div class="row g-4">
              <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 border-primary">
                  <div class="card-body text-center">
                    <i class="bi bi-people-fill fs-1 text-primary mb-3"></i>
                    <h6 class="fw-bold">Quản lý đọc giả</h6>
                    <p class="text-muted small mb-0">Thêm, sửa, xóa đọc giả</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 border-success">
                  <div class="card-body text-center">
                    <i class="bi bi-book-half fs-1 text-success mb-3"></i>
                    <h6 class="fw-bold">Quản lý sách</h6>
                    <p class="text-muted small mb-0">Quản lý kho sách</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 border-warning">
                  <div class="card-body text-center">
                    <i class="bi bi-briefcase-fill fs-1 text-warning mb-3"></i>
                    <h6 class="fw-bold">Quản lý nhân viên</h6>
                    <p class="text-muted small mb-0">Phân quyền, đăng ký NV</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 border-info">
                  <div class="card-body text-center">
                    <i class="bi bi-arrow-left-right fs-1 text-info mb-3"></i>
                    <h6 class="fw-bold">Mượn/Trả sách</h6>
                    <p class="text-muted small mb-0">Quản lý mượn trả</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 border-secondary">
                  <div class="card-body text-center">
                    <i class="bi bi-building fs-1 text-secondary mb-3"></i>
                    <h6 class="fw-bold">Nhà xuất bản</h6>
                    <p class="text-muted small mb-0">Quản lý NXB</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 border-danger">
                  <div class="card-body text-center">
                    <i class="bi bi-graph-up fs-1 text-danger mb-3"></i>
                    <h6 class="fw-bold">Thống kê</h6>
                    <p class="text-muted small mb-0">Báo cáo, phân tích</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 border-dark">
                  <div class="card-body text-center">
                    <i class="bi bi-shield-check fs-1 text-dark mb-3"></i>
                    <h6 class="fw-bold">Bảo mật</h6>
                    <p class="text-muted small mb-0">Quản lý quyền truy cập</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 border-info">
                  <div class="card-body text-center">
                    <i class="bi bi-gear-fill fs-1 text-info mb-3"></i>
                    <h6 class="fw-bold">Cài đặt</h6>
                    <p class="text-muted small mb-0">Cấu hình hệ thống</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Register NhanVien Tab -->
          <div v-show="activeTab === 'register-nhanvien'">
            <div class="alert alert-warning border-0">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Lưu ý:</strong> Chỉ Admin mới có quyền đăng ký tài khoản nhân viên mới.
            </div>
            <AdminRegisterNhanVien @success="handleRegisterSuccess" />
          </div>

          <!-- Manage Users Tab -->
          <div v-show="activeTab === 'manage-users'">
            <div class="card border-0 bg-light">
              <div class="card-body text-center py-5">
                <i class="bi bi-people fs-1 text-muted mb-3"></i>
                <h5 class="text-muted">Chức năng quản lý người dùng</h5>
                <p class="text-muted">Sẽ được phát triển trong phiên bản tiếp theo</p>
              </div>
            </div>
          </div>

          <!-- System Tab -->
          <div v-show="activeTab === 'system'">
            <div class="card border-0 bg-light">
              <div class="card-body text-center py-5">
                <i class="bi bi-gear-fill fs-1 text-muted mb-3"></i>
                <h5 class="text-muted">Cấu hình hệ thống</h5>
                <p class="text-muted">Sẽ được phát triển trong phiên bản tiếp theo</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 d-flex gap-2">
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
import AdminRegisterNhanVien from '../../components/AdminRegisterNhanVien.vue'

const router = useRouter()
const activeTab = ref<'overview' | 'register-nhanvien' | 'manage-users' | 'system'>('overview')
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

const handleRegisterSuccess = (payload: any) => {
  console.log('Đăng ký nhân viên thành công:', payload)
  // Có thể thêm thông báo toast hoặc refresh danh sách
}

const logout = () => {
  authService.logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 12px;
}

.bg-gradient-admin {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
}

.feature-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-width: 2px;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.nav-tabs {
  border-bottom: 2px solid #e9ecef;
}

.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s;
  position: relative;
}

.nav-tabs .nav-link:hover {
  color: #dc2626;
  border-color: transparent;
}

.nav-tabs .nav-link.active {
  color: #dc2626;
  border-bottom: 3px solid #dc2626;
  background: transparent;
}

.alert-info {
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  color: #1e40af;
}

.alert-warning {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.badge {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.shadow-lg {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12) !important;
}
</style>

