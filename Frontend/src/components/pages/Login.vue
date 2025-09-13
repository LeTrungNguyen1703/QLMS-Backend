<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const form = ref({
  sodienthoai: "",
  matkhau: "",
});

const login = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/nhanvien/login",
      form.value
    );
    alert(res.data.message || "Đăng nhập thành công");
    const id = res.data.id;
    // Cập nhật localStorage
    const token = res.data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("_id", id);
    // Reset form
    form.value.sodienthoai = "";
    form.value.matkhau = "";
    window.location.href = "/home";
  } catch (error) {
    alert(error.response?.data?.message || "Đăng nhập không thành công");
  }
};
</script>

<template>
  <div class="container">
    <form @submit.prevent="login">
      <h1 class="text-success text-center">ĐĂNG NHẬP</h1>
      <div>
        <div class="mb-3">
          <input
            type="text"
            v-model="form.sodienthoai"
            class="form-control w-25 d-block mx-auto"
            placeholder="Nhập số điện thoại"
          />
        </div>
        <div class="mb-3">
          <input
            type="password"
            v-model="form.matkhau"
            class="form-control w-25 d-block mx-auto"
            placeholder="Nhập mật khẩu"
          />
        </div>
        <button
          type="submit"
          class="form-control bg-success text-white text-center w-25 d-block mx-auto"
        >
          Đăng nhập
        </button>
        <p class="mt-3 text-center">
          Bạn chưa có tài khoản? <a href="/register">đăng ký tại đây </a>
        </p>
      </div>
    </form>
  </div>
</template>
