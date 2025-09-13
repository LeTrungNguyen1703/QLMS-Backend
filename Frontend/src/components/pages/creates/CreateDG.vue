<template>
  <div class="container">
    <form @submit.prevent="addDG">
      <h1 class="text-success text-center">ĐĂNG KÝ</h1>
      <div>
        <div class="mb-3">
          <input
            type="text"
            v-model="form.holot"
            class="form-control w-25 d-block mx-auto"
            placeholder="Nhập họ lót"
          />
        </div>
        <div class="mb-3">
          <input
            type="text"
            v-model="form.ten"
            class="form-control w-25 d-block mx-auto"
            placeholder="Nhập tên"
          />
        </div>
        <div class="mb-3">
          <input
            type="date"
            v-model="form.ngaysinh"
            class="form-control w-25 d-block mx-auto"
          />
        </div>
        <div class="mb-3">
          <select v-model="form.phai" class="form-control w-25 d-block mx-auto">
            <option disabled value="">Chọn giới tính</option>
            <option value="nam">Nam</option>
            <option value="nữ">Nữ</option>
          </select>
        </div>
        <div class="mb-3">
          <input
            type="text"
            v-model="form.diachi"
            class="form-control w-25 d-block mx-auto"
            placeholder="Nhập địa chỉ"
          />
        </div>
        <div class="mb-3">
          <input
            type="text"
            v-model="form.sodienthoai"
            class="form-control w-25 d-block mx-auto"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <button
          type="submit"
          class="form-control bg-success text-white text-center w-25 d-block mx-auto"
        >
          Đăng ký
        </button>
        <p class="mt-3 text-center">
          Bạn đã có tài khoản?
          <a href="/">Đăng nhập tại đây</a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  holot: "",
  ten: "",
  ngaysinh: "",
  phai: "",
  diachi: "",
  sodienthoai: "",
});

const addDG = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/docgia/add-dg",
      form.value
    );

    alert(res.data.message || "Thêm độc giả thành công");

    // Reset form
    form.value = {
      holot: "",
      ten: "",
      ngaysinh: "",
      phai: "",
      diachi: "",
      sodienthoai: "",
    };

    // Chuyển hướng sang bảng độc giả
    setTimeout(() => {
      router.push("/table-dg");
    }, 500);
  } catch (error) {
    alert(error.response?.data?.message || "Thêm độc giả không thành công");
  }
};
</script>
