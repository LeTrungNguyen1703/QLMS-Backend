<template>
  <!-- This page is placed inside AuthLayout via router -->
  <div class="p-4">
    <div class="text-center mb-3">
      <div class="btn-group" role="group" aria-label="Loại tài khoản">
        <button
          :class="['btn', selectedType === UserType.DOCGIA ? 'btn-primary' : 'btn-outline-primary']"
          @click="selectType(UserType.DOCGIA)"
        >Đọc giả</button>
        <button
          :class="['btn', selectedType === UserType.NHANVIEN ? 'btn-primary' : 'btn-outline-primary']"
          @click="selectType(UserType.NHANVIEN)"
        >Nhân viên</button>
      </div>
    </div>

    <LoginCard :title="title" :userType="selectedType" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import LoginCard from '../../components/LoginCard.vue'
import { UserType } from '../../types/auth'
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()

const title = ref('Đăng nhập')

const parseType = (raw: any) => {
  if (!raw) return UserType.DOCGIA
  const t = String(raw).toLowerCase()
  return t === 'nhanvien' ? UserType.NHANVIEN : UserType.DOCGIA
}

const selectedType = ref<UserType>(parseType(route.query.type))

watch(() => route.query.type, (v) => {
  selectedType.value = parseType(v)
})

const selectType = (t: UserType) => {
  selectedType.value = t
  // update URL query without reloading
  router.replace({ query: { ...route.query, type: t === UserType.NHANVIEN ? 'nhanvien' : 'docgia' } })
}

const onSuccess = (payload: any) => {
  // After successful login, redirect to a placeholder home/dashboard
  console.log('Đăng nhập thành công:', payload)
  router.push('/')
}
</script>

<style scoped>
.btn-outline-primary {
  border-width: 2px;
}
</style>
