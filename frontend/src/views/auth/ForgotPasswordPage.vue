<template>
  <div class="p-4">
    <h4 class="text-center mb-3">Quên mật khẩu</h4>
    <p class="text-muted text-center">Nhập email để nhận liên kết đặt lại mật khẩu.</p>

    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" placeholder="Nhập email" required />
      </div>

      <div v-if="message" class="alert alert-info">{{ message }}</div>

      <div class="d-grid">
        <button class="btn btn-primary" type="submit" :disabled="isLoading">
          <span v-if="isLoading">Đang gửi...</span>
          <span v-else>Gửi liên kết đặt lại</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const isLoading = ref(false)
const message = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  message.value = ''

  try {
    // TODO: gọi API quên mật khẩu nếu backend hỗ trợ
    await new Promise((r) => setTimeout(r, 800))
    message.value = 'Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại.'
    email.value = ''
  } catch (err: any) {
    message.value = 'Có lỗi xảy ra. Vui lòng thử lại.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* small local styles if needed */
</style>
