<template>
  <div class="login-container d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 420px;">
      <div class="card-body">
        <h3 class="card-title text-center mb-3">{{ title }}</h3>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Tên tài khoản</label>
            <input
              v-model="loginForm.TenTaiKhoan"
              type="text"
              class="form-control"
              placeholder="Nhập tên tài khoản"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
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
                :aria-pressed="showPassword"
              >
                {{ showPassword ? 'Ẩn' : 'Hiện' }}
              </button>
            </div>
          </div>

          <input type="hidden" :value="effectiveUserType" />

          <div v-if="errorMessage" class="alert alert-danger mt-2" role="alert">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="alert alert-success mt-2" role="alert">
            {{ successMessage }}
          </div>

          <div class="d-grid gap-2 mt-3">
            <button class="btn btn-primary" type="submit" :disabled="isLoading">
              <span v-if="isLoading">Đang đăng nhập...</span>
              <span v-else>Đăng nhập</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { authService } from '../services/authService';
import { UserType } from '../types/auth';

const props = defineProps<{
  title?: string;
  userType?: UserType;
}>();

const emit = defineEmits<{
  (e: 'success', payload: any): void;
}>();

// Sử dụng computed để reactive với props.userType
const effectiveUserType = computed(() => props.userType ?? UserType.DOCGIA);

const loginForm = ref({ TenTaiKhoan: '', MatKhau: '' });
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    console.log('Logging in as', effectiveUserType.value);
    const response = await authService.login(loginForm.value, effectiveUserType.value as UserType);

    successMessage.value = `Đăng nhập thành công! Xin chào ${response.UserName}`;

    // Emit success so parent can react (redirect, store, etc.)
    emit('success', response);

    // Reset form
    loginForm.value = { TenTaiKhoan: '', MatKhau: '' };
  } catch (error: any) {
    errorMessage.value = error.message || 'Đăng nhập thất bại';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.card {
  border: none;
  border-radius: 15px;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.65;
}
</style>
