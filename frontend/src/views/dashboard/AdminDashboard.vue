<template>
  <div class="container mt-5">
    <div class="card shadow-lg">
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

        <!-- Breadcrumb Navigation -->
        <nav aria-label="breadcrumb" class="mt-4" v-if="activeTab !== 'overview'">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a href="#" @click.prevent="activeTab = 'overview'" class="text-decoration-none">
                <i class="bi bi-house-door me-1"></i>Tổng quan
              </a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ getTabTitle(activeTab) }}
            </li>
          </ol>
        </nav>

        <!-- Tab Content -->
        <div class="tab-content mt-4">
          <!-- Overview Tab -->
          <div v-show="activeTab === 'overview'">
            <h5 class="mb-4">
              <i class="bi bi-speedometer2 me-2"></i>
              Chức năng quản trị
            </h5>
            <div class="row row-cols-2 row-cols-md-3 g-4">
              <!-- Manage Users Card - Clickable -->
              <div class="col" @click="activeTab = 'manage-users'">
                <div class="card feature-card h-100 border-primary">
                  <div class="card-body text-center">
                    <i class="bi bi-people-fill fs-1 text-primary mb-3"></i>
                    <h6 class="fw-bold">Quản lý người dùng</h6>
                    <p class="text-muted small mb-0">Quản lý nhân viên, phân quyền</p>
                  </div>
                </div>
              </div>

              <!-- Register Staff Card - Clickable -->
              <div class="col" @click="activeTab = 'register-nhanvien'">
                <div class="card feature-card h-100 border-warning">
                  <div class="card-body text-center">
                    <i class="bi bi-person-plus-fill fs-1 text-warning mb-3"></i>
                    <h6 class="fw-bold">Đăng ký nhân viên</h6>
                    <p class="text-muted small mb-0">Tạo tài khoản nhân viên mới</p>
                  </div>
                </div>
              </div>

              <!-- Statistics Card - Clickable -->
              <div class="col" @click="activeTab = 'statistics'">
                <div class="card feature-card h-100 border-danger">
                  <div class="card-body text-center">
                    <i class="bi bi-graph-up fs-1 text-danger mb-3"></i>
                    <h6 class="fw-bold">Thống kê doanh thu</h6>
                    <p class="text-muted small mb-0">Báo cáo, phân tích doanh thu</p>
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
            <StaffManagement />
          </div>

          <!-- Statistics Tab -->
          <div v-show="activeTab === 'statistics'">
            <RevenueStatistics />
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService'
import AdminRegisterNhanVien from '../../components/AdminRegisterNhanVien.vue'
import StaffManagement from '../../components/StaffManagement.vue'
import RevenueStatistics from '../../components/RevenueStatistics.vue'

const router = useRouter()
const activeTab = ref<'overview' | 'register-nhanvien' | 'manage-users' | 'statistics' | 'system'>('overview')
const userInfo = ref({
  userName: '',
  email: '',
  userType: ''
})

onMounted(async () => {
  try {
    const info = await authService.getCurrentUser()
    if (info && info.email) {
      userInfo.value = {
        userName: info.userName,
        email: info.email,
        userType: info.role || ''
      }
    } else {
      // Nếu chưa đăng nhập, redirect về login
      router.push('/auth/login')
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
    router.push('/auth/login')
  }
})

const handleRegisterSuccess = (payload: any) => {
  console.log('Đăng ký nhân viên thành công:', payload)
  // Có thể thêm thông báo toast hoặc refresh danh sách
}

const getTabTitle = (tab: string): string => {
  const titles: Record<string, string> = {
    'overview': 'Tổng quan',
    'register-nhanvien': 'Đăng ký nhân viên',
    'manage-users': 'Quản lý người dùng',
    'statistics': 'Thống kê doanh thu',
    'system': 'Cấu hình hệ thống'
  }
  return titles[tab] || 'Tổng quan'
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

.breadcrumb {
  background-color: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 0;
}

.breadcrumb-item a {
  color: #dc2626;
  transition: all 0.2s;
}

.breadcrumb-item a:hover {
  color: #991b1b;
}

.breadcrumb-item.active {
  color: #6c757d;
  font-weight: 600;
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

