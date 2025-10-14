<template>
  <div class="auth-root d-flex align-items-center justify-content-center">
    <div class="auth-card p-4">
      <!-- Toggle chọn Đăng nhập / Đăng ký -->
      <div class="text-center mb-4">
        <!-- Chỉ hiển thị toggle Đăng nhập/Đăng ký cho Đọc giả -->
        <div v-if="selectedType === UserType.DOCGIA" class="btn-group w-100 mb-3" role="group">
          <button
            :class="['btn', authMode === 'login' ? 'btn-primary' : 'btn-outline-primary']"
            @click="authMode = 'login'"
          >
            <i class="bi bi-box-arrow-in-right me-1"></i>
            Đăng nhập
          </button>
          <button
            :class="['btn', authMode === 'register' ? 'btn-primary' : 'btn-outline-primary']"
            @click="authMode = 'register'"
          >
            <i class="bi bi-person-plus me-1"></i>
            Đăng ký
          </button>
        </div>

        <!-- Tiêu đề cho Nhân viên (chỉ đăng nhập) -->
        <div v-else class="mb-3">
          <h4 class="text-center mb-2">
            <i class="bi bi-box-arrow-in-right me-2"></i>
            Đăng nhập Nhân viên
          </h4>
          <p class="text-muted small mb-0">
            <i class="bi bi-info-circle me-1"></i>
            Đăng ký tài khoản nhân viên được thực hiện bởi Admin
          </p>
        </div>

        <!-- Toggle chọn loại người dùng -->
        <div class="btn-group" role="group" aria-label="Loại tài khoản">
          <button
            :class="['btn', selectedType === UserType.DOCGIA ? 'btn-primary' : 'btn-outline-primary']"
            @click="handleUserTypeChange(UserType.DOCGIA)"
          >
            <i class="bi bi-person-circle me-1"></i>
            Đọc giả
          </button>
          <button
            :class="['btn', selectedType === UserType.NHANVIEN ? 'btn-primary' : 'btn-outline-primary']"
            @click="handleUserTypeChange(UserType.NHANVIEN)"
          >
            <i class="bi bi-briefcase me-1"></i>
            Nhân viên
          </button>
        </div>
      </div>

      <!-- LoginCard cho cả Đọc giả và Nhân viên -->
      <LoginCard
        v-if="authMode === 'login' || selectedType === UserType.NHANVIEN"
        :title="`Đăng nhập ${selectedType === UserType.DOCGIA ? 'Đọc giả' : 'Nhân viên'}`"
        :userType="selectedType"
        @success="onLoginSuccess"
      />

      <!-- RegisterCard chỉ cho Đọc giả -->
      <RegisterCard
        v-else-if="authMode === 'register' && selectedType === UserType.DOCGIA"
        title="Đăng ký Đọc giả"
        :userType="UserType.DOCGIA"
        @success="onRegisterSuccess"
      />

      <!-- Link to Admin Login -->
      <div class="text-center mt-4">
        <router-link to="/auth/admin" class="admin-link">
          <i class="bi bi-shield-lock-fill me-1"></i>
          Đăng nhập với quyền Quản trị viên
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginCard from '../components/LoginCard.vue'
import RegisterCard from '../components/RegisterCard.vue'
import { UserType } from '../types/auth'

const router = useRouter()
const authMode = ref<'login' | 'register'>('login')
const selectedType = ref<UserType>(UserType.DOCGIA)

const handleUserTypeChange = (type: UserType) => {
  selectedType.value = type
  // Khi chuyển sang Nhân viên, luôn hiển thị form đăng nhập
  if (type === UserType.NHANVIEN) {
    authMode.value = 'login'
  }
}

const onLoginSuccess = (payload: any) => {
  console.log('Đăng nhập thành công:', payload)
  // Redirect dựa trên loại người dùng
  if (selectedType.value === UserType.DOCGIA) {
    router.push('/docgia/dashboard')
  } else {
    router.push('/nhanvien/dashboard')
  }
}

const onRegisterSuccess = (payload: any) => {
  console.log('Đăng ký thành công:', payload)
  // Tự động chuyển sang tab đăng nhập sau khi đăng ký thành công
  setTimeout(() => {
    authMode.value = 'login'
  }, 2000)
}
</script>

<style scoped>
.auth-root {
  min-height: calc(100vh - 88px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff 0%, #f7f3ff 100%);
  padding: 40px 16px;
}

.auth-card {
  width: 520px;
  max-width: 95vw;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 8px 28px rgba(102, 103, 173, 0.12);
}

.btn-group .btn {
  min-width: 120px;
  font-weight: 600;
}

.btn-outline-primary {
  border-width: 2px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}

.admin-link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: #dc2626;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.admin-link:hover {
  color: #991b1b;
  background: #fee2e2;
}
</style>
