<template>
  <div class="employee-auth-root d-flex align-items-center justify-content-center">
    <div class="employee-auth-card p-4">
      <div class="text-center mb-4">
        <div class="employee-icon-wrapper mb-3">
          <i class="bi bi-person-badge-fill"></i>
        </div>
        <h3 class="mb-2">Đăng nhập Nhân viên</h3>
        <p class="text-muted small">
          <i class="bi bi-info-circle me-1"></i>
          Khu vực dành cho nhân viên thư viện
        </p>
      </div>

      <form @submit.prevent="handleEmployeeLogin">
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-person-fill me-1"></i>
            Tên tài khoản
          </label>
          <input
            v-model="loginForm.TenTaiKhoan"
            type="text"
            class="form-control"
            placeholder="Nhập tên tài khoản nhân viên"
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
          <button class="btn btn-success btn-lg" type="submit" :disabled="isLoading">
            <span v-if="isLoading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Đang đăng nhập...
            </span>
            <span v-else>
              <i class="bi bi-box-arrow-in-right me-2"></i>
              Đăng nhập
            </span>
          </button>
        </div>
      </form>

      <div class="text-center mt-4">
        <div class="small text-muted">
          Bạn là quản trị viên?
          <router-link to="/admin/login" class="text-decoration-none ms-1">Đăng nhập Admin</router-link>
        </div>
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

const handleEmployeeLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const response = await authService.login(loginForm.value, UserType.NHANVIEN)

    // Ensure the user is not an admin (admins should use /admin/login)
    if (response.Role === 'ADMIN') {
      errorMessage.value = 'Vui lòng sử dụng trang đăng nhập Admin.'
      isLoading.value = false
      return
    }

    successMessage.value = `Đăng nhập thành công! Xin chào ${response.UserName}`

    setTimeout(() => {
      router.push('/nhanvien/dashboard')
    }, 500)
  } catch (error: any) {
    errorMessage.value = error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.employee-auth-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  padding: 40px 16px;
}

.employee-auth-card {
  width: 480px;
  max-width: 95vw;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.employee-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.employee-icon-wrapper i {
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
  border-color: #10b981;
  box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.15);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  font-weight: 600;
  padding: 0.875rem;
  border-radius: 8px;
  transition: all 0.3s;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.4);
}

.btn-success:active:not(:disabled) {
  transform: translateY(0);
}

.btn-outline-secondary {
  border-radius: 0 8px 8px 0;
}

.alert {
  border-radius: 8px;
  font-size: 0.9rem;
}
</style>

