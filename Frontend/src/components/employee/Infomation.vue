<template>
  <div class="container">
    <h1 class="text-center text-success">Thông tin nhân viên</h1>
    <!-- Nếu có người dùng -->
    <div v-if="users" class="row justify-content-center">
      <div class="col-md-8 rounded shadow-sm border p-3">
        <p><b>Họ và tên: </b>{{ users.hotennv }}</p>
        <p><b>Địa chỉ: </b>{{ users.diachi }}</p>
        <p><b>Số điện thoại: </b>{{ users.sodienthoai }}</p>
        <p><b>Chức vụ: </b>{{ users.chucvu }}</p>
        <p><b>Ngày tạo: </b>{{ formatDate(users.ngaytao) }}</p>
      </div>
      <div class="col-md-8 d-grid gap-2 mt-3">
        <button class="btn btn-success" @click="goUpdate">Cập nhật</button>
        <button class="btn btn-danger" @click="deleteInfo">Xóa tài khoản</button>
      </div>
    </div>
    <!-- Ngược lại -->
    <div v-else>
      <p class="text-center"><b>Đang tải ....</b></p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import router from "@/router";

const route = useRoute();
const users = ref(null); // tạo state lưu thông tin

const getInfo = async () => {
  try {
    const id = route.params.id;
    const res = await axios.get(
      `http://localhost:8080/api/nhanvien/get-nv/${id}`
    );
    users.value = res.data.data;
  } catch (error) {
    alert(error.response?.data?.message || "Lấy thông tin không thành công");
  }
};

const deleteInfo = async () => {
  try {
    const id = route.params.id;
    if (confirm("Bạn có chắc muốn xoá tài khoản này không?")) {
        const res = await axios.delete(`http://localhost:8080/api/nhanvien/delete-nv/${id}`);
        alert(res.data.message || "Xóa tài khoản thành công");
        localStorage.removeItem("_id");
        localStorage.removeItem("token");
        setTimeout(() => {
            router.push("/");
        }, 500);
    }
  } catch (error) {
    alert(error.response?.data?.message || "Xóa tài khoản không thành công");
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN"); 
};


const goUpdate = () => {
  const id = route.params.id;
  router.push(`/update-nv/${id}`);
};
onMounted(getInfo);
</script>
