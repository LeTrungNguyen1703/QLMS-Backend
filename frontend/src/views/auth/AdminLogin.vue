<template>
  <div class="admin-auth-root d-flex align-items-center justify-content-center">
    <div class="admin-auth-card p-4">
      <div class="text-center mb-4">
        <div class="admin-icon-wrapper mb-3">
          <i class="bi bi-shield-lock-fill"></i>
        </div>
        <h3 class="mb-2">Đăng nhập Quản trị viên</h3>
        <p class="text-muted small">
          <i class="bi bi-info-circle me-1"></i>
          Khu vực dành riêng cho Admin - Toàn quyền quản lý hệ thống
        </p>
      </div>

      <form @submit.prevent="handleAdminLogin">
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-person-fill me-1"></i>
            Tên tài khoản Admin
          </label>
          <input
            v-model="loginForm.TenTaiKhoan"
            type="text"
            class="form-control"
            placeholder="Nhập tên tài khoản admin"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-key-fill me-1"></i>
            Mật khẩu
          </label>
          <div class="input-group">
            <input
              v-model="loginForm.MatKhau"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Nhập mật khẩu"
              required
            />
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="alert alert-success" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i>
          {{ successMessage }}
        </div>

        <div class="d-grid gap-2 mt-4">
          <button class="btn btn-danger btn-lg" type="submit" :disabled="isLoading">
            <span v-if="isLoading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Đang đăng nhập...
            </span>
            <span v-else>
              <i class="bi bi-shield-check me-2"></i>
              Đăng nhập Admin
            </span>
          </button>
        </div>
      </form>

      <div class="text-center mt-4">
        <router-link to="/auth/login" class="text-decoration-none">
          <i class="bi bi-arrow-left me-1"></i>
          Quay lại trang đăng nhập thông thường
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService'
import { UserType } from '../../types/auth'
import type { LoginRequest } from '../../types/auth'

const router = useRouter()
const loginForm = ref<LoginRequest>({
  TenTaiKhoan: '',
  MatKhau: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleAdminLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const response = await authService.login(loginForm.value, UserType.NHANVIEN)
    if (response.Role !== 'ADMIN') {
      throw new Error('Bạn không có quyền truy cập admin.')
    }

    // Kiểm tra xem có phải admin không (có thể check từ response hoặc ChucVu)
    // Giả sử backend trả về thông tin role
    successMessage.value = 'Đăng nhập thành công!'

    setTimeout(() => {
      router.push('/admin/dashboard')
    }, 500)
  } catch (error: any) {
    errorMessage.value = error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.admin-auth-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  padding: 40px 16px;
}

.admin-auth-card {
  width: 480px;
  max-width: 95vw;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.admin-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.admin-icon-wrapper i {
  font-size: 2.5rem;
  color: white;
}

.form-label {
  font-weight: 600;
  color: #1f2937;
}

.form-control {
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  padding: 0.75rem 1rem;
  transition: all 0.2s;
}

.form-control:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 0.2rem rgba(220, 38, 38, 0.15);
}

.btn-danger {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border: none;
  font-weight: 600;
  padding: 0.875rem;
  border-radius: 8px;
  transition: all 0.3s;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(220, 38, 38, 0.4);
}

.btn-danger:active:not(:disabled) {
  transform: translateY(0);
}

.alert {
  border-radius: 8px;
  border: none;
}

a {
  color: #dc2626;
  transition: color 0.2s;
}

a:hover {
  color: #991b1b;
}
</style>
