<template>
  <div class="register-form">
    <h3 class="card-title text-center mb-3">{{ title }}</h3>

    <form @submit.prevent="handleRegister">
      <!-- Họ lót và Tên -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Họ lót</label>
          <input
            v-model="registerForm.HoLot"
            type="text"
            class="form-control"
            placeholder="Nhập họ lót"
            required
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Tên</label>
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
        <label class="form-label">Tên tài khoản</label>
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
        <label class="form-label">Mật khẩu</label>
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
            {{ showPassword ? 'Ẩn' : 'Hiện' }}
          </button>
        </div>
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          v-model="registerForm.Email"
          type="email"
          class="form-control"
          placeholder="Nhập email"
          required
        />
      </div>

      <!-- Số điện thoại -->
      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input
          v-model="registerForm.SoDienThoai"
          type="tel"
          class="form-control"
          placeholder="Nhập số điện thoại"
          required
        />
      </div>

      <!-- Ngày sinh và Phái -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Ngày sinh</label>
          <input
            v-model="registerForm.NgaySinh"
            type="date"
            class="form-control"
            required
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Giới tính</label>
          <select v-model="registerForm.Phai" class="form-select" required>
            <option value="nam">Nam</option>
            <option value="nữ">Nữ</option>
            <option value="khác">Khác</option>
          </select>
        </div>
      </div>

      <!-- Địa chỉ -->
      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <textarea
          v-model="registerForm.DiaChi"
          class="form-control"
          placeholder="Nhập địa chỉ"
          rows="2"
          required
        ></textarea>
      </div>

      <!-- Chức vụ (chỉ cho Nhân viên) -->
      <div v-if="userType === UserType.NHANVIEN" class="mb-3">
        <label class="form-label">Chức vụ</label>
        <input
          v-model="registerForm.ChucVu"
          type="text"
          class="form-control"
          placeholder="Nhập chức vụ"
          required
        />
      </div>

      <!-- Alerts -->
      <div v-if="errorMessage" class="alert alert-danger mt-2" role="alert">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert alert-success mt-2" role="alert">
        {{ successMessage }}
      </div>

      <div class="d-grid gap-2 mt-3">
        <button class="btn btn-primary" type="submit" :disabled="isLoading">
          <span v-if="isLoading">Đang đăng ký...</span>
          <span v-else>Đăng ký</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { authService } from '../services/authService';
import { UserType } from '../types/auth';
import type { RegisterDocGiaRequest, RegisterNhanVienRequest } from '../types/auth';

const props = defineProps<{
  title?: string;
  userType?: UserType;
}>();

const emit = defineEmits<{
  (e: 'success', payload: any): void;
}>();

const effectiveUserType = computed(() => props.userType ?? UserType.DOCGIA);

const registerForm = ref<RegisterDocGiaRequest & { ChucVu?: string }>({
  HoLot: '',
  Ten: '',
  TenTaiKhoan: '',
  MatKhau: '',
  NgaySinh: '',
  Phai: 'nam',
  DiaChi: '',
  SoDienThoai: '',
  Email: '',
  ChucVu: ''
});

const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Reset form khi userType thay đổi
watch(effectiveUserType, () => {
  registerForm.value = {
    HoLot: '',
    Ten: '',
    TenTaiKhoan: '',
    MatKhau: '',
    NgaySinh: '',
    Phai: 'nam',
    DiaChi: '',
    SoDienThoai: '',
    Email: '',
    ChucVu: ''
  };
  errorMessage.value = '';
  successMessage.value = '';
});

const handleRegister = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    let response;

    if (effectiveUserType.value === UserType.DOCGIA) {
      const docGiaData: RegisterDocGiaRequest = {
        HoLot: registerForm.value.HoLot,
        Ten: registerForm.value.Ten,
        TenTaiKhoan: registerForm.value.TenTaiKhoan,
        MatKhau: registerForm.value.MatKhau,
        NgaySinh: registerForm.value.NgaySinh,
        Phai: registerForm.value.Phai,
        DiaChi: registerForm.value.DiaChi,
        SoDienThoai: registerForm.value.SoDienThoai,
        Email: registerForm.value.Email
      };
      response = await authService.registerDocGia(docGiaData);
    } else {
      const nhanVienData: RegisterNhanVienRequest = {
        HoLot: registerForm.value.HoLot,
        Ten: registerForm.value.Ten,
        TenTaiKhoan: registerForm.value.TenTaiKhoan,
        MatKhau: registerForm.value.MatKhau,
        NgaySinh: registerForm.value.NgaySinh,
        Phai: registerForm.value.Phai,
        DiaChi: registerForm.value.DiaChi,
        SoDienThoai: registerForm.value.SoDienThoai,
        Email: registerForm.value.Email,
        ChucVu: registerForm.value.ChucVu || ''
      };
      response = await authService.registerNhanVien(nhanVienData);
    }

    successMessage.value = 'Đăng ký thành công! Bạn có thể đăng nhập ngay.';

    // Emit success
    emit('success', response);

    // Reset form sau 2 giây
    setTimeout(() => {
      registerForm.value = {
        HoLot: '',
        Ten: '',
        TenTaiKhoan: '',
        MatKhau: '',
        NgaySinh: '',
        Phai: 'nam',
        DiaChi: '',
        SoDienThoai: '',
        Email: '',
        ChucVu: ''
      };
    }, 2000);

  } catch (error: any) {
    errorMessage.value = error.message || 'Đăng ký thất bại';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.register-form::-webkit-scrollbar {
  width: 6px;
}

.register-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.register-form::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.register-form::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

