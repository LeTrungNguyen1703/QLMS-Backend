<template>
  <LoginCard
    title="Đăng nhập"
    :userType="UserType.DOCGIA"
    @success="onSuccess"
  />
</template>

<script setup lang="ts">
import LoginCard from './LoginCard.vue';
import { UserType } from '../types/auth';

const onSuccess = (payload: any) => {
  console.log('Đọc giả đã đăng nhập:', payload);
  // TODO: chuyển hướng hoặc xử lý tiếp theo ở đây (ví dụ router.push)
};
</script>

<style scoped>
/* no additional styles - shared styles are in LoginCard */
</style>
