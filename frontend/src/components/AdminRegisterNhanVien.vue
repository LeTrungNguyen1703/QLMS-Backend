<template>
  <div class="admin-register-nhanvien">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">
          <i class="bi bi-person-plus-fill me-2"></i>
          Đăng ký tài khoản Nhân viên mới
        </h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleRegister">
          <!-- Họ lót và Tên -->
          <div class="row mb-3">
            <label class="form-label">Họ tên nhân viên <span class="text-danger">*</span></label>
            <input
                v-model="registerForm.HoTenNV"
                type="text"
                class="form-control"
                placeholder="Nhập họ tên nhân viên"
                required
            />
          </div>

          <!-- Tên tài khoản -->
          <div class="mb-3">
            <label class="form-label">Tên tài khoản <span class="text-danger">*</span></label>
            <input
                v-model="registerForm.TenTaiKhoan"
                type="text"
                class="form-control"
                placeholder="Nhập tên tài khoản"
                required
            />
          </div>

          <!-- Mật khẩu -->
          <div class="mb-3">
            <label class="form-label">Mật khẩu <span class="text-danger">*</span></label>
            <div class="input-group">
              <input
                  v-model="registerForm.MatKhau"
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

          <!-- Email và Số điện thoại -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Email <span class="text-danger">*</span></label>
              <input
                  v-model="registerForm.Email"
                  type="email"
                  class="form-control"
                  placeholder="Nhập email"
                  required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
              <input
                  v-model="registerForm.SoDienThoai"
                  type="tel"
                  class="form-control"
                  placeholder="Nhập số điện thoại"
                  required
              />
            </div>
          </div>

          <!-- Ngày sinh và Giới tính -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Ngày sinh <span class="text-danger">*</span></label>
              <input
                  v-model="registerForm.NgaySinh"
                  type="date"
                  class="form-control"
                  required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Giới tính <span class="text-danger">*</span></label>
              <select v-model="registerForm.Phai" class="form-select" required>
                <option value="nam">Nam</option>
                <option value="nữ">Nữ</option>
                <option value="khác">Khác</option>
              </select>
            </div>
          </div>

          <!-- Địa chỉ -->
          <div class="mb-3">
            <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
            <textarea
                v-model="registerForm.DiaChi"
                class="form-control"
                placeholder="Nhập địa chỉ"
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

          <!-- Buttons -->
          <div class="d-flex gap-2 mt-4">
            <button class="btn btn-primary flex-grow-1" type="submit" :disabled="isLoading">
              <span v-if="isLoading">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang đăng ký...
              </span>
              <span v-else>
                <i class="bi bi-check-lg me-1"></i>
                Đăng ký nhân viên
              </span>
            </button>
            <button class="btn btn-outline-secondary" type="button" @click="resetForm">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Làm mới
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {authService} from '../services/authService';
import type {RegisterNhanVienRequest} from '../types/auth';

const emit = defineEmits<{
  (e: 'success', payload: any): void;
}>();

const registerForm = ref<RegisterNhanVienRequest>({
  HoTenNV: '',
  TenTaiKhoan: '',
  MatKhau: '',
  NgaySinh: '',
  Phai: 'nam',
  DiaChi: '',
  SoDienThoai: '',
  Email: '',
  ChucVu: 'NHAN_VIEN'
});

const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleRegister = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    const response = await authService.registerNhanVien(registerForm.value);
    successMessage.value = 'Đăng ký nhân viên thành công!';

    // Emit success event
    emit('success', response);

    // Reset form sau 2 giây
    setTimeout(() => {
      resetForm();
      successMessage.value = '';
    }, 2000);
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
    console.error('Lỗi đăng ký nhân viên:', error);
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  registerForm.value = {
    HoTenNV:'',
    TenTaiKhoan: '',
    MatKhau: '',
    NgaySinh: '',
    Phai: 'nam',
    DiaChi: '',
    SoDienThoai: '',
    Email: '',
    ChucVu: 'NHAN_VIEN'
  };
  errorMessage.value = '';
  successMessage.value = '';
  showPassword.value = false;
};
</script>

<style scoped>
.admin-register-nhanvien {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form-label {
  font-weight: 600;
  color: #344767;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-radius: 8px;
  border: 1px solid #d2d6da;
  padding: 0.625rem 0.875rem;
  transition: all 0.2s;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
}

.btn {
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-outline-secondary {
  border-width: 2px;
}

.text-danger {
  color: #ea0606 !important;
}

.alert {
  border-radius: 8px;
  border: none;
  padding: 0.875rem 1.25rem;
}

.alert-success {
  background-color: #d1f2e8;
  color: #0d8a5f;
}

.alert-danger {
  background-color: #fde8e8;
  color: #c53030;
}
</style>

