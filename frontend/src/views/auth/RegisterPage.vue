<template>
  <div class="register-auth-root d-flex align-items-center justify-content-center">
    <div class="register-auth-card p-4">
      <div class="text-center mb-4">
        <div class="register-icon-wrapper mb-3">
          <i class="bi bi-person-plus-fill"></i>
        </div>
        <h3 class="mb-2">Đăng ký tài khoản Đọc giả</h3>
        <p class="text-muted small">
          <i class="bi bi-info-circle me-1"></i>
          Tạo tài khoản để truy cập thư viện và mượn sách
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <!-- Họ lót và Tên -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-person me-1"></i>
              Họ lót <span class="text-danger">*</span>
            </label>
            <input
              v-model="registerForm.HoLot"
              type="text"
              class="form-control"
              placeholder="Nhập họ lót"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">
              Tên <span class="text-danger">*</span>
            </label>
            <input
              v-model="registerForm.Ten"
              type="text"
              class="form-control"
              placeholder="Nhập tên"
              required
            />
          </div>
        </div>

        <!-- Tên tài khoản -->
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-at me-1"></i>
            Tên tài khoản <span class="text-danger">*</span>
          </label>
          <input
            v-model="registerForm.TenTaiKhoan"
            type="text"
            class="form-control"
            placeholder="Nhập tên tài khoản"
            required
            minlength="4"
          />
          <small class="text-muted">Tối thiểu 4 ký tự</small>
        </div>

        <!-- Mật khẩu -->
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-key-fill me-1"></i>
            Mật khẩu <span class="text-danger">*</span>
          </label>
          <div class="input-group">
            <input
              v-model="registerForm.MatKhau"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Nhập mật khẩu"
              required
              minlength="6"
            />
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <small class="text-muted">Tối thiểu 6 ký tự</small>
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-envelope me-1"></i>
            Email <span class="text-danger">*</span>
          </label>
          <input
            v-model="registerForm.Email"
            type="email"
            class="form-control"
            placeholder="example@email.com"
            required
          />
        </div>

        <!-- Số điện thoại -->
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-telephone me-1"></i>
            Số điện thoại <span class="text-danger">*</span>
          </label>
          <input
            v-model="registerForm.SoDienThoai"
            type="tel"
            class="form-control"
            placeholder="0123456789"
            required
            pattern="[0-9]{10,11}"
          />
          <small class="text-muted">10-11 chữ số</small>
        </div>

        <!-- Ngày sinh và Giới tính -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-calendar me-1"></i>
              Ngày sinh <span class="text-danger">*</span>
            </label>
            <input
              v-model="registerForm.NgaySinh"
              type="date"
              class="form-control"
              required
              :max="maxDate"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-gender-ambiguous me-1"></i>
              Giới tính <span class="text-danger">*</span>
            </label>
            <select v-model="registerForm.Phai" class="form-select" required>
              <option value="nam">Nam</option>
              <option value="nữ">Nữ</option>
              <option value="khác">Khác</option>
            </select>
          </div>
        </div>

        <!-- Địa chỉ -->
        <div class="mb-3">
          <label class="form-label">
            <i class="bi bi-geo-alt me-1"></i>
            Địa chỉ <span class="text-danger">*</span>
          </label>
          <textarea
            v-model="registerForm.DiaChi"
            class="form-control"
            placeholder="Nhập địa chỉ đầy đủ"
            rows="2"
            required
          ></textarea>
        </div>

        <!-- Alerts -->
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="alert alert-success" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i>
          {{ successMessage }}
        </div>

        <!-- Submit button -->
        <div class="d-grid gap-2 mt-4">
          <button class="btn btn-primary btn-lg" type="submit" :disabled="isLoading">
            <span v-if="isLoading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Đang đăng ký...
            </span>
            <span v-else>
              <i class="bi bi-check-circle me-2"></i>
              Đăng ký tài khoản
            </span>
          </button>
        </div>
      </form>

      <div class="text-center mt-4">
        <div class="small">
          Đã có tài khoản?
          <router-link to="/login" class="text-decoration-none fw-semibold">
            Đăng nhập ngay
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService'
import type { RegisterDocGiaRequest } from '../../types/auth'

const router = useRouter()

const registerForm = ref<RegisterDocGiaRequest>({
  HoLot: '',
  Ten: '',
  TenTaiKhoan: '',
  MatKhau: '',
  NgaySinh: '',
  Phai: 'nam',
  DiaChi: '',
  SoDienThoai: '',
  Email: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Max date is today (users must be born before today)
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const response = await authService.registerDocGia(registerForm.value)

    successMessage.value = 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...'

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-auth-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 16px;
}

.register-auth-card {
  width: 600px;
  max-width: 95vw;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.register-auth-card::-webkit-scrollbar {
  width: 8px;
}

.register-auth-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.register-auth-card::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 10px;
}

.register-auth-card::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

.register-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.register-icon-wrapper i {
  font-size: 2.5rem;
  color: white;
}

.register-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

.register-form::-webkit-scrollbar {
  width: 6px;
}

.register-form::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 10px;
}

.register-form::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.register-form::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.form-label {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
}

.form-label i {
  color: #667eea;
}

.form-control,
.form-select {
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  padding: 0.65rem 0.9rem;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
  padding: 0.875rem;
  border-radius: 8px;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-outline-secondary {
  border-radius: 0 8px 8px 0;
  border-left: none;
}

.alert {
  border-radius: 8px;
  font-size: 0.9rem;
}

.text-danger {
  color: #dc2626 !important;
}

small.text-muted {
  font-size: 0.8rem;
}

@media (max-width: 576px) {
  .register-auth-card {
    padding: 1.5rem !important;
  }

  .register-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .register-icon-wrapper i {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.5rem;
  }
}
</style>
