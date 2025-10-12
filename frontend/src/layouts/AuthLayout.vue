<template>
  <div class="auth-root d-flex align-items-center justify-content-center">
    <div class="auth-card p-4">
      <!-- Toggle chọn Đăng nhập / Đăng ký -->
      <div class="text-center mb-4">
        <div class="btn-group w-100 mb-3" role="group">
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

        <!-- Toggle chọn loại người dùng -->
        <div class="btn-group" role="group" aria-label="Loại tài khoản">
          <button
            :class="['btn', selectedType === UserType.DOCGIA ? 'btn-primary' : 'btn-outline-primary']"
            @click="selectedType = UserType.DOCGIA"
          >
            <i class="bi bi-person-circle me-1"></i>
            Đọc giả
          </button>
          <button
            :class="['btn', selectedType === UserType.NHANVIEN ? 'btn-primary' : 'btn-outline-primary']"
            @click="selectedType = UserType.NHANVIEN"
          >
            <i class="bi bi-briefcase me-1"></i>
            Nhân viên
          </button>
        </div>
      </div>

      <!-- LoginCard hoặc RegisterCard component với userType động -->
      <LoginCard
        v-if="authMode === 'login'"
        :title="`Đăng nhập ${selectedType === UserType.DOCGIA ? 'Đọc giả' : 'Nhân viên'}`"
        :userType="selectedType"
        @success="onLoginSuccess"
      />

      <RegisterCard
        v-else
        :title="`Đăng ký ${selectedType === UserType.DOCGIA ? 'Đọc giả' : 'Nhân viên'}`"
        :userType="selectedType"
        @success="onRegisterSuccess"
      />
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
</style>
